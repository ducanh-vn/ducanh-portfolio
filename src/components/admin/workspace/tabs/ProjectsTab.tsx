import { Plus } from 'lucide-react';
import type { ProjectItem } from '@/types/portfolio';
import ProjectEditorCard from './ProjectEditorCard';

interface ProjectsTabProps {
  projects: ProjectItem[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (index: number, field: keyof ProjectItem, val: any) => void;
}

/** TAB 2: PROJECTS */
export default function ProjectsTab({ projects, onAdd, onDelete, onUpdate }: ProjectsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div>
          <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
            Dự án tiêu biểu
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Quản lý danh sách các dự án hiển thị trong Drawer và Gallery.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs uppercase tracking-wider text-[#f1f505] transition-colors border border-neutral-700"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm dự án</span>
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((proj, idx) => (
          <ProjectEditorCard
            key={proj.id}
            proj={proj}
            onDelete={onDelete}
            onUpdate={(field, val) => onUpdate(idx, field, val)}
          />
        ))}
      </div>
    </div>
  );
}
