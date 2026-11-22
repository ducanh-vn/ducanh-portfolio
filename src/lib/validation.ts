import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_BYTES } from '@/constants/storage';

/** Returns an error message for an unacceptable avatar file, or null when it is fine. */
export function validateAvatar(type: string, size: number): string | null {
  if (!ALLOWED_IMAGE_TYPES[type]) return 'Chỉ hỗ trợ ảnh JPG, PNG, WEBP, GIF hoặc AVIF.';
  if (size > MAX_AVATAR_BYTES) return 'Ảnh vượt quá 4 MB. Vui lòng chọn ảnh nhỏ hơn.';
  return null;
}
