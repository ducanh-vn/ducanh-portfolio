import { Save, ExternalLink, LogOut, CheckCircle2, AlertCircle, Menu } from 'lucide-react';
import type { StatusMessage } from '@/types/admin';

interface AdminTopbarProps {
  message: StatusMessage | null;
  isSaving: boolean;
  /** Label of the open tab, shown under the title on small screens. */
  activeLabel: string;
  isMenuOpen: boolean;
  onOpenMenu: () => void;
  onSave: () => void;
  onLogout: () => void;
}

/**
 * Top navbar: brand, save status, view-site link, save and logout actions.
 * On small screens it collapses to menu button, brand, current tab and an icon save button;
 * the view-site link and logout move into the mobile drawer.
 */
export default function AdminTopbar({
  message,
  isSaving,
  activeLabel,
  isMenuOpen,
  onOpenMenu,
  onSave,
  onLogout,
}: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#161616]/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 md:px-6 md:py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 md:gap-4 min-w-0">
        <button
          onClick={onOpenMenu}
          aria-label="Mở menu"
          aria-expanded={isMenuOpen}
          aria-controls="admin-mobile-nav"
          className="md:hidden p-2 -ml-2 text-neutral-300 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-serif text-base md:text-lg font-bold text-[#f1f505]">
          DA
        </div>
        <div className="min-w-0">
          <h1 className="font-serif text-sm md:text-lg uppercase tracking-wider text-white truncate">
            <span className="hidden md:inline">Portfolio </span>Admin Studio
          </h1>
          <p className="hidden md:block text-[11px] text-neutral-400 font-sans">
            Hệ thống quản trị hồ sơ cá nhân
          </p>
          <p className="md:hidden text-[11px] text-[#f1f505]/80 font-sans truncate">{activeLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {message && (
          <div
            role="status"
            className={`fixed top-[68px] left-4 right-4 md:static flex items-center space-x-2 text-xs px-3.5 py-2 md:py-1.5 rounded-lg border shadow-lg md:shadow-none ${
              message.type === 'success'
                ? 'bg-emerald-950/95 md:bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/95 md:bg-red-950/60 border-red-500/50 text-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <a
          href="/"
          target="_blank"
          className="hidden md:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs tracking-wider"
        >
          <span>Xem trang chủ</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onSave}
          disabled={isSaving}
          aria-label={isSaving ? 'Đang lưu' : 'Lưu dữ liệu'}
          className="flex items-center space-x-2 p-2.5 md:px-5 md:py-2 rounded-xl bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
          <span className="hidden md:inline">{isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
        </button>

        <button
          onClick={onLogout}
          className="hidden md:block p-2 text-neutral-400 hover:text-red-400 rounded-xl hover:bg-neutral-900 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
