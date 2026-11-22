import { NextResponse } from 'next/server';
import { hasAdminSession } from '@/lib/session';
import { savePublicFile } from '@/lib/storage';
import { validateAvatar } from '@/lib/validation';
import { ALLOWED_IMAGE_TYPES, AVATAR_DIR } from '@/constants/storage';

export const dynamic = 'force-dynamic';

/** Upload a new avatar image (admin only). Responds with the public URL of the stored file. */
export async function POST(request: Request) {
  if (!hasAdminSession()) {
    return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập lại' }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy tệp ảnh' }, { status: 400 });
    }

    const invalid = validateAvatar(file.type, file.size);
    if (invalid) {
      return NextResponse.json({ success: false, error: invalid }, { status: 400 });
    }

    const pathname = `${AVATAR_DIR}/avatar-${Date.now()}.${ALLOWED_IMAGE_TYPES[file.type]}`;
    const body = Buffer.from(await file.arrayBuffer());
    const url = await savePublicFile(pathname, body, file.type);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json({ success: false, error: 'Tải ảnh lên thất bại' }, { status: 500 });
  }
}
