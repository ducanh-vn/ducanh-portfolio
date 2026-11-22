import { X, ExternalLink, LogOut } from 'lucide-react';
import type { AdminTab } from '@/types/admin';
import type { PortfolioData } from '@/types/portfolio';
import AdminTabList from './AdminTabList';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: AdminTab;
  data: PortfolioData;
  onSelect: (tab: AdminTab) => void;
  onLogout: () => void;
}

/** Slide-in navigation for small screens: tab list plus the actions hidden from the mobile top bar. */
export default function MobileNavDrawer({
  isOpen,
  onClose,
  activeTab,
  data,
  onSelect,
  onLogout,
}: MobileNavDrawerProps) {
  const handleSelect = (tab: AdminTab) => {
    onSelect(tab);
    onClose();
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="md:hidden" aria-hidden={!isOpen}>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      <nav
        id="admin-mobile-nav"
        aria-label="Điều hướng quản trị"
        className={`fixed inset-y-0 left-0 z-[70] w-[82%] max-w-xs flex flex-col bg-[#161616] border-r border-neutral-800 shadow-2xl shadow-black/50 transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? 'translate-x-0 visible' : '-translate-x-full invisible'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-serif text-base font-bold text-[#f1f505]">
              DA
            </div>
            <span className="font-serif text-sm uppercase tracking-wider text-white">Admin Studio</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng menu"
            className="p-2 -mr-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <AdminTabList activeTab={activeTab} data={data} onSelect={handleSelect} />
        </div>

        <div className="px-3 py-4 border-t border-neutral-800 space-y-2">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium text-neutral-300 hover:bg-[#181818] hover:text-white"
          >
            <ExternalLink className="w-4 h-4 text-neutral-400" />
            <span>Xem trang chủ</span>
          </a>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium text-red-300 hover:bg-red-950/40"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
