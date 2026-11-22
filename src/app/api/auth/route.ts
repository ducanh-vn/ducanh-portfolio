import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  getAdminPassword,
  setAdminPassword,
  get2FAStatus,
  generate2FASetup,
  verifyAndEnable2FA,
  disable2FA,
  verify2FAToken,
} from '@/lib/auth';
import { hasAdminSession, pending2FACookieOptions, sessionCookieOptions } from '@/lib/session';
import {
  MIN_PASSWORD_LENGTH,
  PENDING_2FA_COOKIE,
  PENDING_2FA_VALUE,
  SESSION_COOKIE,
  SESSION_VALUE,
  TOTP_CODE_LENGTH,
} from '@/constants/auth';

export async function GET() {
  const isAuthenticated = hasAdminSession();
  const { enabled: twoFactorEnabled } = get2FAStatus();

  return NextResponse.json({
    authenticated: isAuthenticated,
    twoFactorEnabled,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, password, oldPassword, newPassword, code } = body;

    const cookieStore = cookies();

    // 1. LOGOUT
    if (action === 'logout') {
      cookieStore.delete(SESSION_COOKIE);
      cookieStore.delete(PENDING_2FA_COOKIE);
      return NextResponse.json({ success: true, message: 'Logged out' });
    }

    // 2. CHANGE PASSWORD
    if (action === 'change_password') {
      if (!hasAdminSession()) {
        return NextResponse.json({ success: false, error: 'Phiên làm việc không hợp lệ' }, { status: 401 });
      }

      const currentPass = getAdminPassword();
      if (!oldPassword || oldPassword !== currentPass) {
        return NextResponse.json({ success: false, error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
      }

      if (!newPassword || newPassword.trim().length < MIN_PASSWORD_LENGTH) {
        return NextResponse.json({ success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 });
      }

      const success = setAdminPassword(newPassword.trim());
      if (success) {
        return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công!' });
      } else {
        return NextResponse.json({ success: false, error: 'Không thể ghi tệp cấu hình' }, { status: 500 });
      }
    }

    // 3. 2FA SETUP (Generate QR Code & Secret)
    if (action === 'setup_2fa') {
      if (!hasAdminSession()) {
        return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập lại' }, { status: 401 });
      }

      const setupData = await generate2FASetup();
      return NextResponse.json({ success: true, ...setupData });
    }

    // 4. VERIFY & ENABLE 2FA
    if (action === 'verify_enable_2fa') {
      if (!hasAdminSession()) {
        return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập lại' }, { status: 401 });
      }

      if (!code || code.trim().length !== TOTP_CODE_LENGTH) {
        return NextResponse.json({ success: false, error: 'Mã xác thực phải gồm 6 chữ số' }, { status: 400 });
      }

      const enabled = verifyAndEnable2FA(code.trim());
      if (enabled) {
        return NextResponse.json({ success: true, message: 'Kích hoạt xác thực 2 lớp thành công!' });
      } else {
        return NextResponse.json({ success: false, error: 'Mã xác thực không hợp lệ. Vui lòng kiểm tra lại đồng hồ thiết bị hoặc thử mã mới.' }, { status: 400 });
      }
    }

    // 5. DISABLE 2FA
    if (action === 'disable_2fa') {
      if (!hasAdminSession()) {
        return NextResponse.json({ success: false, error: 'Vui lòng đăng nhập lại' }, { status: 401 });
      }

      if (!password) {
        return NextResponse.json({ success: false, error: 'Vui lòng nhập mật khẩu hiện tại' }, { status: 400 });
      }

      const result = disable2FA(password);
      if (result.success) {
        return NextResponse.json({ success: true, message: 'Đã tắt xác thực 2 lớp thành công' });
      } else {
        return NextResponse.json({ success: false, error: result.error || 'Không thể tắt 2FA' }, { status: 400 });
      }
    }

    // 6. LOGIN STEP 2: VERIFY 2FA CODE
    if (action === 'verify_2fa_login') {
      const pendingCookie = cookieStore.get(PENDING_2FA_COOKIE);
      if (!pendingCookie || pendingCookie.value !== PENDING_2FA_VALUE) {
        return NextResponse.json({ success: false, error: 'Phiên đăng nhập đã hết hạn. Vui lòng nhập lại mật khẩu.' }, { status: 401 });
      }

      if (!code || code.trim().length !== TOTP_CODE_LENGTH) {
        return NextResponse.json({ success: false, error: 'Mã xác thực gồm 6 chữ số' }, { status: 400 });
      }

      const isValid = verify2FAToken(code.trim());
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Mã xác thực 2FA không chính xác hoặc đã hết hạn.' }, { status: 400 });
      }

      // Valid 2FA! Establish authenticated admin session
      cookieStore.delete(PENDING_2FA_COOKIE);
      cookieStore.set(SESSION_COOKIE, SESSION_VALUE, sessionCookieOptions());

      return NextResponse.json({ success: true, message: 'Xác thực thành công' });
    }

    // 7. LOGIN STEP 1 (Password verification)
    const validPassword = getAdminPassword();

    if (password !== validPassword) {
      return NextResponse.json({ success: false, error: 'Mật khẩu không chính xác' }, { status: 401 });
    }

    const { enabled: is2FAEnabled } = get2FAStatus();

    if (is2FAEnabled) {
      // 2FA required: set pending cookie for 5 minutes
      cookieStore.set(PENDING_2FA_COOKIE, PENDING_2FA_VALUE, pending2FACookieOptions());

      return NextResponse.json({
        success: true,
        require2FA: true,
        message: 'Yêu cầu xác thực bước 2 (Google Authenticator)',
      });
    }

    // 2FA not enabled: direct login
    cookieStore.set(SESSION_COOKIE, SESSION_VALUE, sessionCookieOptions());

    return NextResponse.json({ success: true, require2FA: false, message: 'Đăng nhập thành công' });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ error: 'Lỗi máy chủ nội bộ' }, { status: 500 });
  }
}
