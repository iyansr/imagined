import { Search } from 'lucide-react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
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
        {Array.from({ length: 10 }).map((_, index) => (
          <Link href={`/p/${String(index)}`} key={String(index)}>
            <Card className="group rounded-none p-0 transition-all duration-200 hover:ring hover:ring-primary">
              <CardContent className="p-0">
                {/* Image Preview */}
                <div className="relative aspect-square overflow-hidden bg-muted" />

                {/* Content */}
                <div className="p-4">
                  <h3 className="mb-2 text-balance font-semibold text-foreground">
                    Title
                  </h3>
                  <p className="mb-3 line-clamp-3 text-muted-foreground text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nemo, eius rerum! Velit doloribus ipsa quibusdam voluptate
                    eos porro. Esse, soluta fuga. Voluptatem in, exercitationem
                    accusamus minima dolorem temporibus sint possimus.
                  </p>

                  {/* Author */}
                  <div className="text-muted-foreground text-xs">by 0xiyan</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
