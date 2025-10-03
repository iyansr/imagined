/** biome-ignore-all lint/performance/noImgElement: <ignored> */
'use client';

import { Loader2Icon, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useCreatePrompt } from '@/service/api/create-prompt';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function CreatePromptPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');

  const {
    mutateAsync: createPrompt,
    isPending: isSubmitting,
    isSuccess,
  } = useCreatePrompt();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    try {
      if (!selectedImage || !prompt) {
        toast.error('Please provide both an image and a prompt');
        return;
      }

      const response = await createPrompt({
        image: selectedImage,
        prompt,
      });

      if (response.success && response.data) {
        toast.success('Prompt created successfully');
        window.location.href = `/p/${response.data.id}`;
      }
    } catch (error) {
      // Error handling is done in the hook
      console.error('Failed to create prompt:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-12">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>
                Upload the image generated from your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!imagePreview ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full cursor-pointer rounded-lg border-2 border-input border-dashed p-8 text-center transition-colors hover:border-muted-foreground"
                >
                  <Upload className="mx-auto mb-4 size-6 text-muted-foreground" />
                  <p className="mb-2 text-muted-foreground text-sm">
                    Click to upload an image
                  </p>
                  <p className="text-muted-foreground text-xs">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </button>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview || '/placeholder.svg'}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Detail</CardTitle>
              <CardDescription>Enter the detail of your prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your prompt"
                className="min-h-[300px]"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || isSuccess}
                  className={cn(
                    'transition-all',
                    isSubmitting && 'bg-orange-500 hover:bg-orange-600',
                    isSuccess && 'bg-green-500 hover:bg-green-600'
                  )}
                >
                  {isSubmitting && (
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isSuccess ? 'Saved!' : 'Save'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
