import fs from 'fs';
import path from 'path';
import { get, put } from '@vercel/blob';

/**
 * Server-only storage. On Vercel the deployment filesystem is read-only, so data and
 * uploads go to Vercel Blob when BLOB_READ_WRITE_TOKEN is set; locally they use disk.
 */
export function hasBlobStore(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/** Read a JSON blob straight from origin (no CDN cache). Returns null if it does not exist yet. */
export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  const result = await get(pathname, { access: 'public', useCache: false });
  if (!result || result.statusCode !== 200) return null;
  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60,
  });
}

/** Store a public file and return its URL (Blob URL in production, /path locally). */
export async function savePublicFile(pathname: string, body: Buffer, contentType: string): Promise<string> {
  if (hasBlobStore()) {
    const blob = await put(pathname, body, { access: 'public', contentType, addRandomSuffix: false });
    return blob.url;
  }

  const target = path.join(process.cwd(), 'public', pathname);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, body);
  return `/${pathname}`;
}
