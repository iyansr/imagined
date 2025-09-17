import { useInfiniteQuery } from '@tanstack/react-query';

import type { Prompt } from '@/lib/db/schema';

interface PromptsResponse {
  prompts: Prompt[];
  total: number;
  totalPage: number;
}

export function usePrompts(query: string, initialData?: PromptsResponse) {
  return useInfiniteQuery<PromptsResponse>({
    queryKey: ['prompts', query],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        body: JSON.stringify({ 
          q: query,
          page: pageParam,
          limit: 12 // Using the same PAGE_SIZE as in the API
        }),
      });
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      // If we've reached the last page, return undefined to stop fetching
      if (lastPage.prompts.length === 0 || lastPage.totalPage <= 1) {
        return undefined;
      }
      
      // Calculate the next page number based on the current data
      const currentPage = Math.ceil(lastPage.total / lastPage.prompts.length);
      return currentPage < lastPage.totalPage ? currentPage + 1 : undefined;
    },
    initialData: query === '' && initialData ? {
      pages: [initialData],
      pageParams: [1]
    } : undefined,
  });
}
