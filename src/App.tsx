import { useCompletion } from 'ai/react';
import React from 'react';
import { FaGithub, FaWandMagic } from 'react-icons/fa6';

import { SelectPrompt } from '@/components/select-prompt/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { VideoInputForm } from '@/components/video/input-form';
import { env } from '@/lib/env';

export const App = () => {
  const [temperature, setTemperature] = React.useState(0);
  const [videoId, setVideoId] = React.useState<string | null>(null);

  const {
    input,
    setInput,
    isLoading,
    completion,
    handleSubmit,
    handleInputChange,
  } = useCompletion({
    streamProtocol: 'text',
    api: env.VITE_API_URL.concat('/videos/')
      .concat(videoId || '')
      .concat('/create'),
    body: {
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (
    <React.Fragment>
      <div className="min-h-screen flex flex-col">
        <header
          id="header"
          className="h-16 px-6 py-3 flex items-center justify-between border-b"
        >
          <span id="logo" className="flex items-center justify-center">
            <img
              id="img-logo"
              src="/educamind.png"
              alt="logo-educamind"
              className="w-10"
            />
            <span
              id="text-logo"
              className="ml-1 text-2xl font-bold text-zinc-300"
            >
              educa
              <span className="text-green-700">mind</span>
            </span>
            <p className="ml-2 text-muted-foreground leading-relaxed">
              Projeto mvp para uma plataforma LMS em desenvolvimento.
            </p>
          </span>
          <div className="flex items-center gap-4">
            <a
              className="text-sm text-muted-foreground link hover:underline"
              title="Dev Juneo"
              target="_blank"
              href="https://www.dev-juneo.com"
            >
              dev-juneo
            </a>

            <Separator orientation="vertical" className="h-6" />

            <a target="_blank" href="https://www.github.com/adairjuneoaf">
              <Button variant="outline">
                <FaGithub className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </a>
          </div>
        </header>

        <main className="flex-1 flex p-6 gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1 rounded-md">
              <Textarea
                name="prompt"
                className="resize-none p-4 leading-relaxed placeholder:text-zinc-500"
                placeholder="Inclua o prompt para a IA..."
                value={input}
                onChange={handleInputChange}
              />
              <Textarea
                name="messages"
                className="resize-none p-4 leading-relaxed placeholder:text-zinc-500"
                placeholder="Resultado gerado pela IA..."
                value={completion}
                onChange={() => {}}
              />
            </div>

            <p>
              Lembre-se: Você pode utilizar a variável&nbsp;
              <code className="text-green-700">{'{transcription}'}</code> no seu
              prompt para adicionar o conteúdo da transcrição do vídeo
              selecionado.
            </p>
          </div>

          <aside className="w-80 space-y-6">
            <VideoInputForm
              onChangeVideoId={(id: string | null) => setVideoId(id)}
            />

            <Separator />

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <SelectPrompt
                  onChangePrompt={(template) => setInput(template || '')}
                />
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5 Turbo 16K</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-xs italic text-muted-foreground">
                  Você poderá customizar essa opção em breve.
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Modelo</Label>
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => {
                    setTemperature(value[0]);
                  }}
                />
                <span className="block text-xs italic text-muted-foreground leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo e
                  com possíveis erros.
                </span>
              </div>

              <Separator />

              <Button disabled={isLoading} type="submit" className="w-full">
                <FaWandMagic className="w-4 h-4 ml-1" />
                Executar
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </React.Fragment>
  );
};
