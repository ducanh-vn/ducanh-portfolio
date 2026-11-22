import { Trash2 } from 'lucide-react';
import type { TimelineItem } from '@/types/portfolio';

interface TimelineEditorCardProps {
  item: TimelineItem;
  index: number;
  onDelete: (id: string) => void;
  onUpdate: (field: keyof TimelineItem, val: string) => void;
}

export default function TimelineEditorCard({ item, index, onDelete, onUpdate }: TimelineEditorCardProps) {
  return (
    <div
      className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-3"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-[#f1f505] font-semibold">
          Cột mốc #{index + 1}
        </span>
        <button
          onClick={() => onDelete(item.id)}
          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Thời gian (Giai đoạn)
          </label>
          <input
            type="text"
            value={item.period}
            onChange={(e) => onUpdate('period', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
            Chức danh / Vai trò
          </label>
          <input
            type="text"
            value={item.role}
            onChange={(e) => onUpdate('role', e.target.value)}
            className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
          Chi tiết công việc / Thành tích
        </label>
        <textarea
          rows={2}
          value={item.desc}
          onChange={(e) => onUpdate('desc', e.target.value)}
          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
        />
      </div>
    </div>
  );
}
