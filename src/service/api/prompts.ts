import type { Prompt } from '@/lib/db/schema';
import { api } from '@/lib/trpc/client';

interface UsePromptsProps {
  q: string;
  limit?: number;
}

export const usePrompts = ({ q, limit = 10 }: UsePromptsProps) => {
  return api.prompt.list.useInfiniteQuery(
    { q, limit },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
};

export type PromptsResponse = {
  prompts: Prompt[];
  nextCursor?: string;
};
