export const SESSION_COOKIE = 'admin_session';
export const SESSION_VALUE = 'authenticated';
export const PENDING_2FA_COOKIE = 'admin_2fa_pending';
export const PENDING_2FA_VALUE = 'pending';

export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
export const PENDING_2FA_MAX_AGE = 60 * 5; // 5 minutes

export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ducanh2026';

export const TOTP_ISSUER = 'Nguyen Duc Anh Portfolio';
export const TOTP_LABEL = 'admin@ducanh.dev';

export const QR_CODE_OPTIONS = {
  margin: 2,
  width: 256,
  color: {
    dark: '#000000',
    light: '#ffffff',
  },
};

export const MIN_PASSWORD_LENGTH = 6;
export const TOTP_CODE_LENGTH = 6;
