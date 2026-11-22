import type { ProfileData } from '@/types/portfolio';

interface BioSectionProps {
  profile: ProfileData;
}

export default function BioSection({ profile }: BioSectionProps) {
  return (
    <div>
      <span className="font-cursive text-2xl text-[#f1f505]">About me</span>
      <h2 className="font-serif text-[28px] leading-tight md:text-4xl text-white tracking-wide mt-1 uppercase">
        {profile.tagline}
      </h2>
      <p className="text-neutral-300 text-sm md:text-[15px] leading-relaxed mt-4 max-w-prose">
        {profile.bio}
      </p>
    </div>
  );
}
