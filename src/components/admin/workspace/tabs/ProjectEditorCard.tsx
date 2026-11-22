import { Trash2 } from 'lucide-react';
import type { ProjectItem } from '@/types/portfolio';

interface ProjectEditorCardProps {
  proj: ProjectItem;
  onDelete: (id: string) => void;
  onUpdate: (field: keyof ProjectItem, val: any) => void;
}

export default function ProjectEditorCard({ proj, onDelete, onUpdate }: ProjectEditorCardProps) {
  return (
    <div
      className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#f1f505] tracking-widest font-bold">
          {proj.num} — {proj.title}
        </span>
        <button
          onClick={() => onDelete(proj.id)}
          className="p-2 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
          title="Xoá dự án"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Tên dự án
          </label>
          <input
            type="text"
            value={proj.title}
            onChange={(e) => onUpdate('title', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Phân loại (Category)
          </label>
          <input
            type="text"
            value={proj.category}
            onChange={(e) => onUpdate('category', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Năm thực hiện
          </label>
          <input
            type="text"
            value={proj.year}
            onChange={(e) => onUpdate('year', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
          Mô tả dự án
        </label>
        <textarea
          rows={2}
          value={proj.desc}
          onChange={(e) => onUpdate('desc', e.target.value)}
          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            GitHub Repo URL
          </label>
          <input
            type="text"
            value={proj.github}
            onChange={(e) => onUpdate('github', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Live Demo URL
          </label>
          <input
            type="text"
            value={proj.liveDemo}
            onChange={(e) => onUpdate('liveDemo', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>
    </div>
  );
}
