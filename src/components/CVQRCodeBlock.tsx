'use client';

import React from 'react';
import { CVQRConfig } from '@/lib/cvQRCode';
import { QrCode, ExternalLink } from 'lucide-react';

export interface CVQRCodeBlockProps {
  qrDataUrl: string;
  config: CVQRConfig;
  lang: 'vi' | 'en';
  isDarkHeader?: boolean;
  accentColorHex?: string;
  className?: string;
}

export default function CVQRCodeBlock({
  qrDataUrl,
  config,
  lang,
  isDarkHeader = false,
  accentColorHex,
  className = '',
}: CVQRCodeBlockProps) {
  if (!config.enabled || !qrDataUrl) return null;

  const caption = lang === 'en' ? config.labelEn : config.labelVi;
  const qrSizePx = config.size || 68;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${
        isDarkHeader
          ? 'bg-white text-neutral-900 border-white/30 shadow-md'
          : 'bg-white text-neutral-800 border-neutral-200/90 shadow-xs'
      } ${className}`}
      style={{
        width: `${qrSizePx + 14}px`,
      }}
    >
      {/* Sharp QR Code Image */}
      <div
        className="overflow-hidden rounded-lg bg-white flex items-center justify-center"
        style={{
          width: `${qrSizePx}px`,
          height: `${qrSizePx}px`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={caption || 'CV Personal QR Code'}
          className="w-full h-full object-contain select-none"
          loading="eager"
        />
      </div>

      {/* Optional Mini Caption */}
      {config.showCaption && caption && (
        <span
          className="text-[8px] font-bold text-center leading-tight tracking-tight mt-1 px-0.5 line-clamp-1 select-none font-sans"
          style={{
            color: isDarkHeader ? '#1e293b' : (config.colorMode === 'accent' && accentColorHex ? accentColorHex : '#475569'),
          }}
          title={caption}
        >
          {caption}
        </span>
      )}
    </div>
  );
}

export interface CVQRCodeFooterProps {
  qrDataUrl: string;
  config: CVQRConfig;
  lang: 'vi' | 'en';
  accentColorHex?: string;
  candidateName?: string;
  websiteUrl?: string;
}

export function CVQRCodeFooter({
  qrDataUrl,
  config,
  lang,
  accentColorHex,
  candidateName = 'Nguyen Duc Anh',
  websiteUrl = 'https://ducanh.dev',
}: CVQRCodeFooterProps) {
  if (!config.enabled || !qrDataUrl || config.position !== 'footer') return null;

  const caption = lang === 'en' ? config.labelEn : config.labelVi;

  return (
    <div className="w-full mt-auto pt-3 pb-1 border-t border-neutral-200/80 flex items-center justify-between text-neutral-500 font-sans text-[10px] leading-tight select-none">
      <div className="space-y-0.5">
        <div className="flex items-center space-x-1.5 text-neutral-700 font-medium">
          <QrCode className="w-3.5 h-3.5 text-neutral-400" />
          <span>
            {lang === 'en' ? 'Digital Verified Profile:' : 'Hồ sơ kỹ thuật số xác thực:'}{' '}
            <strong className="text-neutral-900">{websiteUrl}</strong>
          </span>
        </div>
        <p className="text-[9px] text-neutral-400">
          {lang === 'en'
            ? 'Scan the QR code with any smartphone to inspect live interactive demos & verified source code.'
            : 'Quét mã QR bằng điện thoại để xem trực tiếp các dự án demo và mã nguồn thực tế.'}
        </p>
      </div>

      <div className="flex items-center space-x-2 pl-3 border-l border-neutral-200 shrink-0">
        <div className="text-right">
          <div className="text-[9px] font-bold text-neutral-800 tracking-tight">{caption}</div>
          <div className="text-[8px] font-mono text-neutral-400">{candidateName}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={caption}
          className="w-11 h-11 object-contain rounded-md border border-neutral-200 p-0.5 bg-white"
        />
      </div>
    </div>
  );
}
