import type { ReactNode } from 'react';
import type { AdminTab } from '@/types/admin';
import type { PortfolioEditor } from '@/hooks/admin/usePortfolioEditor';
import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';
import type { ChangePasswordState } from '@/hooks/admin/useChangePassword';
import ProfileTab from './tabs/ProfileTab';
import ProjectsTab from './tabs/ProjectsTab';
import TimelineTab from './tabs/TimelineTab';
import SkillsTab from './tabs/SkillsTab';
import CvTab from './tabs/CvTab';
import SecurityTab from './tabs/SecurityTab';

interface AdminTabContentProps {
  activeTab: AdminTab;
  editor: PortfolioEditor;
  twoFactor: TwoFactorState;
  password: ChangePasswordState;
}

/** Right content editor: picks the active tab from a map (dispatcher pattern). */
export default function AdminTabContent({ activeTab, editor, twoFactor, password }: AdminTabContentProps) {
  const { data } = editor;

  const tabs: Record<AdminTab, () => ReactNode> = {
    profile: () => <ProfileTab profile={data.profile} onChange={editor.updateProfile} />,
    projects: () => (
      <ProjectsTab
        projects={data.projects}
        onAdd={editor.addProject}
        onDelete={editor.deleteProject}
        onUpdate={editor.updateProject}
      />
    ),
    timeline: () => (
      <TimelineTab
        timeline={data.timeline}
        onAdd={editor.addTimeline}
        onDelete={editor.deleteTimeline}
        onUpdate={editor.updateTimeline}
      />
    ),
    skills: () => (
      <SkillsTab
        skills={data.skills}
        newSkill={editor.newSkill}
        onNewSkillChange={editor.setNewSkill}
        onAddSkill={editor.addSkill}
        onDeleteSkill={editor.deleteSkill}
      />
    ),
    cv: () => (
      <CvTab cvUrl={data.profile.cvUrl} onCvUrlChange={(value) => editor.updateProfile('cvUrl', value)} />
    ),
    security: () => <SecurityTab twoFactor={twoFactor} password={password} />,
  };

  return (
    <main className="md:col-span-9 bg-[#171717] border border-neutral-800 rounded-2xl p-8 shadow-xl">
      {tabs[activeTab]()}
    </main>
  );
}
