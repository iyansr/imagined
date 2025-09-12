import { DetailDialog } from '@/components/detail-dialog';
import { PromptDetail } from '@/components/prompt-detail';
import { DialogTitle } from '@/components/ui/dialog';
import { getDb } from '@/lib/db/database';

export default async function PromptDetailModal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  const prompt = await getDb().query.prompt.findFirst({
    where: (prompt, { eq }) => eq(prompt.id, slug),
    with: {
      user: true,
    },
  });

  if (!prompt) {
    return null;
  }

  return (
    <DetailDialog>
      <DialogTitle className="text-center">Prompt Title</DialogTitle>
      <PromptDetail prompt={prompt} />
    </DetailDialog>
  );
}
