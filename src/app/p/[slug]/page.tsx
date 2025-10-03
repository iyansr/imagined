import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { PromptDetail } from '@/components/prompt-detail';
import { createCaller } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;

  // Create tRPC caller for server-side
  const context = await createTRPCContext({ headers: await headers() });
  const trpc = createCaller(context);

  // Fetch prompt using tRPC
  const result = await trpc.prompt.detail({ id: slug });
  const prompt = result.data;

  if (!prompt) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 pt-6">
      <PromptDetail prompt={prompt} />
    </div>
  );
}
