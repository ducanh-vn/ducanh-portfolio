import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { AdminLoginState } from '@/hooks/admin/useAdminLogin';

interface TwoFactorStepProps {
  login: AdminLoginState;
}

/** STEP 2: 2FA CODE FORM */
export default function TwoFactorStep({ login }: TwoFactorStepProps) {
  return (
    <form onSubmit={login.submit2FA} className="mt-8 space-y-5">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 text-center">
          Mã xác thực Google Authenticator
        </label>
        <div className="relative">
          <input
            type="text"
            value={login.twoFactorCode}
            onChange={(e) => login.changeTwoFactorCode(e.target.value)}
            placeholder="000000"
            required
            maxLength={6}
            inputMode="numeric"
            autoFocus
            className="w-full bg-[#141414] border border-neutral-700 rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-[0.5em] text-[#f1f505] focus:outline-none focus:border-[#f1f505] transition-colors placeholder:text-neutral-700"
          />
        </div>
        <p className="text-[11px] text-neutral-500 text-center mt-2">
          Mã 6 chữ số thay đổi mỗi 30 giây trong ứng dụng xác thực
        </p>
      </div>

      <button
        type="submit"
        disabled={login.loading || login.twoFactorCode.length !== 6}
        className="w-full bg-[#f1f505] text-black font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#e0e404] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
      >
        <span>{login.loading ? 'Đang kiểm tra...' : 'Xác nhận & Đăng nhập'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={login.backToPassword}
        className="w-full flex items-center justify-center space-x-2 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Quay lại nhập mật khẩu</span>
      </button>
    </form>
  );
}
