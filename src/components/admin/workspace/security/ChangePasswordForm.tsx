import { KeyRound } from 'lucide-react';
import type { ChangePasswordState } from '@/hooks/admin/useChangePassword';
import StatusAlert from './StatusAlert';
import PasswordField from './PasswordField';

interface ChangePasswordFormProps {
  pw: ChangePasswordState;
}

/** SECTION 2: CHANGE PASSWORD */
export default function ChangePasswordForm({ pw }: ChangePasswordFormProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-neutral-800">
      <div className="border-b border-neutral-800 pb-4">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-5 h-5 text-[#f1f505]" />
          <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
            Đổi Mật khẩu Quản trị
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mt-1">
          Cập nhật mật khẩu chính cho tài khoản Admin Studio.
        </p>
      </div>

      {pw.passMessage && <StatusAlert message={pw.passMessage} />}

      <form onSubmit={pw.submit} className="space-y-5 max-w-lg">
        <PasswordField
          label="Mật khẩu hiện tại"
          value={pw.oldPassword}
          onChange={pw.setOldPassword}
          placeholder="Nhập mật khẩu hiện tại"
          show={pw.showOldPass}
          onToggle={pw.toggleOldPass}
        />

        <PasswordField
          label="Mật khẩu mới (tối thiểu 6 ký tự)"
          value={pw.newPassword}
          onChange={pw.setNewPassword}
          placeholder="Nhập mật khẩu mới"
          minLength={6}
          show={pw.showNewPass}
          onToggle={pw.toggleNewPass}
        />

        <PasswordField
          label="Xác nhận mật khẩu mới"
          value={pw.confirmPassword}
          onChange={pw.setConfirmPassword}
          placeholder="Nhập lại mật khẩu mới"
          minLength={6}
          show={pw.showConfirmPass}
          onToggle={pw.toggleConfirmPass}
        />

        <button
          type="submit"
          disabled={pw.passLoading}
          className="px-6 py-3 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50 flex items-center space-x-2"
        >
          <KeyRound className="w-4 h-4" />
          <span>{pw.passLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
        </button>
      </form>
    </div>
  );
}
