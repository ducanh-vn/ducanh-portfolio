import { ShieldCheck } from 'lucide-react';
import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';

interface TwoFactorActiveCardProps {
  tf: TwoFactorState;
}

/** Shown while 2FA is on: explains the protection and offers the inline disable form. */
export default function TwoFactorActiveCard({ tf }: TwoFactorActiveCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">
            Tài khoản của bạn đang được bảo vệ an toàn với 2FA
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Mỗi lần đăng nhập vào Admin Studio, bạn sẽ cần nhập mật khẩu quản trị và mã xác thực 6 chữ số từ ứng dụng Google Authenticator.
          </p>
        </div>
      </div>

      {!tf.showDisableModal ? (
        <button
          type="button"
          onClick={tf.openDisable}
          className="px-4 py-2 bg-neutral-900 border border-red-500/30 text-red-400 text-xs rounded-xl hover:bg-red-950/30 transition-colors"
        >
          Tắt xác thực 2 lớp (Disable 2FA)
        </button>
      ) : (
        <form onSubmit={tf.disable} className="pt-4 border-t border-neutral-800 space-y-3 max-w-md">
          <p className="text-xs text-neutral-300 font-medium">
            Nhập mật khẩu quản trị để xác nhận tắt 2FA:
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="password"
              value={tf.disablePassword}
              onChange={(e) => tf.setDisablePassword(e.target.value)}
              placeholder="Mật khẩu hiện tại"
              required
              className="flex-1 bg-[#111] border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white"
            />
            <button
              type="submit"
              disabled={tf.twoFactorLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {tf.twoFactorLoading ? 'Đang xử lý...' : 'Xác nhận tắt'}
            </button>
            <button
              type="button"
              onClick={tf.cancelDisable}
              className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
            >
              Huỷ
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
