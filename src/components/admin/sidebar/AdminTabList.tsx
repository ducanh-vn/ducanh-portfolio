import type { AdminTab } from '@/types/admin';
import type { PortfolioData } from '@/types/portfolio';
import { ADMIN_TABS } from '@/constants/admin';

interface AdminTabListProps {
  activeTab: AdminTab;
  data: PortfolioData;
  onSelect: (tab: AdminTab) => void;
}

/** Tab buttons shared by the desktop sidebar and the mobile drawer. */
export default function AdminTabList({ activeTab, data, onSelect }: AdminTabListProps) {
  return (
    <>
      {ADMIN_TABS.map(({ id, label, icon: Icon, countKey }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          aria-current={activeTab === id ? 'page' : undefined}
          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
            activeTab === id
              ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
              : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
          }`}
        >
          <Icon className="w-4 h-4 text-[#f1f505]" />
          {countKey ? (
            <span>
              {`${label} (`}
              {data[countKey].length}
              {')'}
            </span>
          ) : (
            <span>{label}</span>
          )}
        </button>
      ))}
    </>
  );
}
