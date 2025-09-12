import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getDb } from '@/lib/db/database';

export const dynamic = 'force-static';
export const revalidate = 3600;

export default async function Home() {
  const prompts = await getDb().query.prompt.findMany({
    orderBy: (prompt, { desc }) => [desc(prompt.createdAt)],
    with: {
      user: true,
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-balance font-bold text-3xl text-foreground">
          Discover Amazing Image Generation Prompts
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground">
          Find and share the best prompts for AI image generation. Browse
          thousands of creative prompts from the community and create stunning
          visuals.
        </p>

        <div className="relative mx-auto max-w-2xl">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search prompts, tags, or styles..."
            className="h-12 pl-10 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {prompts.map((prompt) => (
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
                <p className="mb-3 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
                  {prompt.prompt}
                </p>

                <div className="mb-3 flex flex-wrap gap-1">
                  {(prompt.tags || []).slice(0, 3).map((tag) => (
                    <Badge key={tag} className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Author */}
                <div className="text-muted-foreground text-xs">
                  by {prompt.user.name}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
