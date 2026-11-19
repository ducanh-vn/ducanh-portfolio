import { CVTypographyConfig } from './cvTypography';

export interface CVProfile {
  id: string;
  name: string;
  targetRole?: string;
  createdAt: string;
  updatedAt: string;
  isDefault?: boolean;
  // Content data
  cvVi: any;
  cvEn: any;
  activeLang: 'vi' | 'en';
  // Matching Cover Letter data
  coverLetterVi?: any;
  coverLetterEn?: any;
  // Design & layout settings
  template: string;
  accentColor: string;
  fontFamily: string;
  isCompact: boolean;
  typography?: CVTypographyConfig;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
}

export const STORAGE_PROFILES_KEY = 'ducanh_cv_profiles_v1';
export const STORAGE_ACTIVE_PROFILE_ID_KEY = 'ducanh_active_cv_profile_id';

/**
 * Creates initial profiles, using any existing saved CV as Profile 1,
 * and adds an optional specialized sample profile (e.g. Senior Frontend / Fullstack)
 */
export function createInitialProfiles(
  existingVi: any,
  existingEn: any,
  currentSettings: {
    template: string;
    accentColor: string;
    fontFamily: string;
    isCompact: boolean;
    typography?: CVTypographyConfig;
    sectionOrder: string[];
    sectionVisibility: Record<string, boolean>;
    activeLang?: 'vi' | 'en';
  }
): CVProfile[] {
  const now = new Date().toISOString();

  // Profile 1: Main / Default Profile
  const profile1: CVProfile = {
    id: 'profile-main',
    name: 'Hồ sơ Fullstack & Web (Mặc định)',
    targetRole: 'Fullstack / Frontend Engineer',
    createdAt: now,
    updatedAt: now,
    isDefault: true,
    cvVi: existingVi,
    cvEn: existingEn,
    activeLang: currentSettings.activeLang || 'vi',
    template: currentSettings.template || 'rabbit',
    accentColor: currentSettings.accentColor || 'blue',
    fontFamily: currentSettings.fontFamily || 'inter',
    isCompact: currentSettings.isCompact ?? false,
    typography: currentSettings.typography,
    sectionOrder: currentSettings.sectionOrder || [],
    sectionVisibility: currentSettings.sectionVisibility || {},
  };

  // Profile 2: Senior Frontend Specialist (cloned with customized title & template)
  const profile2Vi = JSON.parse(JSON.stringify(existingVi));
  profile2Vi.title = 'SENIOR FRONTEND ENGINEER & UI/UX ARCHITECT';
  profile2Vi.summary =
    'Kỹ sư Frontend giàu kinh nghiệm chuyên sâu về React, Next.js, TypeScript và tối ưu hiệu năng Web Vitals. Đam mê xây dựng Design System và kiến trúc ứng dụng Web quy mô lớn với trải nghiệm người dùng mượt mà.';

  const profile2En = JSON.parse(JSON.stringify(existingEn));
  profile2En.title = 'SENIOR FRONTEND ENGINEER & UI/UX ARCHITECT';
  profile2En.summary =
    'Passionate Frontend Engineer specializing in React, Next.js, TypeScript, and Core Web Vitals optimization. Dedicated to crafting scalable Design Systems and high-performance web applications with superior UX.';

  const profile2: CVProfile = {
    id: 'profile-frontend-lead',
    name: 'Frontend & UI/UX Specialist',
    targetRole: 'Senior Frontend / UI Architect',
    createdAt: now,
    updatedAt: now,
    isDefault: false,
    cvVi: profile2Vi,
    cvEn: profile2En,
    activeLang: 'vi',
    template: 'cascade', // distinctive template
    accentColor: 'emerald',
    fontFamily: 'bevietnam',
    isCompact: false,
    sectionOrder: currentSettings.sectionOrder || [],
    sectionVisibility: currentSettings.sectionVisibility || {},
  };

  return [profile1, profile2];
}

/**
 * Loads profiles list from localStorage, or creates initial profiles if none exist.
 */
export function loadProfilesFromStorage(
  fallbackVi: any,
  fallbackEn: any,
  currentSettings: any
): { profiles: CVProfile[]; activeProfileId: string } {
  if (typeof window === 'undefined') {
    const initials = createInitialProfiles(fallbackVi, fallbackEn, currentSettings);
    return { profiles: initials, activeProfileId: initials[0].id };
  }

  try {
    const raw = localStorage.getItem(STORAGE_PROFILES_KEY);
    const savedActiveId = localStorage.getItem(STORAGE_ACTIVE_PROFILE_ID_KEY);

    if (raw) {
      const parsed = JSON.parse(raw) as CVProfile[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const activeId =
          savedActiveId && parsed.some((p) => p.id === savedActiveId)
            ? savedActiveId
            : parsed[0].id;
        return { profiles: parsed, activeProfileId: activeId };
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved CV profiles from storage:', err);
  }

  // If no profiles in storage, initialize
  const initials = createInitialProfiles(fallbackVi, fallbackEn, currentSettings);
  saveProfilesToStorage(initials, initials[0].id);
  return { profiles: initials, activeProfileId: initials[0].id };
}

/**
 * Saves profiles list and active profile ID to localStorage.
 */
export function saveProfilesToStorage(profiles: CVProfile[], activeProfileId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PROFILES_KEY, JSON.stringify(profiles));
    localStorage.setItem(STORAGE_ACTIVE_PROFILE_ID_KEY, activeProfileId);
  } catch (err) {
    console.warn('Failed to save CV profiles to storage:', err);
  }
}

/**
 * Duplicates an existing profile.
 */
export function duplicateCVProfile(source: CVProfile, newName?: string): CVProfile {
  const now = new Date().toISOString();
  const id = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    ...JSON.parse(JSON.stringify(source)),
    id,
    name: newName || `${source.name} (Bản sao)`,
    isDefault: false,
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Creates a brand new empty profile based on defaults.
 */
export function createNewCVProfile(
  name: string,
  targetRole: string,
  baseVi: any,
  baseEn: any,
  settings: any
): CVProfile {
  const now = new Date().toISOString();
  const id = `profile-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  return {
    id,
    name: name.trim() || 'Phiên bản CV mới',
    targetRole: targetRole.trim() || 'Software Engineer',
    createdAt: now,
    updatedAt: now,
    isDefault: false,
    cvVi: JSON.parse(JSON.stringify(baseVi)),
    cvEn: JSON.parse(JSON.stringify(baseEn)),
    activeLang: settings.activeLang || 'vi',
    coverLetterVi: settings.coverLetterVi || null,
    coverLetterEn: settings.coverLetterEn || null,
    template: settings.template || 'rabbit',
    accentColor: settings.accentColor || 'blue',
    fontFamily: settings.fontFamily || 'inter',
    isCompact: settings.isCompact ?? false,
    typography: settings.typography,
    sectionOrder: settings.sectionOrder || [],
    sectionVisibility: settings.sectionVisibility || {},
  };
}
