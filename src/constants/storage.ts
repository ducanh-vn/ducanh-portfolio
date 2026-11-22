/** Blob pathname that holds the live portfolio data in production. */
export const PORTFOLIO_BLOB_PATH = 'data/portfolio.json';

/** Folder for uploaded avatars (Blob in production, public/ locally). */
export const AVATAR_DIR = 'uploads/avatars';

/** Vercel serverless functions reject request bodies above ~4.5 MB. */
export const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
};

/** Route that streams private Blob files (avatars) to the browser. */
export const MEDIA_ROUTE = '/api/media';

/** Blob pathname for admin credentials and the 2FA secret (private store only). */
export const AUTH_BLOB_PATH = 'private/auth.json';
