import fs from 'fs';
import path from 'path';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import type { AuthData, TwoFactorSetup } from '@/types/auth';
import { DEFAULT_ADMIN_PASSWORD, QR_CODE_OPTIONS, TOTP_ISSUER, TOTP_LABEL } from '@/constants/auth';
import { AUTH_BLOB_PATH } from '@/constants/storage';
import { hasBlobStore, readJsonBlob, writeJsonBlob } from '@/lib/storage';
import { hashPassword, verifyPassword } from '@/lib/password';

/**
 * Admin credentials live in the private Blob store on Vercel and in src/data/auth.json
 * locally (that file is git-ignored). Until a password is changed from the admin UI,
 * the password comes from the ADMIN_PASSWORD environment variable.
 */
const authFilePath = path.join(process.cwd(), 'src', 'data', 'auth.json');

function normalize(json: Partial<AuthData> | null): AuthData {
  return {
    password: json?.password || DEFAULT_ADMIN_PASSWORD,
    updatedAt: json?.updatedAt || new Date().toISOString(),
    twoFactor: {
      enabled: Boolean(json?.twoFactor?.enabled),
      secret: json?.twoFactor?.secret || '',
      tempSecret: json?.twoFactor?.tempSecret || '',
    },
  };
}

export async function getAuthData(): Promise<AuthData> {
  try {
    if (hasBlobStore()) {
      return normalize(await readJsonBlob<AuthData>(AUTH_BLOB_PATH));
    }
    if (fs.existsSync(authFilePath)) {
      return normalize(JSON.parse(fs.readFileSync(authFilePath, 'utf8')));
    }
  } catch (error) {
    console.error('Error reading auth data:', error);
  }
  return normalize(null);
}

export async function saveAuthData(data: AuthData): Promise<boolean> {
  try {
    if (hasBlobStore()) {
      await writeJsonBlob(AUTH_BLOB_PATH, data);
    } else {
      fs.writeFileSync(authFilePath, JSON.stringify(data, null, 2), 'utf8');
    }
    return true;
  } catch (error) {
    console.error('Error saving auth data:', error);
    return false;
  }
}

/** True when `candidate` matches the current admin password (hashed or legacy plain text). */
export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const data = await getAuthData();
  return verifyPassword(candidate, data.password);
}

export async function setAdminPassword(newPassword: string): Promise<boolean> {
  const data = await getAuthData();
  data.password = hashPassword(newPassword);
  data.updatedAt = new Date().toISOString();
  return saveAuthData(data);
}

export async function get2FAStatus(): Promise<{ enabled: boolean }> {
  const data = await getAuthData();
  return { enabled: Boolean(data.twoFactor?.enabled && data.twoFactor?.secret) };
}

export async function generate2FASetup(): Promise<TwoFactorSetup> {
  const data = await getAuthData();
  const secret = generateSecret();
  const uri = generateURI({
    issuer: TOTP_ISSUER,
    label: TOTP_LABEL,
    secret: secret,
  });

  const qrCodeUrl = await QRCode.toDataURL(uri, QR_CODE_OPTIONS);

  // Save tempSecret to verify before permanently enabling
  if (!data.twoFactor) {
    data.twoFactor = { enabled: false };
  }
  data.twoFactor.tempSecret = secret;
  if (!(await saveAuthData(data))) {
    throw new Error('Failed to store 2FA setup');
  }

  return { secret, qrCodeUrl, uri };
}

export async function verifyAndEnable2FA(token: string): Promise<boolean> {
  const data = await getAuthData();
  const tempSecret = data.twoFactor?.tempSecret;
  if (!tempSecret) return false;

  const result = verifySync({ token: token.trim(), secret: tempSecret });
  if (result && result.valid) {
    data.twoFactor = {
      enabled: true,
      secret: tempSecret,
      tempSecret: '',
    };
    data.updatedAt = new Date().toISOString();
    return saveAuthData(data);
  }

  return false;
}

export async function disable2FA(currentPassword: string): Promise<{ success: boolean; error?: string }> {
  const data = await getAuthData();
  if (!verifyPassword(currentPassword, data.password)) {
    return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
  }

  data.twoFactor = {
    enabled: false,
    secret: '',
    tempSecret: '',
  };
  data.updatedAt = new Date().toISOString();
  if (!(await saveAuthData(data))) {
    return { success: false, error: 'Không thể lưu cấu hình bảo mật' };
  }
  return { success: true };
}

export async function verify2FAToken(token: string): Promise<boolean> {
  const data = await getAuthData();
  if (!data.twoFactor?.enabled || !data.twoFactor?.secret) {
    return true; // If 2FA not enabled, passes
  }

  const result = verifySync({ token: token.trim(), secret: data.twoFactor.secret });
  return Boolean(result && result.valid);
}
