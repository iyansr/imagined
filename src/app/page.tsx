import { Suspense } from 'react';

import { PromptList } from '@/components/prompt-list';
import { SearchInput } from '@/components/search-input';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12 pt-6 text-center">
        <h2 className="mb-4 text-balance font-bold text-3xl text-foreground">
          Discover Amazing Image Generation Prompts
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
          Find and share the best prompts for AI image generation. Browse
          thousands of creative prompts from the community and create stunning
          visuals.
        </p>

        <Suspense
          fallback={
            <div className="mx-auto h-10 w-full max-w-md animate-pulse rounded-md bg-muted" />
          }
        >
          <SearchInput />
        </Suspense>
      </div>

      <PromptList />
    </main>
  );
}
