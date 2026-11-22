import fs from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';
import { MEDIA_ROUTE } from '@/constants/storage';

/**
 * Server-only storage. On Vercel the deployment filesystem is read-only, so data and
 * uploads go to a private Vercel Blob store when BLOB_STORE_ID (OIDC) or
 * BLOB_READ_WRITE_TOKEN is set; locally they use disk. Private blobs are served to
 * browsers through /api/media.
 */
export function hasBlobStore(): boolean {
  // Either a classic read-write token, or a store id used with Vercel OIDC (the SDK picks it up)
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** Read a JSON blob straight from origin (no CDN cache). Returns null if it does not exist yet. */
export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

/** Store a file the site displays and return the URL browsers should load it from. */
export async function savePublicFile(pathname: string, body: Buffer, contentType: string): Promise<string> {
  if (hasBlobStore()) {
    await put(pathname, body, { access: 'private', contentType, addRandomSuffix: false });
    return `${MEDIA_ROUTE}/${pathname}`;
  }

  const target = path.join(process.cwd(), 'public', pathname);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  return `/${pathname}`;
}

/** Stream a private blob (used by the /api/media proxy). Returns null when it does not exist. */
export async function readPrivateBlob(pathname: string) {
  const result = await get(pathname, { access: 'private' });
  if (!result || result.statusCode !== 200) return null;
  return { stream: result.stream, contentType: result.blob.contentType };
}
