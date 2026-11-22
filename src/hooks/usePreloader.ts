'use client';

import { useEffect, useRef, useState } from 'react';
import {
  PRELOADER_PATH1_FALLBACK,
  PRELOADER_PATH2_FALLBACK,
  PRELOADER_STORAGE_KEY,
  PRELOADER_TIMING,
  PRELOADER_WIPE_MS,
} from '@/constants/preloader';

/** Runs the intro animation: draws both SVG paths, counts 0-100%, then wipes up and unmounts. */
export function usePreloader(onComplete?: () => void) {
  const [percent, setPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWiped, setIsWiped] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path1 = path1Ref.current;
    const path2 = path2Ref.current;

    const len1 = path1?.getTotalLength ? path1.getTotalLength() : PRELOADER_PATH1_FALLBACK;
    const len2 = path2?.getTotalLength ? path2.getTotalLength() : PRELOADER_PATH2_FALLBACK;

    if (path1) {
      path1.style.strokeDasharray = `${len1}`;
      path1.style.strokeDashoffset = `${len1}`;
    }
    if (path2) {
      path2.style.strokeDasharray = `${len2}`;
      path2.style.strokeDashoffset = `${len2}`;
    }

    // Play the full intro once per browser session; later visits get a short version
    let seen = false;
    try {
      seen = sessionStorage.getItem(PRELOADER_STORAGE_KEY) === '1';
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1');
    } catch {
      /* storage blocked: fall back to the full intro */
    }

    const timing = seen ? PRELOADER_TIMING.repeat : PRELOADER_TIMING.first;
    const duration = timing.duration;
    const holdMs = timing.hold;
    const startTime = performance.now();

    let animationFrameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentPercent = Math.round(eased * 100);

      setPercent(currentPercent);

      if (path1) path1.style.strokeDashoffset = `${len1 * (1 - eased)}`;
      if (path2) path2.style.strokeDashoffset = `${len2 * (1 - eased)}`;

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setPercent(100);
        setIsCompleted(true);

        setTimeout(() => {
          setIsWiped(true);
          setTimeout(() => {
            setIsDone(true);
            if (onComplete) onComplete();
          }, PRELOADER_WIPE_MS);
        }, holdMs);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return { percent, isCompleted, isWiped, isDone, path1Ref, path2Ref };
}
