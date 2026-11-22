import { Smartphone, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';
import StatusAlert from './StatusAlert';
import TwoFactorActiveCard from './TwoFactorActiveCard';
import TwoFactorIntroCard from './TwoFactorIntroCard';
import TwoFactorSetupWizard from './TwoFactorSetupWizard';

interface TwoFactorSectionProps {
  tf: TwoFactorState;
}

/** SECTION 1: 2FA GOOGLE AUTHENTICATOR */
export default function TwoFactorSection({ tf }: TwoFactorSectionProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 pb-4 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-[#f1f505]" />
            <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
              Xác thực 2 lớp (Google Authenticator)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Bảo vệ tài khoản bằng mã bảo mật 6 số từ Google Authenticator hoặc ứng dụng TOTP tương thích.
          </p>
        </div>

        {/* Status Badge */}
        <div>
          {tf.is2FAEnabled ? (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Đang kích hoạt (Active)</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 text-neutral-500" />
              <span>Chưa kích hoạt</span>
            </span>
          )}
        </div>
      </div>

      {tf.twoFactorMessage && <StatusAlert message={tf.twoFactorMessage} />}

      {/* If 2FA is active */}
      {tf.is2FAEnabled && <TwoFactorActiveCard tf={tf} />}

      {/* If 2FA is NOT active and NOT in setup mode */}
      {!tf.is2FAEnabled && !tf.isSettingUp2FA && <TwoFactorIntroCard tf={tf} />}

      {/* 2FA SETUP WIZARD (QR CODE + VERIFICATION) */}
      {!tf.is2FAEnabled && tf.isSettingUp2FA && <TwoFactorSetupWizard tf={tf} />}
    </div>
  );
}
