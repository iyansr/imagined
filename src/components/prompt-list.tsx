'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { useDebounceValue } from '@/lib/debounce';
import { usePrompts } from '@/service/api/prompts';

import { PromptCard, PromptCardSkeleton } from './prompt-card';

export function PromptList() {
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  const debouncedQuery = useDebounceValue(query, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePrompts({
      q: debouncedQuery,
    });

  // Handle infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 500 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten the pages array to get all prompts
  const displayPrompts = data?.pages.flatMap((page) => page.prompts) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <PromptCardSkeleton key={String(index)} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayPrompts.map((prompt) => (
        <PromptCard key={prompt.id} prompt={prompt} />
      ))}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
