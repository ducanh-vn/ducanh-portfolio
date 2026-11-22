'use client';

import { useEffect, useRef, useState } from 'react';
import { MODAL_EXIT_MS } from '@/constants/portfolio';

/**
 * Keeps the last item mounted while a modal fades out, flips `isOpen` one frame after
 * mount so the CSS transition runs, and focuses the close button once open.
 */
export function useModalPresence<T>(item: T | null) {
  const [shown, setShown] = useState<T | null>(item);
  const [isOpen, setIsOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (item) {
      setShown(item);
      // next frame so the closed state paints first and the transition runs
      const id = requestAnimationFrame(() => setIsOpen(true));
      return () => cancelAnimationFrame(id);
    }
    setIsOpen(false);
    const t = setTimeout(() => setShown(null), MODAL_EXIT_MS);
    return () => clearTimeout(t);
  }, [item]);

  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  return { shown, isOpen, closeBtnRef };
}
