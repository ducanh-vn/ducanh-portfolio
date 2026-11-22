import type { TransitionStage } from '@/types/ui';

interface PageTransitionCurtainProps {
  stage: TransitionStage;
  name: string;
}

/** Cinematic page transition curtain shown while switching views. */
export default function PageTransitionCurtain({ stage, name }: PageTransitionCurtainProps) {
  return (
    <div
      id="pageTransition"
      aria-hidden="true"
      className={`page-transition-curtain ${
        stage === 'in'
          ? 'is-entering'
          : stage === 'out'
          ? 'is-leaving'
          : ''
      }`}
    >
      <div className="transition-stripe" />
      <div className="transition-panel">
        <span className="transition-text font-serif">{name}</span>
        <span className="transition-subtext font-sans">Portfolio & Selected Works</span>
      </div>
    </div>
  );
}
