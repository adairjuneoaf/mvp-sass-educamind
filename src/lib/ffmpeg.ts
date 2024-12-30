import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import React, { useState } from 'react';

import coreURL from './ffmpeg_files/ffmpeg-core.js?url';
import wasmURL from './ffmpeg_files/ffmpeg-core.wasm?url';
import workerURL from './ffmpeg_files/ffmpeg-core.worker.js?url';

let ffmpeg: FFmpeg | null;

export const getFFmpeg = async () => {
  if (ffmpeg) return ffmpeg;

  ffmpeg = new FFmpeg();

  if (!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL,
    });
  }

  return ffmpeg;
};

export const useVideoToAudio = () => {
  const [inProgress, setInProgress] = useState(false);
  const [progressPerCent, setProgressPerCent] = useState(0);

  const convert = React.useCallback(async (video: File) => {
    // console.log('Convert started!');

    try {
      const ffmpeg = await getFFmpeg();

      await ffmpeg.writeFile('input.mp4', await fetchFile(video));

      // ffmpeg.on('log', (log) => console.log('🟡 log ffmpeg > ', log));
      ffmpeg.on('progress', (progress) => {
        setInProgress(true);
        setProgressPerCent(Math.round(progress.progress * 100));
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

      // console.log('🟢 Convert finished!');
      setInProgress(false);
      setProgressPerCent(0);

      return audioFile;
    } catch (error) {
      setInProgress(false);
      setProgressPerCent(0);
      console.error(error);
      throw new Error('Error to convert video to audio.');
    }
  }, []);

  return { convert, inProgress, progressPerCent };
};
