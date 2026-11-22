'use client';

import React from 'react';
import { useCustomCursor } from '@/hooks/useCustomCursor';

export default function CustomCursor() {
  const { cursorRef, hoverType, isMouseDown, isVisible } = useCustomCursor();

  return (
    <div
      ref={cursorRef}
      id="customCursorWrapper"
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[9999999] hidden md:flex items-center justify-center transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ willChange: 'transform' }}
    >
      {/* Outer Follower Ring - Always concentric with center dot */}
      <div
        className={`relative flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          isMouseDown ? 'scale-85' : 'scale-100'
        } ${
          hoverType === 'view'
            ? 'w-20 h-20 bg-[#141414]/90 border-2 border-[#f1f505] shadow-[0_0_20px_rgba(241,245,5,0.3)] backdrop-blur-sm'
            : hoverType === 'pointer'
            ? 'w-14 h-14 border border-[#f1f505] bg-[#f1f505]/10 shadow-[0_0_15px_rgba(241,245,5,0.2)]'
            : hoverType === 'text'
            ? 'w-6 h-6 border border-[#f1f505] bg-[#f1f505]/20'
            : 'w-9 h-9 border border-white/50 bg-transparent'
        }`}
      >
        {/* Center Dot - Pinned perfectly in center */}
        <div
          className={`rounded-full transition-all duration-200 ${
            hoverType === 'view'
              ? 'w-0 h-0 opacity-0'
              : hoverType === 'pointer' || hoverType === 'text'
              ? 'w-1.5 h-1.5 bg-[#f1f505]'
              : 'w-1.5 h-1.5 bg-white'
          }`}
        />

        {/* VIEW badge text inside ring on project cards */}
        {hoverType === 'view' && (
          <span className="font-sans text-[11px] font-bold tracking-[2px] text-[#f1f505]">
            VIEW
          </span>
        )}
      </div>
    </div>
  );
}
