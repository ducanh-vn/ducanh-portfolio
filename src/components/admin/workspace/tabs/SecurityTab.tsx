import type { TwoFactorState } from '@/hooks/admin/useTwoFactor';
import type { ChangePasswordState } from '@/hooks/admin/useChangePassword';
import TwoFactorSection from '../security/TwoFactorSection';
import ChangePasswordForm from '../security/ChangePasswordForm';

interface SecurityTabProps {
  twoFactor: TwoFactorState;
  password: ChangePasswordState;
}

/** TAB 6: SECURITY & 2FA */
export default function SecurityTab({ twoFactor, password }: SecurityTabProps) {
  return (
    <div className="space-y-10">
      <TwoFactorSection tf={twoFactor} />
      <ChangePasswordForm pw={password} />
    </div>
  );
}
