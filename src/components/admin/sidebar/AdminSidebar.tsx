import type { AdminTab } from '@/types/admin';
import type { PortfolioData } from '@/types/portfolio';
import AdminTabList from './AdminTabList';

interface AdminSidebarProps {
  activeTab: AdminTab;
  data: PortfolioData;
  onSelect: (tab: AdminTab) => void;
}

/** Left navigation sidebar listing the editor tabs (desktop only; mobile uses MobileNavDrawer). */
export default function AdminSidebar({ activeTab, data, onSelect }: AdminSidebarProps) {
  return (
    <aside className="hidden md:block md:col-span-3 space-y-2">
      <AdminTabList activeTab={activeTab} data={data} onSelect={onSelect} />
    </aside>
  );
}
