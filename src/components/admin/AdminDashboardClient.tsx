'use client';

import React, { useState } from 'react';
import type { PortfolioData } from '@/types/portfolio';
import type { AdminTab } from '@/types/admin';
import { ADMIN_TABS, DEFAULT_ADMIN_TAB } from '@/constants/admin';
import { usePortfolioEditor } from '@/hooks/admin/usePortfolioEditor';
import { useTwoFactor } from '@/hooks/admin/useTwoFactor';
import { useChangePassword } from '@/hooks/admin/useChangePassword';
import { useAdminLogout } from '@/hooks/admin/useAdminLogout';
import { useMobileNav } from '@/hooks/admin/useMobileNav';
import AdminTopbar from './topbar/AdminTopbar';
import AdminSidebar from './sidebar/AdminSidebar';
import MobileNavDrawer from './sidebar/MobileNavDrawer';
import AdminTabContent from './workspace/AdminTabContent';

interface AdminDashboardProps {
  initialData: PortfolioData;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>(DEFAULT_ADMIN_TAB);
  const editor = usePortfolioEditor(initialData);
  const twoFactor = useTwoFactor();
  const password = useChangePassword();
  const logout = useAdminLogout();
  const mobileNav = useMobileNav();
  const activeLabel = ADMIN_TABS.find((t) => t.id === activeTab)?.label ?? '';

  return (
    <div className="min-h-screen bg-[#111111] text-neutral-200">
      <AdminTopbar
        message={editor.message}
        isSaving={editor.isSaving}
        activeLabel={activeLabel}
        isMenuOpen={mobileNav.isOpen}
        onOpenMenu={mobileNav.open}
        onSave={editor.save}
        onLogout={logout}
      />

      <MobileNavDrawer
        isOpen={mobileNav.isOpen}
        onClose={mobileNav.close}
        activeTab={activeTab}
        data={editor.data}
        onSelect={setActiveTab}
        onLogout={logout}
      />

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-4 py-5 md:px-6 md:py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        <AdminSidebar activeTab={activeTab} data={editor.data} onSelect={setActiveTab} />
        <AdminTabContent
          activeTab={activeTab}
          editor={editor}
          twoFactor={twoFactor}
          password={password}
        />
      </div>
    </div>
  );
}
