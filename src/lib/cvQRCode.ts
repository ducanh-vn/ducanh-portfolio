/**
 * Personal Dynamic QR Code Generator for CV Studio (src/lib/cvQRCode.ts)
 * Generates sharp, mobile-scannable QR codes for Portfolio, LinkedIn, GitHub, vCard, or custom links.
 */

import QRCode from 'qrcode';

export type QRTargetType = 'website' | 'linkedin' | 'github' | 'custom' | 'vcard';
export type QRPosition = 'header' | 'footer';
export type QRColorMode = 'dark' | 'accent';

export interface CVQRConfig {
  enabled: boolean;
  targetType: QRTargetType;
  customUrl: string;
  position: QRPosition;
  colorMode: QRColorMode;
  size: number; // 56, 68, 80
  labelVi: string;
  labelEn: string;
  showCaption: boolean;
}

export const DEFAULT_QR_CONFIG: CVQRConfig = {
  enabled: true,
  targetType: 'website',
  customUrl: 'https://ducanh.dev',
  position: 'header',
  colorMode: 'dark',
  size: 68,
  labelVi: 'Quét xem Portfolio',
  labelEn: 'Scan for Portfolio',
  showCaption: true,
};

export function ensureQRConfig(config?: Partial<CVQRConfig>): CVQRConfig {
  if (!config) return { ...DEFAULT_QR_CONFIG };
  return {
    ...DEFAULT_QR_CONFIG,
    ...config,
  };
}

/**
 * Resolves the actual text/URL encoded into the QR code based on configuration and candidate data
 */
export function getQRTargetText(
  config: CVQRConfig,
  cv: {
    name?: string;
    role?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  }
): string {
  switch (config.targetType) {
    case 'website': {
      const raw = cv.website?.trim() || config.customUrl?.trim() || 'https://ducanh.dev';
      return raw.startsWith('http') ? raw : `https://${raw}`;
    }

    case 'linkedin': {
      if (cv.linkedin?.trim()) {
        const li = cv.linkedin.trim();
        return li.startsWith('http') ? li : `https://${li}`;
      }
      return 'https://linkedin.com/in/ducanh-vn';
    }

    case 'github': {
      if (cv.github?.trim()) {
        const gh = cv.github.trim();
        return gh.startsWith('http') ? gh : `https://${gh}`;
      }
      return 'https://github.com/ducanh-vn';
    }

    case 'custom': {
      const raw = config.customUrl?.trim() || cv.website?.trim() || 'https://ducanh.dev';
      return raw.startsWith('http') || raw.startsWith('mailto:') || raw.startsWith('tel:')
        ? raw
        : `https://${raw}`;
    }

    case 'vcard':
      // Generates standard vCard 3.0 string for 1-tap phone contact addition
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${cv.name || 'Nguyen Duc Anh'}`,
        `TITLE:${cv.role || 'Software Engineer'}`,
        cv.email ? `EMAIL:${cv.email}` : '',
        cv.phone ? `TEL:${cv.phone}` : '',
        cv.location ? `ADR:;;${cv.location};;;;` : '',
        cv.website ? `URL:${cv.website}` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n');

    default:
      return config.customUrl?.trim() || 'https://ducanh.dev';
  }
}

/**
 * Generates high-res DataURL for the QR code
 */
export async function generateQRDataUrl(
  text: string,
  options?: {
    color?: string;
    size?: number;
    margin?: number;
  }
): Promise<string> {
  if (!text || !text.trim()) return '';

  const darkColor = options?.color || '#0F172A';
  const width = options?.size || 180;
  const margin = options?.margin ?? 1;

  try {
    return await QRCode.toDataURL(text.trim(), {
      width,
      margin,
      color: {
        dark: darkColor,
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    });
  } catch (err) {
    console.warn('QR Code generation failed:', err);
    return '';
  }
}

/**
 * Default label recommendation based on target type
 */
export function getDefaultQRLabel(targetType: QRTargetType, lang: 'vi' | 'en'): string {
  switch (targetType) {
    case 'website':
      return lang === 'en' ? 'Scan for Portfolio' : 'Quét xem Portfolio';
    case 'linkedin':
      return lang === 'en' ? 'Scan for LinkedIn' : 'Quét xem LinkedIn';
    case 'github':
      return lang === 'en' ? 'Scan for GitHub' : 'Quét xem GitHub';
    case 'vcard':
      return lang === 'en' ? 'Scan to Save Contact' : 'Quét lưu danh thiếp';
    case 'custom':
    default:
      return lang === 'en' ? 'Scan QR Code' : 'Quét mã QR';
  }
}
