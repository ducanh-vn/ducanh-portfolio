'use client';

import { useEffect } from 'react';

/**
 * Shared behaviour for modal-like overlays: close on Escape and lock page scroll while open.
 * Uses a counter so a drawer and a modal can be open in sequence without fighting over the lock.
 */
let lockCount = 0;

export function useOverlay(isOpen: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    lockCount += 1;
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    return () => {
      window.removeEventListener('keydown', onKey);
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        html.style.overflow = '';
        html.style.paddingRight = '';
      }
    };
  }, [isOpen, onClose]);
}
