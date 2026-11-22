import { ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onEnterProfile: () => void;
}

/** VIEW 1: HOME (Editorial Hero) */
export default function HomeView({ onEnterProfile }: HomeViewProps) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12">
      <div
        role="button"
        tabIndex={0}
        aria-label="Xem thông tin về tôi"
        className="group text-center w-full mx-auto cursor-pointer select-none rounded-2xl"
        onClick={onEnterProfile}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEnterProfile();
          }
        }}
        data-cursor="view"
      >
        <span className="block font-cursive text-xl md:text-2xl text-[#f1f505] mb-2 tracking-wide">
          Portfolio & Selected Works
        </span>
        <h1 className="editorial-hero-text text-neutral-200">
          <span>Click to</span>
          <span className="glow-text text-white">View Information</span>
          <span>About Me</span>
        </h1>
        <span className="text-neutral-300 text-xs md:text-sm tracking-[0.25em] uppercase mt-8 flex items-center justify-center gap-2 group-hover:text-white transition-colors">
          <span>Enter profile</span>
          <ArrowRight className="w-4 h-4 text-[#f1f505] transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </main>
  );
}
