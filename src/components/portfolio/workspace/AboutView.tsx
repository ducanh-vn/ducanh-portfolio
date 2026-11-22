import { ArrowLeft } from 'lucide-react';
import type { PortfolioData } from '@/types/portfolio';
import ProfileCard from './ProfileCard';
import ContactCard from './ContactCard';
import BioSection from './BioSection';
import TimelineSection from './TimelineSection';
import SkillsSection from './SkillsSection';

interface AboutViewProps {
  data: PortfolioData;
  onBack: () => void;
}

/** VIEW 2: ABOUT ME (Split Asymmetric Layout) */
export default function AboutView({ data, onBack }: AboutViewProps) {
  const { profile, skills, timeline } = data;

  return (
    <main className="flex-1 w-full pt-2 pb-8">
      <button
        onClick={onBack}
        className="mb-6 md:mb-8 -ml-1 px-1 min-h-[44px] flex items-center space-x-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-[#f1f505] transition-colors"
        data-cursor="pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        {/* Left Column: Portrait & Quick Actions */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-6">
          <ProfileCard profile={profile} />
          <ContactCard profile={profile} />
        </div>

        {/* Right Column: Bio, Timeline & Tech Stack */}
        <div className="lg:col-span-7 space-y-12">
          <BioSection profile={profile} />
          <TimelineSection timeline={timeline} />
          <SkillsSection skills={skills} />
        </div>
      </div>
    </main>
  );
}
