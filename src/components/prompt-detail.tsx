'use client';

import Image from 'next/image';
import { toast } from 'sonner';

import type { Prompt } from '@/lib/db/schema';

import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PromptDetailProps {
  prompt: Prompt;
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={prompt.thumbnailUrl || ''}
            alt={prompt.title}
            className="object-cover"
            fill
          />
        </div>

        <div className="mt-4 mb-3 flex flex-wrap gap-1">
          {(prompt.tags || []).map((tag) => (
            <Badge key={tag} className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col md:col-span-2">
        <div className="max-h-[400px] overflow-y-auto bg-muted p-4 text-muted-foreground text-xs">
          <pre className="whitespace-pre-wrap">{prompt.prompt}</pre>
        </div>

        <div className="mt-4 flex items-center justify-end gap-4">
          <Button size="sm" variant="outline" onClick={handleCopyLink}>
            Share
          </Button>
          <Button size="sm" onClick={handleCopyPrompt}>
            Copy Prompt
          </Button>
        </div>
      </div>
    </div>
  );
}
