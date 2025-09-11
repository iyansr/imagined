import { DetailDialog } from '@/components/detail-dialog';
import { Button } from '@/components/ui/button';
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
      <div className="grid grid-cols-3 gap-6 pt-6">
        <div className="col-span-1">
          <div className="relative aspect-square w-full bg-muted" />
        </div>

        <div className="col-span-2 flex flex-col">
          <div className="max-h-[400px] overflow-y-auto bg-muted p-4 text-muted-foreground text-xs">
            <pre className="whitespace-pre-wrap">
              {`Create a photorealistic portrait of a young woman in her mid-20s with natural lighting and a shallow depth of field. 
              
She should have long, flowing dark brown hair with subtle highlights, warm olive skin tone, and expressive hazel eyes. 
  
Capture her in a candid moment, looking slightly off-camera with a genuine smile that creates subtle dimples. 

She's wearing a casual white linen shirt with rolled-up sleeves against a soft, blurred neutral background. 

The composition should follow the rule of thirds, with the focus on her face while maintaining professional studio-quality lighting that emphasizes the natural contours of her features. 

Include delicate details like individual strands of hair catching the light and the natural texture of her skin. 

The overall mood should be warm, inviting, and authentic, avoiding any artificial or overly processed looks. 

Use a high-resolution format with particular attention to maintaining realistic skin textures and natural color grading.`}
            </pre>
          </div>

          <div className="mt-4 flex items-center justify-end gap-4">
            <Button size="sm" variant="outline">
              Share
            </Button>
            <Button size="sm">Copy Prompt</Button>
          </div>
        </div>
      </div>
    </DetailDialog>
  );
}
