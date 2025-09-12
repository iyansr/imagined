import { getCloudflareContext } from '@opennextjs/cloudflare';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;

  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const ctx = await getCloudflareContext({ async: true });
    const object = await ctx.env.IMAGINED_BUCKET.get(key);

    if (!object) {
      return NextResponse.json({ error: 'Object not found' }, { status: 404 });
    }

    // Get the file content
    const data = await object.arrayBuffer();

    // Determine content type based on file extension
    const fileExtension = key.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';

    if (fileExtension) {
      const contentTypes: Record<string, string> = {
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        webp: 'image/webp',
        svg: 'image/svg+xml',
      };

      contentType = contentTypes[fileExtension] || contentType;
    }

    // Return the file with appropriate headers
    return new NextResponse(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Error fetching from R2:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve object' },
      { status: 500 }
    );
  }
}
