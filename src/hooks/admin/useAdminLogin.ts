'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LoginStep } from '@/types/auth';
import { postAuth } from '@/lib/api';
import { sanitizeOtp } from '@/lib/format';

/** Two-step admin login: password first, then a Google Authenticator code when 2FA is on. */
export function useAdminLogin() {
  const [step, setStep] = useState<LoginStep>('password');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // STEP 1: VERIFY PASSWORD
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await postAuth({ password });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.require2FA) {
          // Switch to Step 2: 2FA Verification
          setStep('2fa');
          setError('');
          setTwoFactorCode('');
        } else {
          // Direct login success
          router.push('/admin');
          router.refresh();
        }
      } else {
        setError(data.error || 'Mật khẩu không hợp lệ');
      }
    } catch (err) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: VERIFY 2FA CODE (Google Authenticator)
  const submit2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await postAuth({
        action: 'verify_2fa_login',
        code: twoFactorCode.trim(),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Mã xác thực không đúng hoặc đã hết hạn.');
      }
    } catch (err) {
      setError('Đã có lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const backToPassword = () => {
    setStep('password');
    setError('');
  };

  return {
    step,
    password,
    showPassword,
    twoFactorCode,
    error,
    loading,
    setPassword,
    toggleShowPassword: () => setShowPassword(!showPassword),
    changeTwoFactorCode: (value: string) => setTwoFactorCode(sanitizeOtp(value)),
    submitPassword,
    submit2FA,
    backToPassword,
  };
}

export type AdminLoginState = ReturnType<typeof useAdminLogin>;
