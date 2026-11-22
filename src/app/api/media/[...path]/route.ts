import { NextResponse } from 'next/server';
import { hasBlobStore, readPrivateBlob } from '@/lib/storage';
import { AVATAR_DIR } from '@/constants/storage';

export const dynamic = 'force-dynamic';

/** Serve uploaded avatars from the private Blob store. Only files under AVATAR_DIR are exposed. */
export async function GET(_request: Request, { params }: { params: { path: string[] } }) {
  const pathname = params.path.join('/');
  if (!hasBlobStore() || !pathname.startsWith(`${AVATAR_DIR}/`) || pathname.includes('..')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const file = await readPrivateBlob(pathname);
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return new Response(file.stream, {
      headers: {
        'Content-Type': file.contentType,
        // Avatar names include a timestamp, so each URL's content never changes
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Media proxy error:', error);
    return NextResponse.json({ error: 'Failed to load file' }, { status: 500 });
  }
}
