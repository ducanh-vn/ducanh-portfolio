export interface AuthData {
  password: string;
  updatedAt: string;
  twoFactor?: {
    enabled: boolean;
    secret?: string;
    tempSecret?: string;
  };
}

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  uri: string;
}

export type LoginStep = 'password' | '2fa';
