import React from 'react';

export type TechLinkPlatform =
  | 'github'
  | 'linkedin'
  | 'website'
  | 'leetcode'
  | 'kaggle'
  | 'medium'
  | 'devto'
  | 'twitter'
  | 'youtube'
  | 'dribbble'
  | 'behance'
  | 'gitlab'
  | 'stackoverflow'
  | 'telegram'
  | 'discord'
  | 'custom';

export interface CustomTechLink {
  id: string;
  platform: TechLinkPlatform;
  label?: string;
  url: string;
  enabled?: boolean;
}

export interface PlatformMeta {
  id: TechLinkPlatform;
  name: string;
  defaultLabel: string;
  placeholder: string;
  prefix: string;
  color: string;
  badgeBg: string;
}

export const TECH_PLATFORM_META: Record<TechLinkPlatform, PlatformMeta> = {
  github: {
    id: 'github',
    name: 'GitHub',
    defaultLabel: 'GitHub',
    placeholder: 'https://github.com/username',
    prefix: 'github.com/',
    color: 'text-neutral-200',
    badgeBg: 'bg-neutral-800 text-neutral-200 border-neutral-700',
  },
  linkedin: {
    id: 'linkedin',
    name: 'LinkedIn',
    defaultLabel: 'LinkedIn',
    placeholder: 'https://linkedin.com/in/username',
    prefix: 'linkedin.com/in/',
    color: 'text-sky-400',
    badgeBg: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
  },
  website: {
    id: 'website',
    name: 'Portfolio / Website',
    defaultLabel: 'Portfolio',
    placeholder: 'https://ducanh.dev',
    prefix: '',
    color: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  },
  leetcode: {
    id: 'leetcode',
    name: 'LeetCode',
    defaultLabel: 'LeetCode',
    placeholder: 'https://leetcode.com/username',
    prefix: 'leetcode.com/',
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  },
  kaggle: {
    id: 'kaggle',
    name: 'Kaggle',
    defaultLabel: 'Kaggle',
    placeholder: 'https://kaggle.com/username',
    prefix: 'kaggle.com/',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
  medium: {
    id: 'medium',
    name: 'Medium / Tech Blog',
    defaultLabel: 'Medium',
    placeholder: 'https://medium.com/@username',
    prefix: 'medium.com/@',
    color: 'text-rose-400',
    badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
  },
  devto: {
    id: 'devto',
    name: 'Dev.to',
    defaultLabel: 'Dev.to',
    placeholder: 'https://dev.to/username',
    prefix: 'dev.to/',
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
  },
  twitter: {
    id: 'twitter',
    name: 'X (Twitter)',
    defaultLabel: 'X / Twitter',
    placeholder: 'https://x.com/username',
    prefix: 'x.com/',
    color: 'text-neutral-300',
    badgeBg: 'bg-neutral-800 text-neutral-300 border-neutral-700',
  },
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    defaultLabel: 'YouTube',
    placeholder: 'https://youtube.com/@channel',
    prefix: 'youtube.com/@',
    color: 'text-red-400',
    badgeBg: 'bg-red-500/10 text-red-300 border-red-500/20',
  },
  dribbble: {
    id: 'dribbble',
    name: 'Dribbble',
    defaultLabel: 'Dribbble',
    placeholder: 'https://dribbble.com/username',
    prefix: 'dribbble.com/',
    color: 'text-pink-400',
    badgeBg: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  },
  behance: {
    id: 'behance',
    name: 'Behance',
    defaultLabel: 'Behance',
    placeholder: 'https://behance.net/username',
    prefix: 'behance.net/',
    color: 'text-blue-400',
    badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  },
  gitlab: {
    id: 'gitlab',
    name: 'GitLab',
    defaultLabel: 'GitLab',
    placeholder: 'https://gitlab.com/username',
    prefix: 'gitlab.com/',
    color: 'text-orange-400',
    badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/20',
  },
  stackoverflow: {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    defaultLabel: 'Stack Overflow',
    placeholder: 'https://stackoverflow.com/users/...',
    prefix: 'stackoverflow.com/users/',
    color: 'text-amber-500',
    badgeBg: 'bg-amber-600/10 text-amber-300 border-amber-600/20',
  },
  telegram: {
    id: 'telegram',
    name: 'Telegram',
    defaultLabel: 'Telegram',
    placeholder: 'https://t.me/username',
    prefix: 't.me/',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-500/10 text-sky-200 border-sky-500/20',
  },
  discord: {
    id: 'discord',
    name: 'Discord',
    defaultLabel: 'Discord',
    placeholder: 'https://discord.gg/...',
    prefix: 'discord.gg/',
    color: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/10 text-indigo-200 border-indigo-500/20',
  },
  custom: {
    id: 'custom',
    name: 'Liên kết khác',
    defaultLabel: 'Link',
    placeholder: 'https://...',
    prefix: '',
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  },
};

export const POPULAR_LINK_PRESETS: { platform: TechLinkPlatform; label: string; icon: string }[] = [
  { platform: 'leetcode', label: 'LeetCode', icon: '🧠' },
  { platform: 'github', label: 'GitHub', icon: '🐙' },
  { platform: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { platform: 'website', label: 'Portfolio', icon: '🌐' },
  { platform: 'kaggle', label: 'Kaggle', icon: '📊' },
  { platform: 'medium', label: 'Medium', icon: '✍️' },
  { platform: 'devto', label: 'Dev.to', icon: '👨‍💻' },
  { platform: 'stackoverflow', label: 'StackOverflow', icon: '📚' },
  { platform: 'twitter', label: 'X / Twitter', icon: '🐦' },
  { platform: 'gitlab', label: 'GitLab', icon: '🦊' },
];

export function detectLinkPlatform(url: string): TechLinkPlatform {
  const lower = (url || '').toLowerCase().trim();
  if (lower.includes('leetcode.com')) return 'leetcode';
  if (lower.includes('kaggle.com')) return 'kaggle';
  if (lower.includes('github.com')) return 'github';
  if (lower.includes('linkedin.com')) return 'linkedin';
  if (lower.includes('medium.com')) return 'medium';
  if (lower.includes('dev.to')) return 'devto';
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter';
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) return 'youtube';
  if (lower.includes('dribbble.com')) return 'dribbble';
  if (lower.includes('behance.net')) return 'behance';
  if (lower.includes('gitlab.com')) return 'gitlab';
  if (lower.includes('stackoverflow.com')) return 'stackoverflow';
  if (lower.includes('t.me') || lower.includes('telegram.org')) return 'telegram';
  if (lower.includes('discord.gg') || lower.includes('discord.com')) return 'discord';
  if (
    lower.includes('http://') ||
    lower.includes('https://') ||
    lower.includes('.dev') ||
    lower.includes('.com') ||
    lower.includes('.io') ||
    lower.includes('.me') ||
    lower.includes('.org')
  ) {
    return 'website';
  }
  return 'custom';
}

export function formatLinkDisplay(url: string, platform?: TechLinkPlatform): string {
  if (!url) return '';
  let clean = url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/$/, '');

  // For LeetCode: leetcode.com/username
  if (platform === 'leetcode' && clean.startsWith('leetcode.com/u/')) {
    clean = clean.replace('leetcode.com/u/', 'leetcode.com/');
  }
  // For GitHub: github.com/username
  // For LinkedIn: linkedin.com/in/username
  return clean;
}

export function ensureCustomLinks(cv: any): CustomTechLink[] {
  if (Array.isArray(cv.customLinks) && cv.customLinks.length > 0) {
    return cv.customLinks;
  }
  const links: CustomTechLink[] = [];
  if (cv.github && cv.github.trim()) {
    links.push({
      id: 'link-gh',
      platform: 'github',
      label: formatLinkDisplay(cv.github, 'github'),
      url: cv.github,
      enabled: true,
    });
  }
  if (cv.linkedin && cv.linkedin.trim()) {
    links.push({
      id: 'link-in',
      platform: 'linkedin',
      label: formatLinkDisplay(cv.linkedin, 'linkedin'),
      url: cv.linkedin,
      enabled: true,
    });
  }
  if (cv.website && cv.website.trim()) {
    links.push({
      id: 'link-web',
      platform: 'website',
      label: formatLinkDisplay(cv.website, 'website'),
      url: cv.website,
      enabled: true,
    });
  }
  // Pre-seed LeetCode if none present
  if (!links.some((l) => l.platform === 'leetcode')) {
    links.push({
      id: 'link-lc',
      platform: 'leetcode',
      label: 'leetcode.com/ducanh',
      url: 'https://leetcode.com/ducanh',
      enabled: true,
    });
  }
  return links;
}

export function getActiveTechLinks(cv: any): CustomTechLink[] {
  const links = ensureCustomLinks(cv);
  return links.filter((l) => l.enabled !== false && Boolean(l.url && l.url.trim()));
}
