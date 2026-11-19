'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isWiped, setIsWiped] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);

  useEffect(() => {
    const path1 = path1Ref.current;
    const path2 = path2Ref.current;

    const len1 = path1?.getTotalLength ? path1.getTotalLength() : 125;
    const len2 = path2?.getTotalLength ? path2.getTotalLength() : 380;

    if (path1) {
      path1.style.strokeDasharray = `${len1}`;
      path1.style.strokeDashoffset = `${len1}`;
    }
    if (path2) {
      path2.style.strokeDasharray = `${len2}`;
      path2.style.strokeDashoffset = `${len2}`;
    }

    const duration = 1600;
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
          }, 900);
        }, 500);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      id="preloader"
      className={`${isCompleted ? 'completed' : ''} ${isWiped ? 'wipe-up' : ''}`}
    >
      <div className="flex flex-col items-center justify-center">
        <svg
          version="1.1"
          id="preloaderSvg"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 95 114.3"
        >
          <g>
            <path
              ref={path1Ref}
              className="st0"
              id="path1"
              d="M53.4,107.4c0,2.5-2.4,4.6-5.4,4.6l0,0c-3,0-5.4-2-5.4-4.6V49.9c0-2.5,2.4-4.6,5.4-4.6l0,0c3,0,5.4,2,5.4,4.6 V107.4z"
            />
            <path
              ref={path2Ref}
              className="st0"
              id="path2"
              d="M48,3.9C24.1,3.9,4.7,23.2,4.7,47.1c0,17.8,10.7,33,26.1,39.7c4.2,0,6.7-7.3,4.2-9.8 c-11.6-5-19.6-16.5-19.6-29.9c0-18,14.6-32.6,32.6-32.6s32.6,14.6,32.6,32.6c0,13.4-8.1,24.9-19.6,29.9c-2,2,2.1,9.8,4.2,9.8 c15.3-6.6,26.1-21.9,26.1-39.7C91.2,23.2,71.8,3.9,48,3.9z"
            />
          </g>
        </svg>
        <div id="percent">{percent}%</div>
      </div>
    </div>
  );
}
