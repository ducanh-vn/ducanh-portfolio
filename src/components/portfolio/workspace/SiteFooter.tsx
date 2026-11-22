import type { ProfileData } from '@/types/portfolio';
import { LINK_CLASS } from '@/constants/ui';

interface SiteFooterProps {
  profile: ProfileData;
}

/** Bottom footer: social links and copyright. */
export default function SiteFooter({ profile }: SiteFooterProps) {
  return (
    <footer className="flex flex-col-reverse items-center gap-3 sm:flex-row sm:items-end sm:justify-between w-full mt-auto pt-8 pb-5 md:pb-10 text-neutral-400 text-xs">
      <div className="flex items-center gap-5 sm:gap-6">
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK_CLASS} uppercase tracking-widest text-[11px]`}
          data-cursor="pointer"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK_CLASS} uppercase tracking-widest text-[11px]`}
          data-cursor="pointer"
        >
          LinkedIn
        </a>
        <a
          href={`mailto:${profile.email}`}
          className={`${LINK_CLASS} uppercase tracking-widest text-[11px]`}
          data-cursor="pointer"
        >
          Email
        </a>
      </div>

      <div className="text-center sm:text-right">
        <p className="uppercase tracking-widest text-[11px] text-neutral-400">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="text-[11px] text-neutral-400 font-mono">ducanh-vn</p>
      </div>
    </footer>
  );
}
