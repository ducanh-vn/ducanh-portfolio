import type { AdminTab } from '@/types/admin';
import type { PortfolioData } from '@/types/portfolio';
import { ADMIN_TABS } from '@/constants/admin';

interface AdminSidebarProps {
  activeTab: AdminTab;
  data: PortfolioData;
  onSelect: (tab: AdminTab) => void;
}

/** Left navigation sidebar listing the editor tabs. */
export default function AdminSidebar({ activeTab, data, onSelect }: AdminSidebarProps) {
  return (
    <aside className="md:col-span-3 space-y-2">
      {ADMIN_TABS.map(({ id, label, icon: Icon, countKey }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
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
    </aside>
  );
}
