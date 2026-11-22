import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import type { AdminLoginState } from '@/hooks/admin/useAdminLogin';

interface PasswordStepProps {
  login: AdminLoginState;
}

/** STEP 1: PASSWORD FORM */
export default function PasswordStep({ login }: PasswordStepProps) {
  return (
    <form onSubmit={login.submitPassword} className="mt-8 space-y-5">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
          Mật khẩu quản trị
        </label>
        <div className="relative">
          <input
            type={login.showPassword ? 'text' : 'password'}
            value={login.password}
            onChange={(e) => login.setPassword(e.target.value)}
            placeholder="Nhập mật khẩu quản trị..."
            required
            autoFocus
            className="w-full bg-[#141414] border border-neutral-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#f1f505] transition-colors"
          />
          <button
            type="button"
            onClick={login.toggleShowPassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors focus:outline-none"
            title={login.showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {login.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={login.loading}
        className="w-full bg-[#f1f505] text-black font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#e0e404] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
      >
        <span>{login.loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
