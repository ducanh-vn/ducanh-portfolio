import { Trash2 } from 'lucide-react';

interface SkillsTabProps {
  skills: string[];
  newSkill: string;
  onNewSkillChange: (value: string) => void;
  onAddSkill: () => void;
  onDeleteSkill: (skill: string) => void;
}

/** TAB 4: SKILLS */
export default function SkillsTab({
  skills,
  newSkill,
  onNewSkillChange,
  onAddSkill,
  onDeleteSkill,
}: SkillsTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
          Kỹ năng & Công nghệ
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Quản lý danh sách các badge kỹ năng hiển thị trong profile.
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => onNewSkillChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddSkill();
            }
          }}
          placeholder="Nhập tên kỹ năng mới (ví dụ: Docker, Next.js, GraphQL)..."
          className="flex-1 bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
        />
        <button
          type="button"
          onClick={onAddSkill}
          className="px-5 py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-colors"
        >
          Thêm
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-4">
        {skills.map((skill) => (
          <div
            key={skill}
            className="flex items-center space-x-2 px-3.5 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-neutral-200 group"
          >
            <span>{skill}</span>
            <button
              onClick={() => onDeleteSkill(skill)}
              className="text-neutral-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
