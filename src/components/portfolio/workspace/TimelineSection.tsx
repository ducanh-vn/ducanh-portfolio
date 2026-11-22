import type { TimelineItem } from '@/types/portfolio';

interface TimelineSectionProps {
  timeline: TimelineItem[];
}

export default function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <div>
      <h3 className="text-xs uppercase tracking-[0.25em] text-neutral-300 font-bold mb-6 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-[#f1f505]" />
        <span>Hành trình & Kinh nghiệm</span>
      </h3>

      <div className="relative ml-2 space-y-8 border-l-2 border-neutral-800">
        {timeline.map((item) => (
          <div key={item.id} className="relative pl-8">
            <div className="timeline-dot" />
            <span className="text-xs font-mono text-[#f1f505] uppercase tracking-wider">
              {item.period}
            </span>
            <h4 className="text-white font-semibold text-base mt-1">
              {item.role}
            </h4>
            <p className="text-neutral-400 text-sm mt-1.5 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
