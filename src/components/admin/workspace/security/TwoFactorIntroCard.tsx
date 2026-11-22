import { QrCode, Smartphone } from 'lucide-react';
import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';

interface TwoFactorIntroCardProps {
  tf: TwoFactorState;
}

/** Shown while 2FA is off and no setup is running: explains 2FA and starts setup. */
export default function TwoFactorIntroCard({ tf }: TwoFactorIntroCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505] flex-shrink-0">
          <QrCode className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white">
            Tăng cường bảo mật với Google Authenticator
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Khi kích hoạt, bạn sẽ quét mã QR bằng ứng dụng Google Authenticator (hoặc Authy) trên điện thoại. Tài khoản sẽ được bảo vệ tuyệt đối ngay cả khi mật khẩu bị lộ.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={tf.startSetup}
        disabled={tf.twoFactorLoading}
        className="px-5 py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-all flex items-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
      >
        <Smartphone className="w-4 h-4" />
        <span>{tf.twoFactorLoading ? 'Đang tạo mã...' : 'Kích hoạt xác thực 2 lớp ngay'}</span>
      </button>
    </div>
  );
}
