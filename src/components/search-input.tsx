'use client';

import { Search } from 'lucide-react';
import { parseAsString, useQueryState } from 'nuqs';

import { Input } from './ui/input';

export function SearchInput() {
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));

  return (
    <div className="relative mx-auto max-w-2xl">
      <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        type="text"
        placeholder="Search prompts title, tags..."
        className="h-12 pl-10 text-base"
      />
    </div>
  );
}
