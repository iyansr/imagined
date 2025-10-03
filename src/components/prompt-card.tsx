'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

type PromptCardProps = {
  prompt: {
    id: string;
    title: string;
    prompt: string;
    thumbnailUrl: string | null;
    tags: string[] | null;
    // Include other properties that might be in the actual prompt object
    style?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <Card className="group rounded-none p-0 transition-all duration-200 hover:ring hover:ring-primary">
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
  );
}

export function PromptCardSkeleton() {
  return (
    <Card className="rounded-none p-0">
      <CardContent className="p-0">
        {/* Image Preview Skeleton */}
        <div className="relative aspect-square animate-pulse overflow-hidden bg-muted" />

        {/* Content Skeleton */}
        <div className="p-4">
          {/* Title Skeleton */}
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded-md bg-muted" />

          {/* Description Skeleton */}
          <div className="mb-3 space-y-2">
            <div className="h-3 w-full animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-5/6 animate-pulse rounded-md bg-muted" />
            <div className="h-3 w-4/6 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Tags Skeleton */}
          <div className="mb-3 flex flex-wrap gap-1">
            <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
