'use client';

import React from 'react';
import { usePreloader } from '@/hooks/usePreloader';
import { PRELOADER_PATH1, PRELOADER_PATH2, PRELOADER_VIEWBOX } from '@/constants/preloader';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const { percent, isCompleted, isWiped, isDone, path1Ref, path2Ref } = usePreloader(onComplete);

  if (isDone) return null;

  return (
    <div
      id="preloader"
      aria-hidden="true"
      className={`${isCompleted ? 'completed' : ''} ${isWiped ? 'wipe-up' : ''}`}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          version="1.1"
          id="preloaderSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox={PRELOADER_VIEWBOX}
        >
          <g>
            <path
              ref={path1Ref}
              className="st0"
              id="path1"
              d={PRELOADER_PATH1}
            />
            <path
              ref={path2Ref}
              className="st0"
              id="path2"
              d={PRELOADER_PATH2}
            />
          </g>
        </svg>
        <div id="percent">{percent}%</div>
      </div>
    </div>
  );
}
