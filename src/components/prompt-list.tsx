'use client';

import Image from 'next/image';
import Link from 'next/link';
import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import type { Prompt } from '@/lib/db/schema';
import { useDebounceValue } from '@/lib/debounce';
import { usePrompts } from '@/service/api/prompts';

import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface PromptListProps {
  prompts: Prompt[];
}

export function PromptList({ prompts }: PromptListProps) {
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  const debouncedQuery = useDebounceValue(query, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = usePrompts(
    debouncedQuery,
    {
      prompts,
      total: prompts.length,
      totalPage: 1,
    }
  );

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
  const displayPrompts = data?.pages.flatMap((page) => page.prompts) || prompts;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {displayPrompts.map((prompt) => (
        <Card
          key={prompt.id}
          className="group rounded-none p-0 transition-all duration-200 hover:ring hover:ring-primary"
        >
          <CardContent className="p-0">
            {/* Image Preview */}
            <Link href={`/p/${prompt.id}`}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={prompt.thumbnailUrl || ''}
                  alt={prompt.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            {/* Content */}
            <div className="p-4">
              <Link href={`/p/${prompt.id}`}>
                <h3 className="mb-2 text-balance font-semibold text-foreground">
                  {prompt.title}
                </h3>
              </Link>
              <p className="mb-3 line-clamp-3 text-muted-foreground text-xs leading-relaxed">
                {prompt.prompt}
              </p>

              <div className="mb-3 flex flex-wrap gap-1">
                {(prompt.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {isFetchingNextPage && (
        <div className="col-span-full flex justify-center py-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
