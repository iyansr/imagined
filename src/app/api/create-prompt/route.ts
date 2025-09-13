import { getCloudflareContext } from '@opennextjs/cloudflare';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateObject } from 'ai';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { type AuthSession, getAuth } from '@/lib/auth/auth';
import { getDb } from '@/lib/db/database';
import { prompt } from '@/lib/db/schema';

export async function POST(req: Request) {
  const formData = await req.formData();
  const image = formData.get('image') as File;
  const promptString = formData.get('prompt') as string;

  const session = (await getAuth().api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })) as unknown as AuthSession;

  const openrouter = createOpenRouter({
    apiKey: process.env.OPEN_ROUTER_API_KEY as string,
  });

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: 'You must be logged in',
      },
      { status: 401 }
    );
  }

  if (!promptString) {
    return NextResponse.json(
      {
        success: false,
        message: 'Prompt is required',
      },
      { status: 400 }
    );
  }

  if (!image) {
    return NextResponse.json(
      {
        success: false,
        message: 'Image is required',
      },
      { status: 400 }
    );
  }

  const ctx = await getCloudflareContext({ async: true });

  const fileExtension = image.name.split('.').pop();

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  if (image.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      {
        success: false,
        message: 'File size must be less than 5MB',
      },
      { status: 400 }
    );
  }

  const key = `${crypto.randomUUID()}.${fileExtension}`;
  await ctx.env.IMAGINED_BUCKET.put(key, image);
  // Generate URL based on environment
  let url: string;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    // For local development, create a URL that points to a local endpoint
    // You'll need to create this endpoint to serve files from R2
    url = `http://localhost:3200/api/r2/${key}`;
  } else {
    // Production URL
    url = `https://cdn-imagined.iyansr.id/${key}`;
  }

  const generateRsult = await generateObject({
    model: openrouter.chat('google/gemini-2.5-flash-lite', {
      models: ['openai/gpt-4o-mini'],
    }),
    schema: z.object({
      title: z.string().describe('Title of the prompt'),
      tags: z
        .array(z.string())
        .describe(
          'Tags of the prompt, 1 to 5 tags, e.g. ["art", "abstract", "cyberpunk"] etc'
        ),
    }),
    prompt: `Help me to create metadata for the given image generation prompt

  Prompt: ${promptString}
  `,
  });

  const [data] = await getDb()
    .insert(prompt)
    .values({
      prompt: promptString,
      thumbnailUrl: url,
      userId: session?.user?.id as string,
      title: generateRsult.object.title,
      tags: generateRsult.object.tags,
    })
    .returning();

  return NextResponse.json({
    success: true,
    data,
  });
}
