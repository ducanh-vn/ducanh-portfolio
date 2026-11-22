import type { ProfileData } from '@/types/portfolio';
import AvatarField from './AvatarField';
import { ADMIN_INPUT_CLASS, ADMIN_LABEL_CLASS, PROFILE_FIELDS } from '@/constants/admin';

interface ProfileTabProps {
  profile: ProfileData;
  onChange: (field: keyof ProfileData, value: string) => void;
}

/** TAB 1: PROFILE */
export default function ProfileTab({ profile, onChange }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl uppercase tracking-wider text-white border-b border-neutral-800 pb-4">
        Hồ sơ cá nhân
      </h2>

      <AvatarField value={profile.avatar} onChange={(url) => onChange('avatar', url)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROFILE_FIELDS.map((field) => (
          <div key={field.key}>
            <label className={ADMIN_LABEL_CLASS}>{field.label}</label>
            <input
              type={field.type}
              value={profile[field.key]}
              onChange={(e) => onChange(field.key, e.target.value)}
              className={ADMIN_INPUT_CLASS}
            />
          </div>
        ))}
      </div>

      <div>
        <label className={ADMIN_LABEL_CLASS}>Headline triết lý phát triển</label>
        <input
          type="text"
          value={profile.tagline}
          onChange={(e) => onChange('tagline', e.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </div>

      <div>
        <label className={ADMIN_LABEL_CLASS}>Giới thiệu bản thân (Bio)</label>
        <textarea
          rows={4}
          value={profile.bio}
          onChange={(e) => onChange('bio', e.target.value)}
          className={ADMIN_INPUT_CLASS}
        />
      </div>
    </div>
  );
}
