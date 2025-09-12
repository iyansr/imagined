import { notFound } from 'next/navigation';

import { PromptDetail } from '@/components/prompt-detail';
import { getDb } from '@/lib/db/database';

export default async function PromptDetailPage({
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
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 pt-6">
      <PromptDetail prompt={prompt} />
    </div>
  );
}
