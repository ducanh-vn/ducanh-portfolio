import Image from 'next/image';
import type { ProfileData } from '@/types/portfolio';
import { DEFAULT_AVATAR_URL } from '@/constants/portfolio';

interface ProfileCardProps {
  profile: ProfileData;
}

/** Portrait card with status badge, name and role. */
export default function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="relative w-full max-w-[340px] aspect-[4/3] sm:aspect-[4/5] rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
      <Image
        src={profile.avatar || DEFAULT_AVATAR_URL}
        alt={profile.name}
        fill
        sizes="(min-width: 640px) 340px, 100vw"
        className="object-cover object-[center_25%] filter grayscale contrast-125 group-hover:scale-105 transition-transform duration-700 opacity-90"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />

      <div className="absolute bottom-6 left-6 right-6">
        <span className="text-[11px] tracking-[0.25em] uppercase bg-[#f1f505] text-black font-bold px-2.5 py-1 rounded">
          {profile.status}
        </span>
        <h3 className="font-serif text-2xl text-white mt-2">{profile.name}</h3>
        <p className="text-xs text-neutral-300 font-sans tracking-wider">
          {profile.role}
        </p>
      </div>
    </div>
  );
}
