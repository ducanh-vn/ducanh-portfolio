import { User, FolderGit2, Clock, Wrench, FileText, Shield, type LucideIcon } from 'lucide-react';
import type { AdminTab, PortfolioCountKey } from '@/types/admin';

export interface AdminTabConfig {
  id: AdminTab;
  label: string;
  icon: LucideIcon;
  /** When set, the label is followed by " (<count>)" from this list in the data. */
  countKey?: PortfolioCountKey;
}

export const ADMIN_TABS: AdminTabConfig[] = [
  { id: 'profile', label: 'Hồ sơ & Giới thiệu', icon: User },
  { id: 'projects', label: 'Dự án tiêu biểu', icon: FolderGit2, countKey: 'projects' },
  { id: 'timeline', label: 'Dòng thời gian', icon: Clock, countKey: 'timeline' },
  { id: 'skills', label: 'Kỹ năng & Stack', icon: Wrench, countKey: 'skills' },
  { id: 'cv', label: 'Công cụ tạo CV (Studio)', icon: FileText },
  { id: 'security', label: 'Bảo mật & 2FA', icon: Shield },
];

export const DEFAULT_ADMIN_TAB: AdminTab = 'profile';

/** How long the save status badge stays in the top bar (ms). */
export const SAVE_MESSAGE_MS = 4000;
/** How long the "copied" check mark shows after copying the 2FA secret (ms). */
export const COPY_FEEDBACK_MS = 2000;

export const NEW_PROJECT_TEMPLATE = {
  title: 'Dự án mới',
  category: 'Web App',
  desc: 'Mô tả ngắn gọn về tính năng và công nghệ sử dụng trong dự án...',
  badges: ['TypeScript', 'React'],
  liveDemo: '',
  github: '',
  features: [{ title: 'Tính năng chính 1', detail: 'Chi tiết tính năng và hiệu năng...' }],
};

export const NEW_TIMELINE_TEMPLATE = {
  period: '2024 — HIỆN TẠI',
  role: 'Vị trí công việc / Học vấn',
  desc: 'Mô tả chi tiết các trách nhiệm và thành tựu đạt được...',
};

/** Shared input styles in the admin editor. */
export const ADMIN_INPUT_CLASS =
  'w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]';
export const ADMIN_LABEL_CLASS =
  'block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2';

export interface ProfileFieldConfig {
  key: 'name' | 'role' | 'email' | 'status' | 'github' | 'linkedin';
  label: string;
  type: 'text' | 'email';
}

/** Two-column grid of single-line profile fields, in display order. */
export const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: 'name', label: 'Họ và tên', type: 'text' },
  { key: 'role', label: 'Tiêu đề nghề nghiệp', type: 'text' },
  { key: 'email', label: 'Email liên hệ', type: 'email' },
  { key: 'status', label: 'Trạng thái sẵn sàng', type: 'text' },
  { key: 'github', label: 'Link GitHub', type: 'text' },
  { key: 'linkedin', label: 'Link LinkedIn', type: 'text' },
];
