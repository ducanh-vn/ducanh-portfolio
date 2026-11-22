import { Plus } from 'lucide-react';
import type { TimelineItem } from '@/types/portfolio';
import TimelineEditorCard from './TimelineEditorCard';

interface TimelineTabProps {
  timeline: TimelineItem[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (index: number, field: keyof TimelineItem, val: string) => void;
}

/** TAB 3: TIMELINE */
export default function TimelineTab({ timeline, onAdd, onDelete, onUpdate }: TimelineTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
            Dòng thời gian & Kinh nghiệm
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Cập nhật các cột mốc kinh nghiệm và học vấn.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs uppercase tracking-wider text-[#f1f505] transition-colors border border-neutral-700"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm cột mốc</span>
        </button>
      </div>

      <div className="space-y-4">
        {timeline.map((item, idx) => (
          <TimelineEditorCard
            key={item.id}
            item={item}
            index={idx}
            onDelete={onDelete}
            onUpdate={(field, val) => onUpdate(idx, field, val)}
          />
        ))}
      </div>
    </div>
  );
}
