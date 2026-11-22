import { Smartphone, Copy, Check } from 'lucide-react';
import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';

interface TwoFactorSetupWizardProps {
  tf: TwoFactorState;
}

/** 2FA SETUP WIZARD (QR CODE + VERIFICATION) */
export default function TwoFactorSetupWizard({ tf }: TwoFactorSetupWizardProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#141414] border border-[#f1f505]/40 space-y-6">
      <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
          <Smartphone className="w-4 h-4 text-[#f1f505]" />
          <span>Thiết lập Google Authenticator</span>
        </h4>
        <button
          type="button"
          onClick={tf.cancelSetup}
          className="text-xs text-neutral-400 hover:text-white"
        >
          Huỷ bỏ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Step 1: QR Code */}
        <div className="md:col-span-5 flex flex-col items-center p-4 bg-white rounded-2xl">
          {tf.qrCodeUrl ? (
            <img
              src={tf.qrCodeUrl}
              alt="Google Authenticator QR Code"
              className="w-48 h-48 rounded-lg"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-black text-xs">
              Đang tạo mã QR...
            </div>
          )}
          <p className="text-[11px] text-neutral-800 text-center font-medium mt-2">
            Mở Google Authenticator và quét mã này
          </p>
        </div>

        {/* Step 2: Secret & Confirm */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <p className="text-xs text-neutral-300 font-semibold mb-1">
              Bước 1: Quét mã QR hoặc nhập khoá bí mật thủ công
            </p>
            <p className="text-[11px] text-neutral-400">
              Nếu không thể dùng camera, bạn có thể nhập khoá này vào app:
            </p>
            <div className="mt-2 flex items-center space-x-2 bg-[#101010] p-2.5 rounded-xl border border-neutral-700">
              <span className="font-mono text-xs text-[#f1f505] tracking-wider flex-1 select-all break-all">
                {tf.twoFactorSecret}
              </span>
              <button
                type="button"
                onClick={tf.copySecret}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                title="Sao chép"
              >
                {tf.copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <form onSubmit={tf.confirm} className="pt-2 space-y-3">
            <div>
              <p className="text-xs text-neutral-300 font-semibold mb-1">
                Bước 2: Nhập mã 6 chữ số từ ứng dụng để kích hoạt
              </p>
              <input
                type="text"
                value={tf.verificationCode}
                onChange={(e) => tf.changeVerificationCode(e.target.value)}
                placeholder="000000"
                required
                maxLength={6}
                inputMode="numeric"
                className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-[#f1f505] focus:outline-none focus:border-[#f1f505]"
              />
            </div>

            <button
              type="submit"
              disabled={tf.twoFactorLoading || tf.verificationCode.length !== 6}
              className="w-full py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
            >
              {tf.twoFactorLoading ? 'Đang xác thực...' : 'Xác nhận & Kích hoạt 2FA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
