'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PortfolioData, ProfileData, ProjectItem, TimelineItem } from '@/types/portfolio';
import type { StatusMessage } from '@/types/admin';
import { SAVE_MESSAGE_MS } from '@/constants/admin';
import { putPortfolio } from '@/lib/api';
import { createProject, createTimelineItem, removeById, updateAt } from '@/lib/portfolio';

/** Editable copy of the portfolio data plus CRUD helpers and the save action. */
export function usePortfolioEditor(initialData: PortfolioData) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const router = useRouter();

  // Profile
  const updateProfile = (field: keyof ProfileData, val: string) => {
    setData({ ...data, profile: { ...data.profile, [field]: val } });
  };

  // Projects
  const addProject = () => {
    setData({ ...data, projects: [...data.projects, createProject(data.projects.length)] });
  };

  const deleteProject = (id: string) => {
    setData({ ...data, projects: removeById(data.projects, id) });
  };

  const updateProject = (index: number, field: keyof ProjectItem, val: any) => {
    setData({ ...data, projects: updateAt(data.projects, index, field, val) });
  };

  // Timeline
  const addTimeline = () => {
    setData({ ...data, timeline: [createTimelineItem(), ...data.timeline] });
  };

  const deleteTimeline = (id: string) => {
    setData({ ...data, timeline: removeById(data.timeline, id) });
  };

  const updateTimeline = (index: number, field: keyof TimelineItem, val: string) => {
    setData({ ...data, timeline: updateAt(data.timeline, index, field, val) });
  };

  // Skills
  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!data.skills.includes(newSkill.trim())) {
      setData({ ...data, skills: [...data.skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const deleteSkill = (skillToDelete: string) => {
    setData({ ...data, skills: data.skills.filter((s) => s !== skillToDelete) });
  };

  // Save changes to API
  const save = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await putPortfolio(data);

      if (res.ok) {
        setMessage({ text: 'Đã lưu mọi thay đổi thành công!', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: 'Lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Không thể kết nối đến máy chủ.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), SAVE_MESSAGE_MS);
    }
  };

  return {
    data,
    isSaving,
    message,
    newSkill,
    setNewSkill,
    updateProfile,
    addProject,
    deleteProject,
    updateProject,
    addTimeline,
    deleteTimeline,
    updateTimeline,
    addSkill,
    deleteSkill,
    save,
  };
}

export type PortfolioEditor = ReturnType<typeof usePortfolioEditor>;
