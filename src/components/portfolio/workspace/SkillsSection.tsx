interface SkillsSectionProps {
  skills: string[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold mb-4 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#f1f505]" />
        <span>Công nghệ trọng tâm</span>
      </h3>

      <div className="flex flex-wrap gap-2.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3.5 py-1.5 bg-[#1f1f1f] border border-neutral-800 rounded-lg text-xs text-neutral-200 hover:border-[#f1f505] transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
