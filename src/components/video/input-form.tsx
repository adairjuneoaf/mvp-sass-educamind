import { fetchFile } from '@ffmpeg/util';
import React from 'react';
import { FaFileVideo, FaSpinner, FaUpload } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/axios';
import { getFFmpeg } from '@/lib/ffmpeg';
import { cn } from '@/lib/utils';

import { Progress } from '../ui/progress';

type Status =
  | 'awaiting'
  | 'converting'
  | 'uploading'
  | 'transcribing'
  | 'finished';

const statusMessages = {
  awaiting: 'Carregar vídeo',
  converting: 'Convertendo...',
  uploading: 'Enviando...',
  transcribing: 'Transcrevendo...',
  finished: 'Finalizado!',
};

interface IVideoInputForm {
  onChangeVideoId: (videoId: string | null) => void;
}

export const VideoInputForm = (props: IVideoInputForm) => {
  const { onChangeVideoId } = props;
  const [status, setStatus] = React.useState<Status>('awaiting');
  const [progress, setProgress] = React.useState(0);
  const [videoFile, setVideoFile] = React.useState<File | null>(null);

  const promptInputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (!files) return null;

    setVideoFile(files.item(0));
  };

  const convertVideoToAudio = async (video: File) => {
    try {
      const ffmpeg = await getFFmpeg();

      await ffmpeg.writeFile('input.mp4', await fetchFile(video));

      ffmpeg.on('progress', (progress) => {
        setProgress(Math.round(progress.progress * 100));
      });

      await ffmpeg.exec([
        '-i',
        'input.mp4',
        '-map',
        '0:a',
        '-b:a',
        '20k',
        '-acodec',
        'libmp3lame',
        'output.mp3',
      ]);

      const data = await ffmpeg.readFile('output.mp3');

      const audioFileBlob = new Blob([data], { type: 'audio/mpeg' });
      const audioFile = new File([audioFileBlob], 'audio.mp3', {
        type: 'audio/mpeg',
      });

      setProgress(0);

      return audioFile;
    } catch (error) {
      setProgress(0);
      console.error(error);
      throw new Error('Error to convert video to audio.');
    }
  };

  const handleUploadVideo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataForm = new FormData();

    const userPrompt = promptInputRef.current?.value;
    if (!videoFile) return null;

    setStatus('converting');

    const audioFile = await convertVideoToAudio(videoFile);
    dataForm.append('file', audioFile);

    setStatus('uploading');

    const response = await api.post('/videos', dataForm);

    setStatus('transcribing');

    await api.post(`/videos/${response.data.content.id}/transcription`, {
      prompt: userPrompt,
    });

    setStatus('finished');

    onChangeVideoId(response.data.content.id);
  };

  const previewURL = React.useMemo(() => {
    if (!videoFile) return null;

    return URL.createObjectURL(videoFile);
  }, [videoFile]);

  return (
    <form onSubmit={handleUploadVideo} className="space-y-6">
      <label
        htmlFor="video"
        aria-disabled={status !== 'awaiting'}
        className={cn([
          'relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5',
          `${status !== 'awaiting' ? 'pointer-events-none cursor-not-allowed' : 'pointer-events-auto cursor-pointer'}`,
        ])}
      >
        {!videoFile ? (
          <React.Fragment>
            <FaFileVideo className="w-4 h-4" />
            Selecione um Vídeo
          </React.Fragment>
        ) : (
          <React.Fragment>
            <video
              src={previewURL || ''}
              controls={false}
              className="pointer-events-none absolute inset-0"
            />
            {status !== 'awaiting' && (
              <div className="z-10 inset-0 w-full h-full bg-black bg-opacity-75">
                <span className="w-full h-full inset-0 text-green-700 flex flex-col justify-center items-center space-y-1">
                  {(status === 'uploading' || status === 'transcribing') && (
                    <FaSpinner className="animate-spin text-xl" />
                  )}
                  <p className="text-sm italic text-green-700">
                    {statusMessages[status]}
                  </p>
                </span>
              </div>
            )}
          </React.Fragment>
        )}
      </label>
      <input
        type="file"
        name="video"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleFileSelected}
      />

      <Progress value={progress} className="h-2" />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de Transcrição</Label>
        <Textarea
          id="transcription_prompt"
          disabled={status !== 'awaiting'}
          className="h20 resize-none leading-relaxed placeholder:text-zinc-500"
          placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula(,)."
        />
      </div>

      <Button
        data-executing={status !== 'awaiting'}
        data-finished={status === 'finished'}
        disabled={!videoFile || status !== 'awaiting'}
        type="submit"
        className="w-full disabled:cursor-not-allowed bg-primary data-[executing=true]:bg-zinc-300 data-[finished=true]:bg-primary"
      >
        {status === 'awaiting' ? (
          <React.Fragment>
            <FaUpload className="w-4 h-4 ml-1" />
            Carregar Vídeo
          </React.Fragment>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  );
};
