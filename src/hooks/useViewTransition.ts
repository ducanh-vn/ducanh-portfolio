'use client';

import { useState } from 'react';
import type { PortfolioView, TransitionStage } from '@/types/ui';
import { VIEW_TRANSITION_COVER_MS, VIEW_TRANSITION_REVEAL_MS } from '@/constants/portfolio';

/** Cinematic curtain transition between the Home and About views (React state + CSS keyframes). */
export function useViewTransition(initialView: PortfolioView = 'home') {
  const [currentView, setCurrentView] = useState<PortfolioView>(initialView);
  const [transitionStage, setTransitionStage] = useState<TransitionStage>('idle');

  const switchView = (targetView: PortfolioView) => {
    if (targetView === currentView || transitionStage !== 'idle') return;

    // Step 1: Sweep curtain up to cover screen
    setTransitionStage('in');

    setTimeout(() => {
      // Step 2: Swap view content at peak coverage and reset scroll
      setCurrentView(targetView);
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Step 3: Sweep curtain up and out of screen
      setTransitionStage('out');

      setTimeout(() => {
        setTransitionStage('idle');
      }, VIEW_TRANSITION_REVEAL_MS);
    }, VIEW_TRANSITION_COVER_MS);
  };

  return { currentView, transitionStage, switchView };
}
