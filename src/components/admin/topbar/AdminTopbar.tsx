import { Save, ExternalLink, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import type { StatusMessage } from '@/types/admin';

interface AdminTopbarProps {
  message: StatusMessage | null;
  isSaving: boolean;
  onSave: () => void;
  onLogout: () => void;
}

/** Top navbar: brand, save status, view-site link, save and logout actions. */
export default function AdminTopbar({ message, isSaving, onSave, onLogout }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#161616]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-serif text-lg font-bold text-[#f1f505]">
          DA
        </div>
        <div>
          <h1 className="font-serif text-lg uppercase tracking-wider text-white">
            Portfolio Admin Studio
          </h1>
          <p className="text-[11px] text-neutral-400 font-sans">
            Hệ thống quản trị hồ sơ cá nhân
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {message && (
          <div
            className={`flex items-center space-x-2 text-xs px-3.5 py-1.5 rounded-lg border ${
              message.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                : 'bg-red-950/60 border-red-500/50 text-red-200'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <a
          href="/"
          target="_blank"
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs tracking-wider"
        >
          <span>Xem trang chủ</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
        </button>

        <button
          onClick={onLogout}
          className="p-2 text-neutral-400 hover:text-red-400 rounded-xl hover:bg-neutral-900 transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
