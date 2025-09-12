'use client';

import { useRouter } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { Dialog, DialogContent, DialogOverlay } from './ui/dialog';

export function DetailDialog({ children }: PropsWithChildren) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogOverlay>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-4xl">
          {children}
        </DialogContent>
      </DialogOverlay>
    </Dialog>
  );
}
