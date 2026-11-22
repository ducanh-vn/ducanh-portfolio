'use client';

import { useState } from 'react';
import { uploadAvatar } from '@/lib/api';
import { validateAvatar } from '@/lib/validation';

/** Uploads an avatar file and hands the stored URL to `onUploaded`. */
export function useAvatarUpload(onUploaded: (url: string) => void) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const upload = async (file: File) => {
    const invalid = validateAvatar(file.type, file.size);
    if (invalid) {
      setUploadError(invalid);
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await uploadAvatar(file);
      const resData = await res.json();
      if (res.ok && resData.success) {
        onUploaded(resData.url);
      } else {
        setUploadError(resData.error || 'Tải ảnh lên thất bại');
      }
    } catch (err) {
      setUploadError('Không thể kết nối đến máy chủ');
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, uploadError, upload };
}
