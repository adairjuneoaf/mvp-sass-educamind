import React from 'react';

import { api } from '@/lib/axios';

import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type Prompt = {
  id: string;
  title: string;
  template: string;
};

interface ISelectPromptProps {
  onChangePrompt: (template?: string) => void;
}

export const SelectPrompt = (props: ISelectPromptProps) => {
  const { onChangePrompt } = props;
  const [prompts, setPrompts] = React.useState<Prompt[] | null>(null);

  const handleSelectPrompt = (promptId: string) => {
    if (promptId) {
      const prompt = prompts?.find((prompt) => prompt.id === promptId);
      onChangePrompt(prompt?.template);
    }
  };

  React.useEffect(() => {
    api.get('/prompts').then((response) => setPrompts(response.data.content));
  }, []);

  return (
    <React.Fragment>
      <Label>Prompt</Label>
      <Select required onValueChange={handleSelectPrompt}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um prompt" />
        </SelectTrigger>
        <SelectContent>
          {prompts?.map((prompt) => {
            return (
              <SelectItem key={prompt.id} value={prompt.id}>
                {prompt.title}
              </SelectItem>
            );
          })}
          <SelectItem disabled value="future_prompts">
            Futuros prompts...
          </SelectItem>
        </SelectContent>
      </Select>
    </React.Fragment>
  );
};
