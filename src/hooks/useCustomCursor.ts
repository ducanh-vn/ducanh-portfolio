'use client';

import { useEffect, useRef, useState } from 'react';
import type { CursorHoverType } from '@/types/ui';
import {
  CURSOR_FOLLOW_FACTOR,
  CURSOR_POINTER_SELECTOR,
  CURSOR_START_POS,
  CURSOR_TEXT_SELECTOR,
  CURSOR_VIEW_SELECTOR,
} from '@/constants/cursor';

/** Drives the custom cursor: smooth follow loop, press state, visibility and hover type. */
export function useCustomCursor() {
  const [hoverType, setHoverType] = useState<CursorHoverType>('none');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Only take over the native cursor on real mouse devices, after mount
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;
    document.documentElement.classList.add('has-custom-cursor');

    let mouseX = CURSOR_START_POS;
    let mouseY = CURSOR_START_POS;
    let currentX = CURSOR_START_POS;
    let currentY = CURSOR_START_POS;

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
    const render = () => {
      currentX += (mouseX - currentX) * CURSOR_FOLLOW_FACTOR;
      currentY += (mouseY - currentY) * CURSOR_FOLLOW_FACTOR;

      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(CURSOR_VIEW_SELECTOR)) {
        setHoverType('view');
        return;
      }

      if (target.closest(CURSOR_TEXT_SELECTOR)) {
        setHoverType('text');
        return;
      }

      if (target.closest(CURSOR_POINTER_SELECTOR)) {
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
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return { cursorRef, hoverType, isMouseDown, isVisible };
}
