'use client';

import React from 'react';
import {
  Type,
  SlidersHorizontal,
  RotateCcw,
  Maximize2,
  Minimize2,
  Check,
  Sparkles,
} from 'lucide-react';
import {
  CVTypographyConfig,
  DEFAULT_TYPOGRAPHY_CONFIG,
  COMPACT_TYPOGRAPHY_PRESET,
  SPACIOUS_TYPOGRAPHY_PRESET,
  getActivePresetKey,
} from '@/lib/cvTypography';

interface CVTypographySlidersProps {
  config: CVTypographyConfig;
  onChange: (newConfig: CVTypographyConfig) => void;
  lang: 'vi' | 'en';
}

export function CVTypographySliders({
  config,
  onChange,
  lang,
}: CVTypographySlidersProps) {
  const activePreset = getActivePresetKey(config);

  const handleUpdate = (field: keyof CVTypographyConfig, value: number) => {
    onChange({
      ...config,
      [field]: value,
    });
  };

  const handleApplyPreset = (preset: CVTypographyConfig) => {
    onChange({ ...preset });
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_TYPOGRAPHY_CONFIG });
  };

  return (
    <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white text-xs">
            {lang === 'en' ? 'Fine-grain Typography & Margins' : 'Tùy Biến Lề & Cỡ Chữ Chi Tiết'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] text-neutral-400 hover:text-cyan-400 flex items-center space-x-1 transition-colors cursor-pointer"
          title={lang === 'en' ? 'Reset to default typography' : 'Khôi phục về kích thước mặc định'}
        >
          <RotateCcw className="w-3 h-3" />
          <span>{lang === 'en' ? 'Reset' : 'Mặc định'}</span>
        </button>
      </div>

      <p className="text-[11px] text-neutral-400 leading-relaxed">
        {lang === 'en'
          ? 'Fine-tune font sizing, line height, and page margins to achieve pixel-perfect 1-page fit or spacious 2-page flow.'
          : 'Kéo thanh trượt để tinh chỉnh cỡ chữ, độ giãn dòng và lề trang A4 chính xác theo từng pixel giúp vừa vặn hoàn hảo 1 hoặc 2 trang.'}
      </p>

      {/* Quick Density Presets */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
          {lang === 'en' ? 'QUICK DENSITY PRESETS' : 'MẪU CẤU HÌNH NHANH'}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleApplyPreset(DEFAULT_TYPOGRAPHY_CONFIG)}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activePreset === 'balanced'
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-xs'
                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {activePreset === 'balanced' && <Check className="w-2.5 h-2.5 text-cyan-400" />}
            <span>{lang === 'en' ? 'Balanced' : 'Cân bằng'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset(COMPACT_TYPOGRAPHY_PRESET)}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activePreset === 'compact'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-xs'
                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {activePreset === 'compact' && <Check className="w-2.5 h-2.5 text-amber-400" />}
            <span>{lang === 'en' ? '1-Page Fit' : 'Gọn 1 trang'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleApplyPreset(SPACIOUS_TYPOGRAPHY_PRESET)}
            className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold border transition-all flex items-center justify-center space-x-1 cursor-pointer ${
              activePreset === 'spacious'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-xs'
                : 'bg-white/5 border-white/5 text-neutral-300 hover:bg-white/10'
            }`}
          >
            {activePreset === 'spacious' && <Check className="w-2.5 h-2.5 text-purple-400" />}
            <span>{lang === 'en' ? 'Spacious' : 'Rộng rãi'}</span>
          </button>
        </div>
      </div>

      {/* Sliders Group 1: Typography & Line Height */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center space-x-1.5">
          <Type className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === 'en' ? 'FONT SIZE & LINE HEIGHT' : 'CỠ CHỮ & ĐỘ GIÃN DÒNG'}</span>
        </span>

        {/* 1. Body Font Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Body Text Size' : 'Cỡ chữ nội dung'}
            </label>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.bodyFontSize}px
            </span>
          </div>
          <input
            type="range"
            min={11}
            max={16}
            step={0.5}
            value={config.bodyFontSize}
            onChange={(e) => handleUpdate('bodyFontSize', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>11px (Gọn)</span>
            <span>13.5px (Chuẩn)</span>
            <span>16px (Lớn)</span>
          </div>
        </div>

        {/* 2. Section Heading Size */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Section Heading Size' : 'Cỡ tiêu đề mục (H2)'}
            </label>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.headingFontSize}px
            </span>
          </div>
          <input
            type="range"
            min={13}
            max={22}
            step={0.5}
            value={config.headingFontSize}
            onChange={(e) => handleUpdate('headingFontSize', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>13px</span>
            <span>16.5px (Chuẩn)</span>
            <span>22px</span>
          </div>
        </div>

        {/* 3. Line Height */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Line Height (Leading)' : 'Khoảng cách dòng'}
            </label>
            <span className="font-mono text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.lineHeight}x
            </span>
          </div>
          <input
            type="range"
            min={1.2}
            max={1.85}
            step={0.05}
            value={config.lineHeight}
            onChange={(e) => handleUpdate('lineHeight', parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>1.2x (Khít)</span>
            <span>1.45x (Chuẩn)</span>
            <span>1.85x (Thoáng)</span>
          </div>
        </div>
      </div>

      {/* Sliders Group 2: Margins & Section Spacing */}
      <div className="space-y-3 pt-2 border-t border-white/10">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 flex items-center space-x-1.5">
          <Maximize2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'en' ? 'PAGE MARGINS & SPACING' : 'LỀ TRANG & KHOẢNG CÁCH MỤC'}</span>
        </span>

        {/* 4. Page Top/Bottom Padding */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Top & Bottom Margin' : 'Lề trên & dưới'}
            </label>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.pagePaddingTopBottom}px
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={44}
            step={2}
            value={config.pagePaddingTopBottom}
            onChange={(e) => handleUpdate('pagePaddingTopBottom', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>12px</span>
            <span>24px (Chuẩn)</span>
            <span>44px</span>
          </div>
        </div>

        {/* 5. Page Left/Right Padding */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Left & Right Margin' : 'Lề trái & phải'}
            </label>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.pagePaddingLeftRight}px
            </span>
          </div>
          <input
            type="range"
            min={16}
            max={56}
            step={2}
            value={config.pagePaddingLeftRight}
            onChange={(e) => handleUpdate('pagePaddingLeftRight', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>16px</span>
            <span>28px (Chuẩn)</span>
            <span>56px</span>
          </div>
        </div>

        {/* 6. Section Spacing */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Section Gap' : 'Khoảng cách giữa các mục'}
            </label>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.sectionSpacing}px
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={32}
            step={2}
            value={config.sectionSpacing}
            onChange={(e) => handleUpdate('sectionSpacing', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>8px</span>
            <span>18px (Chuẩn)</span>
            <span>32px</span>
          </div>
        </div>

        {/* 7. Item Spacing */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label className="text-neutral-300">
              {lang === 'en' ? 'Item Gap (Jobs / Projects)' : 'Khoảng cách các đầu việc/dự án'}
            </label>
            <span className="font-mono text-emerald-300 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded text-[11px]">
              {config.itemSpacing}px
            </span>
          </div>
          <input
            type="range"
            min={4}
            max={20}
            step={1}
            value={config.itemSpacing}
            onChange={(e) => handleUpdate('itemSpacing', parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
          />
          <div className="flex justify-between text-[9px] text-neutral-500 font-mono">
            <span>4px</span>
            <span>10px (Chuẩn)</span>
            <span>20px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
