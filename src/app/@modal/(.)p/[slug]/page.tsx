import { DetailDialog } from '@/components/detail-dialog';
import { PromptDetail } from '@/components/prompt-detail';
import { DialogTitle } from '@/components/ui/dialog';

export default async function PromptDetailModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  console.log((await params).slug);
  return (
    <DetailDialog>
      <DialogTitle className="text-center">Prompt Title</DialogTitle>
      <PromptDetail />
    </DetailDialog>
  );
}
