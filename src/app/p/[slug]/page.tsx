export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div>
      <p>Detail for {(await params).slug}</p>
    </div>
  );
}
