/** Treat empty or localhost links as "not available yet" so production never shows dead buttons. */
export function isUsableUrl(url?: string | null): url is string {
  if (!url) return false;
  return !/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(url.trim());
}
