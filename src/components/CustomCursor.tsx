'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<'none' | 'pointer' | 'text' | 'view'>('none');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let frameId: number;
    // Responsive smooth follow loop (0.32 factor = instant & buttery smooth)
    const render = () => {
      currentX += (mouseX - currentX) * 0.32;
      currentY += (mouseY - currentY) * 0.32;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="view"]')) {
        setHoverType('view');
        return;
      }

      if (target.closest('input, textarea')) {
        setHoverType('text');
        return;
      }

      if (target.closest('button, a, select, [role="button"], [data-cursor="pointer"]')) {
        setHoverType('pointer');
        return;
      }

      setHoverType('none');
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      id="customCursorWrapper"
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
