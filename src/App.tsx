import React from 'react';
import { FaFileVideo, FaGithub, FaUpload, FaWandMagic } from 'react-icons/fa6';

import { Button } from './components/ui/button';
import { Label } from './components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { Separator } from './components/ui/separator';
import { Slider } from './components/ui/slider';
import { Textarea } from './components/ui/textarea';

export const App = () => {
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

            <Button variant="outline">
              <FaGithub className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </div>
        </header>

        <main className="flex-1 flex p-6 gap-6">
          <div className="flex flex-col flex-1 gap-4">
            <div className="grid grid-rows-2 gap-4 flex-1 rounded-md">
              <Textarea
                className="resize-none p-4 leading-relaxed placeholder:text-zinc-500"
                placeholder="Inclua o prompt para a IA..."
              />
              <Textarea
                className="resize-none p-4 leading-relaxed placeholder:text-zinc-500"
                placeholder="Resultado gerado pela IA..."
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
            <form action="#" className="space-y-6">
              <label
                htmlFor="video"
                className="border flex rounded-md aspect-video cursor-pointer border-dashed 
                text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary/5"
              >
                <FaFileVideo className="w-4 h-4" />
                Selecione um Vídeo
              </label>
              <input
                type="file"
                name="video"
                id="video"
                accept="video/mp4"
                className="sr-only"
              />

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="transcription_prompt">
                  Prompt de Transcrição
                </Label>
                <Textarea
                  id="transcription_prompt"
                  className="h20 resize-none leading-relaxed placeholder:text-zinc-500"
                  placeholder="Inclua palavras chave mencionadas no vídeo separadas por vírgula(,)."
                />
              </div>

              <Button type="submit" className="w-full">
                Carregar Vídeo <FaUpload className="w-4 h-4 ml-1" />
              </Button>
            </form>

            <Separator />

            <form action="#" className="space-y-6">
              <div className="space-y-2">
                <Label>Prompt</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um prompt" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Título do Vídeo</SelectItem>
                    <SelectItem value="description">
                      Descrição do Vídeo
                    </SelectItem>
                    <SelectItem disabled value="future">
                      Futuros prompts...
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <Select disabled defaultValue="gpt3.5">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt3.5">GPT 3.5 Turno 16K</SelectItem>
                  </SelectContent>
                </Select>
                <span className="block text-xs italic text-muted-foreground">
                  Você poderá customizar essa opção em breve.
                </span>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Modelo</Label>
                <Slider min={0} max={1} step={0.1} />
                <span className="block text-xs italic text-muted-foreground leading-relaxed">
                  Valores mais altos tendem a deixar o resultado mais criativo e
                  com possíveis erros.
                </span>
              </div>

              <Separator />

              <Button type="submit" className="w-full">
                Executar <FaWandMagic className="w-4 h-4 ml-1" />
              </Button>
            </form>
          </aside>
        </main>
      </div>
    </React.Fragment>
  );
};
