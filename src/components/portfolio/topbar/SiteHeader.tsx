import Link from 'next/link';
import { Settings } from 'lucide-react';
import type { ProfileData } from '@/types/portfolio';
import type { PortfolioView } from '@/types/ui';

interface SiteHeaderProps {
  profile: ProfileData;
  currentView: PortfolioView;
  isScrolled: boolean;
  projectCount: string;
  onSwitchView: (view: PortfolioView) => void;
  onOpenProjects: () => void;
}

/** Top navigation header (sticky, solid once scrolled). */
export default function SiteHeader({
  profile,
  currentView,
  isScrolled,
  projectCount,
  onSwitchView,
  onOpenProjects,
}: SiteHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        isScrolled
          ? 'bg-[#141414]/80 backdrop-blur-md border-white/5'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto px-5 md:px-12 flex items-center justify-between gap-3 transition-[padding] duration-300 ${
          isScrolled ? 'py-3' : 'py-5 md:py-8'
        }`}
      >
      {/* Logo Badge with rotating dashed border */}
      <button
        type="button"
        className="flex items-center space-x-3 cursor-pointer group text-left shrink-0"
        onClick={() => onSwitchView('home')}
        aria-label="Về trang chủ"
        data-cursor="pointer"
      >
        <span className="relative w-12 h-12 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full logo-ring" viewBox="0 0 50 50" aria-hidden="true">
            <circle
              cx="25"
              cy="25"
              r="23"
              fill="none"
              stroke="#f1f505"
              strokeWidth="1.5"
              strokeDasharray="4, 4"
              opacity="0.6"
            />
          </svg>
          <span className="font-serif text-lg font-bold tracking-wider text-white group-hover:text-[#f1f505] transition-colors">
            DA
          </span>
        </span>
        <span className="hidden md:block">
          <span className="block text-xs uppercase tracking-widest text-neutral-300 font-medium">
            {profile.name}
          </span>
          <span className="block text-[11px] text-neutral-400 font-sans tracking-wide">
            {profile.role.split('&')[0]}
          </span>
        </span>
      </button>

      {/* Action Buttons */}
      <nav className="flex items-center gap-1 sm:gap-4" aria-label="Điều hướng chính">
        <button
          onClick={() => onSwitchView(currentView === 'home' ? 'about' : 'home')}
          className="text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-neutral-300 hover:text-[#f1f505] transition-colors min-h-[44px] px-3"
          data-cursor="pointer"
        >
          {currentView === 'home' ? 'About' : 'Home'}
        </button>

        <button
          onClick={onOpenProjects}
          aria-haspopup="dialog"
          className="flex items-center gap-2 whitespace-nowrap text-xs uppercase tracking-[0.15em] sm:tracking-[0.25em] bg-[#1a1a1a] border border-neutral-700 hover:border-[#f1f505] text-white hover:text-[#f1f505] transition-all min-h-[44px] px-4 sm:px-5 rounded-full shadow-lg"
          data-cursor="pointer"
        >
          <span>Projects</span>
          <span className="text-[#f1f505] font-mono text-[11px] tracking-normal">
            [{projectCount}]
          </span>
        </button>

        {/* Admin Portal Icon Link */}
        <Link
          href="/admin"
          className="text-neutral-400 hover:text-[#f1f505] transition-colors w-11 h-11 hidden sm:inline-flex items-center justify-center rounded-full hover:bg-neutral-900"
          title="Admin CMS"
          aria-label="Admin CMS"
          data-cursor="pointer"
        >
          <Settings className="w-4 h-4" />
        </Link>
      </nav>
      </div>
    </header>
  );
}
