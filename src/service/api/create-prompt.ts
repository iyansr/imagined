import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { api } from '@/lib/trpc/client';

interface CreatePromptInput {
  image: File;
  prompt: string;
}

interface CreatePromptResponse {
  success: boolean;
  data?: { id: string };
  message?: string;
}

export const useCreatePrompt = () => {
  const utils = api.useUtils();
  // Direct API call for creating prompts
  const createPromptMutation = useMutation({
    mutationFn: async ({ image, prompt }: CreatePromptInput) => {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt);

      const res = await fetch('/api/create-prompt', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(res.statusText || 'Failed to create prompt');
      }

      const json: CreatePromptResponse = await res.json();

      if (!json.success) {
        throw new Error(json.message || 'Failed to create prompt');
      }

      return json;
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      utils.prompt.list.invalidate();
    },
  });

  return createPromptMutation;
};
