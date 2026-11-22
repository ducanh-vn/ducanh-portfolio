import fs from 'fs';
import path from 'path';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import type { AuthData, TwoFactorSetup } from '@/types/auth';
import { DEFAULT_ADMIN_PASSWORD, QR_CODE_OPTIONS, TOTP_ISSUER, TOTP_LABEL } from '@/constants/auth';

const authFilePath = path.join(process.cwd(), 'src', 'data', 'auth.json');
const DEFAULT_PASS = DEFAULT_ADMIN_PASSWORD;

export function getAuthData(): AuthData {
  try {
    if (fs.existsSync(authFilePath)) {
      const fileData = fs.readFileSync(authFilePath, 'utf8');
      const json = JSON.parse(fileData);
      return {
        password: json.password || DEFAULT_PASS,
        updatedAt: json.updatedAt || new Date().toISOString(),
        twoFactor: {
          enabled: Boolean(json.twoFactor?.enabled),
          secret: json.twoFactor?.secret || '',
          tempSecret: json.twoFactor?.tempSecret || '',
        },
      };
    }
  } catch (error) {
    console.error('Error reading auth file:', error);
  }

  return {
    password: DEFAULT_PASS,
    updatedAt: new Date().toISOString(),
    twoFactor: {
      enabled: false,
      secret: '',
      tempSecret: '',
    },
  };
}

export function saveAuthData(data: AuthData): boolean {
  try {
    fs.writeFileSync(authFilePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving auth file:', error);
    return false;
  }
}

export function getAdminPassword(): string {
  const data = getAuthData();
  return data.password;
}

export function setAdminPassword(newPassword: string): boolean {
  const data = getAuthData();
  data.password = newPassword;
  data.updatedAt = new Date().toISOString();
  return saveAuthData(data);
}

export function get2FAStatus(): { enabled: boolean } {
  const data = getAuthData();
  return { enabled: Boolean(data.twoFactor?.enabled && data.twoFactor?.secret) };
}

export async function generate2FASetup(): Promise<TwoFactorSetup> {
  const data = getAuthData();
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
  saveAuthData(data);

  return { secret, qrCodeUrl, uri };
}

export function verifyAndEnable2FA(token: string): boolean {
  const data = getAuthData();
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

export function disable2FA(currentPassword: string): { success: boolean; error?: string } {
  const data = getAuthData();
  if (currentPassword !== data.password) {
    return { success: false, error: 'Mật khẩu hiện tại không chính xác' };
  }

  data.twoFactor = {
    enabled: false,
    secret: '',
    tempSecret: '',
  };
  data.updatedAt = new Date().toISOString();
  saveAuthData(data);
  return { success: true };
}

export function verify2FAToken(token: string): boolean {
  const data = getAuthData();
  if (!data.twoFactor?.enabled || !data.twoFactor?.secret) {
    return true; // If 2FA not enabled, passes
  }

  const result = verifySync({ token: token.trim(), secret: data.twoFactor.secret });
  return Boolean(result && result.valid);
}
