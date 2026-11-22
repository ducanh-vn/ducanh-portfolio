import type { ProjectItem, TimelineItem } from '@/types/portfolio';
import { NEW_PROJECT_TEMPLATE, NEW_TIMELINE_TEMPLATE } from '@/constants/admin';

/** Build a fresh project placeholder; `count` is how many projects exist already. */
export function createProject(count: number): ProjectItem {
  return {
    id: `project-${Date.now()}`,
    num: `0${count + 1}`,
    title: NEW_PROJECT_TEMPLATE.title,
    category: NEW_PROJECT_TEMPLATE.category,
    year: new Date().getFullYear().toString(),
    desc: NEW_PROJECT_TEMPLATE.desc,
    badges: [...NEW_PROJECT_TEMPLATE.badges],
    liveDemo: NEW_PROJECT_TEMPLATE.liveDemo,
    github: NEW_PROJECT_TEMPLATE.github,
    features: NEW_PROJECT_TEMPLATE.features.map((f) => ({ ...f })),
  };
}

export function createTimelineItem(): TimelineItem {
  return {
    id: `timeline-${Date.now()}`,
    ...NEW_TIMELINE_TEMPLATE,
  };
}

/** Return a copy of `list` with one field of the item at `index` replaced. */
export function updateAt<T>(list: T[], index: number, field: keyof T, val: unknown): T[] {
  const updated = [...list];
  updated[index] = { ...updated[index], [field]: val };
  return updated;
}

export function removeById<T extends { id: string }>(list: T[], id: string): T[] {
  return list.filter((item) => item.id !== id);
}
