import { PromptDetail } from '@/components/prompt-detail';

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  console.log((await params).slug);
  return (
    <div className="container mx-auto px-4 pt-6">
      <PromptDetail />
    </div>
  );
}
