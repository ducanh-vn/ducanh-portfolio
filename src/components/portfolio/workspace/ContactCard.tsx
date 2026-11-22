import { Download, Mail, MapPin, Github } from 'lucide-react';
import type { ProfileData } from '@/types/portfolio';
import { LINK_CLASS } from '@/constants/ui';
import { isUsableUrl } from '@/lib/url';

interface ContactCardProps {
  profile: ProfileData;
}

/** Download CV & contact CTA. */
export default function ContactCard({ profile }: ContactCardProps) {
  const hasCv = isUsableUrl(profile.cvUrl);

  return (
    <div className="w-full max-w-[340px] flex flex-col space-y-3">
      {hasCv && (
        <a
          href={profile.cvUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 bg-white text-black hover:bg-[#f1f505] transition-all font-semibold text-xs uppercase tracking-[0.2em] text-center rounded-xl flex items-center justify-center space-x-2 shadow-xl"
          data-cursor="pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download CV</span>
        </a>
      )}
      <div className="bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-300">
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-[#f1f505] shrink-0" />
          <a href={`mailto:${profile.email}`} className={`${LINK_CLASS} break-all`} data-cursor="pointer">
            {profile.email}
          </a>
        </div>
        <div className="flex items-center gap-3 min-h-[44px]">
          <MapPin className="w-4 h-4 text-[#f1f505] shrink-0" />
          <span>{profile.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <Github className="w-4 h-4 text-[#f1f505] shrink-0" />
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
            data-cursor="pointer"
          >
            {profile.github.replace('https://', '')}
          </a>
        </div>
      </div>
    </div>
  );
}
