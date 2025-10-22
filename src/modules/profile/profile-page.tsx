'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useEffect } from 'react';

import { PromptCard, PromptCardSkeleton } from '@/components/prompt-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authClient } from '@/lib/auth/auth-client';
import { useDebounceValue } from '@/lib/debounce';
import { api } from '@/lib/trpc/client';

export function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [query] = useQueryState('q', parseAsString.withDefault(''));

  const debouncedQuery = useDebounceValue(query, 500);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.prompt.myPrompts.useInfiniteQuery(
      { q: debouncedQuery, limit: 12 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
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
  const displayPrompts = data?.pages.flatMap((page) => page.prompts) || [];

  if (isPending) {
    return (
      <div className="container mx-auto px-4 pt-12">
        <div className="animate-pulse">
          <div className="mb-8 flex items-center gap-4">
            <div className="size-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="h-4 w-64 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 pt-12">
        <div className="text-center">
          <p className="text-muted-foreground">
            Please sign in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12">
      {/* User Profile Section */}
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="size-16">
            <AvatarImage src={session.user.image || ''} />
            <AvatarFallback className="text-lg">
              {(session.user.name || '').charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-bold text-2xl">{session.user.name}</h1>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      {/* Prompts Section */}
      <div>
        <h2 className="mb-6 font-semibold text-xl">My Prompts</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <PromptCardSkeleton key={String(index)} />
            ))}
          </div>
        ) : displayPrompts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              You haven't created any prompts yet.
            </p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
