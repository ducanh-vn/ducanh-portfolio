'use client';

import { useCallback, useEffect, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { DESKTOP_NAV_QUERY } from '@/constants/admin';

/**
 * Open state for the mobile navigation drawer. Closes on Escape, locks page scroll while
 * open, and closes itself when the viewport grows to the desktop layout.
 */
export function useMobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useOverlay(isOpen, close);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_QUERY);
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setIsOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return { isOpen, open, close };
}

export type MobileNavState = ReturnType<typeof useMobileNav>;
