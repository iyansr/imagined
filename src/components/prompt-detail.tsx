'use client';

import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth/auth-client';
import type { Prompt } from '@/lib/db/schema';
import { api } from '@/lib/trpc/client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface PromptDetailProps {
  prompt: Prompt;
}

export function PromptDetail({ prompt }: PromptDetailProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: session } = authClient.useSession();
  const utils = api.useUtils();

  const deletePromptMutation = api.prompt.delete.useMutation({
    onSuccess: () => {
      toast.success('Prompt deleted successfully');
      router.back();
      utils.prompt.list.invalidate();
      utils.prompt.myPrompts.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete prompt');
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(prompt.prompt);
    toast.success('Prompt copied to clipboard');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    deletePromptMutation.mutate({ id: prompt.id });
  };

  // Check if the current user is the owner of the prompt
  const isOwner = session?.user?.id === prompt.userId;

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

          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" disabled={isDeleting}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your prompt and remove the associated image from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
