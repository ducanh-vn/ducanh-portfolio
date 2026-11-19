'use client';

import React from 'react';
import { CoverLetterData } from '@/lib/coverLetter';
import { CVFontFamily, TemplateId } from '@/components/CVBuilderClient';
import { Mail, Phone, MapPin, Globe, Calendar, Building, User, Briefcase } from 'lucide-react';

export interface CoverLetterCanvasProps {
  coverLetter: CoverLetterData;
  template: TemplateId;
  accentColor: 'blue' | 'yellow' | 'emerald' | 'slate' | 'rose';
  fontFamily: CVFontFamily;
  lang: 'vi' | 'en';
  onUpdateField?: (field: keyof CoverLetterData, value: string) => void;
  isEditable?: boolean;
  scale?: number;
}

const ACCENT_STYLES: Record<string, { primary: string; bgSoft: string; border: string; text: string; gradient: string }> = {
  blue: {
    primary: '#2563EB',
    bgSoft: 'rgba(37, 99, 235, 0.08)',
    border: 'rgba(37, 99, 235, 0.3)',
    text: '#1D4ED8',
    gradient: 'from-blue-600 to-indigo-600',
  },
  emerald: {
    primary: '#059669',
    bgSoft: 'rgba(5, 150, 105, 0.08)',
    border: 'rgba(5, 150, 105, 0.3)',
    text: '#047857',
    gradient: 'from-emerald-600 to-teal-600',
  },
  slate: {
    primary: '#475569',
    bgSoft: 'rgba(71, 85, 105, 0.08)',
    border: 'rgba(71, 85, 105, 0.3)',
    text: '#334155',
    gradient: 'from-slate-700 to-zinc-700',
  },
  yellow: {
    primary: '#D97706',
    bgSoft: 'rgba(217, 119, 6, 0.08)',
    border: 'rgba(217, 119, 6, 0.3)',
    text: '#B45309',
    gradient: 'from-amber-500 to-orange-600',
  },
  rose: {
    primary: '#E11D48',
    bgSoft: 'rgba(225, 29, 72, 0.08)',
    border: 'rgba(225, 29, 72, 0.3)',
    text: '#BE123C',
    gradient: 'from-rose-600 to-pink-600',
  },
};

const FONT_CLASSES: Record<string, string> = {
  inter: 'font-sans',
  sans: 'font-sans',
  vietnam: 'font-vietnam',
  jakarta: 'font-jakarta',
  roboto: 'font-roboto',
  merriweather: 'font-serif',
  serif: 'font-serif',
  mono: 'font-mono',
};

export default function CoverLetterCanvas({
  coverLetter,
  template,
  accentColor,
  fontFamily,
  lang,
  onUpdateField,
  isEditable = true,
  scale = 1,
}: CoverLetterCanvasProps) {
  const accent = ACCENT_STYLES[accentColor] || ACCENT_STYLES.blue;
  const fontClass = FONT_CLASSES[fontFamily] || 'font-sans';

  const handleBlur = (field: keyof CoverLetterData, e: React.FocusEvent<HTMLElement>) => {
    if (onUpdateField) {
      onUpdateField(field, e.currentTarget.innerText.trim());
    }
  };

  return (
    <div
      id="cover-letter-paper"
      className={`bg-white text-neutral-900 shadow-2xl relative transition-all duration-300 print:shadow-none print:m-0 print:border-none ${fontClass}`}
      style={{
        width: '794px',
        minHeight: '1123px',
        boxSizing: 'border-box',
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
      }}
    >
      {/* Top Template Matching Accent Header Banner */}
      <div
        className="w-full text-white px-10 py-8 relative overflow-hidden"
        style={{
          backgroundColor: accentColor === 'slate' ? '#1E293B' : '#0F172A',
          borderBottom: `4px solid ${accent.primary}`,
        }}
      >
        {/* Subtle Decorative Geometric Glow */}
        <div
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: accent.primary }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('senderName', e)}
              className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase outline-none focus:bg-white/10 rounded px-1 -mx-1"
            >
              {coverLetter.senderName || 'Nguyễn Đức Anh'}
            </h1>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('senderRole', e)}
              className="text-sm font-semibold tracking-wide outline-none focus:bg-white/10 rounded px-1 -mx-1"
              style={{ color: accent.primary }}
            >
              {coverLetter.senderRole || 'Frontend & Fullstack Developer'}
            </p>
          </div>

          {/* Sender Contact Badges */}
          <div className="text-xs text-neutral-300 space-y-1 text-left sm:text-right shrink-0">
            <div className="flex items-center sm:justify-end space-x-1.5">
              <span>{coverLetter.senderEmail}</span>
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center sm:justify-end space-x-1.5">
              <span>{coverLetter.senderPhone}</span>
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            {coverLetter.senderLocation && (
              <div className="flex items-center sm:justify-end space-x-1.5">
                <span>{coverLetter.senderLocation}</span>
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            )}
            {coverLetter.senderWebsite && (
              <div className="flex items-center sm:justify-end space-x-1.5">
                <span className="font-mono">{coverLetter.senderWebsite.replace(/^https?:\/\//, '')}</span>
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Letter Body */}
      <div className="p-10 sm:p-12 space-y-6 text-[13px] leading-relaxed text-neutral-800">
        {/* Date & Recipient Details Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-neutral-200">
          {/* Recipient Details */}
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              {lang === 'en' ? 'Letter To:' : 'Kính gửi đến:'}
            </div>
            <h3
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('recipientName', e)}
              className="font-bold text-sm text-neutral-900 outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
            >
              {coverLetter.recipientName}
            </h3>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('recipientRole', e)}
              className="text-xs text-neutral-600 outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
            >
              {coverLetter.recipientRole}
            </div>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('companyName', e)}
              className="text-xs font-semibold text-neutral-800 outline-none focus:bg-neutral-100 rounded px-1 -mx-1 flex items-center space-x-1"
            >
              <Building className="w-3 h-3 text-neutral-400 inline" />
              <span>{coverLetter.companyName}</span>
            </div>
            {coverLetter.companyAddress && (
              <div
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(e) => handleBlur('companyAddress', e)}
                className="text-xs text-neutral-500 outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
              >
                {coverLetter.companyAddress}
              </div>
            )}
          </div>

          {/* Letter Date */}
          <div className="text-left sm:text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
              {lang === 'en' ? 'Date:' : 'Ngày lập thư:'}
            </div>
            <div
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('date', e)}
              className="text-xs font-semibold text-neutral-800 outline-none focus:bg-neutral-100 rounded px-1 -mx-1 flex items-center sm:justify-end space-x-1"
            >
              <Calendar className="w-3 h-3 text-neutral-400 inline" />
              <span>{coverLetter.date}</span>
            </div>
          </div>
        </div>

        {/* Subject / Position Line */}
        <div
          className="px-4 py-2.5 rounded-lg flex items-center space-x-2 border"
          style={{
            backgroundColor: accent.bgSoft,
            borderColor: accent.border,
          }}
        >
          <span className="font-bold text-xs uppercase tracking-wide" style={{ color: accent.text }}>
            {lang === 'en' ? 'Subject:' : 'V/v:'}
          </span>
          <span
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('jobTitle', e)}
            className="font-bold text-xs text-neutral-900 outline-none focus:bg-white rounded px-1"
          >
            {lang === 'en' ? `Application for ${coverLetter.jobTitle}` : `Ứng tuyển ${coverLetter.jobTitle}`}
          </span>
        </div>

        {/* Salutation */}
        <div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('salutation', e)}
            className="font-bold text-sm text-neutral-900 outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
          >
            {coverLetter.salutation}
          </p>
        </div>

        {/* Paragraph 1: Opening Hook */}
        <div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('opening', e)}
            className="text-justify leading-relaxed outline-none focus:bg-neutral-50 rounded p-1 -m-1"
          >
            {coverLetter.opening}
          </p>
        </div>

        {/* Paragraph 2: Core Experience & Achievements */}
        <div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('body1', e)}
            className="text-justify leading-relaxed outline-none focus:bg-neutral-50 rounded p-1 -m-1"
          >
            {coverLetter.body1}
          </p>
        </div>

        {/* Paragraph 3: Cultural Fit & Value Proposition */}
        <div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('body2', e)}
            className="text-justify leading-relaxed outline-none focus:bg-neutral-50 rounded p-1 -m-1"
          >
            {coverLetter.body2}
          </p>
        </div>

        {/* Paragraph 4: Closing & Call to Action */}
        <div>
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('closing', e)}
            className="text-justify leading-relaxed outline-none focus:bg-neutral-50 rounded p-1 -m-1"
          >
            {coverLetter.closing}
          </p>
        </div>

        {/* Sign-off & Signature Block */}
        <div className="pt-6 space-y-3">
          <p
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(e) => handleBlur('signOff', e)}
            className="text-neutral-800 font-medium outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
          >
            {coverLetter.signOff}
          </p>

          <div className="space-y-0.5">
            <h4
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('senderName', e)}
              className="text-base font-bold text-neutral-900 uppercase tracking-tight outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
            >
              {coverLetter.senderName}
            </h4>
            <p
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(e) => handleBlur('senderRole', e)}
              className="text-xs font-semibold text-neutral-600 outline-none focus:bg-neutral-100 rounded px-1 -mx-1"
            >
              {coverLetter.senderRole}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Accent Strip */}
      <div
        className="w-full h-2 absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: accent.primary }}
      />
    </div>
  );
}
