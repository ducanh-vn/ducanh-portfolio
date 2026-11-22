'use client';

import React, { useEffect, useState } from 'react';
import type { StatusMessage } from '@/types/admin';
import { COPY_FEEDBACK_MS } from '@/constants/admin';
import { getAuthStatus, postAuth } from '@/lib/api';
import { sanitizeOtp } from '@/lib/format';

/** 2FA (Google Authenticator) status, setup wizard, confirm and disable flows. */
export function useTwoFactor() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState<StatusMessage | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);

  // Load 2FA status
  useEffect(() => {
    getAuthStatus()
      .then((res) => res.json())
      .then((auth) => {
        if (typeof auth.twoFactorEnabled === 'boolean') {
          setIs2FAEnabled(auth.twoFactorEnabled);
        }
      })
      .catch((err) => console.error('Error fetching 2FA status:', err));
  }, []);

  const startSetup = async () => {
    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await postAuth({ action: 'setup_2fa' });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setQrCodeUrl(resData.qrCodeUrl);
        setTwoFactorSecret(resData.secret);
        setIsSettingUp2FA(true);
        setVerificationCode('');
      } else {
        setTwoFactorMessage({ text: resData.error || 'Không thể tạo mã xác thực', type: 'error' });
      }
    } catch (err) {
      setTwoFactorMessage({ text: 'Lỗi kết nối khi khởi tạo 2FA', type: 'error' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const cancelSetup = () => {
    setIsSettingUp2FA(false);
    setQrCodeUrl(null);
  };

  const confirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ text: 'Vui lòng nhập đủ 6 chữ số từ Google Authenticator', type: 'error' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await postAuth({
        action: 'verify_enable_2fa',
        code: verificationCode.trim(),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setIs2FAEnabled(true);
        setIsSettingUp2FA(false);
        setQrCodeUrl(null);
        setTwoFactorSecret(null);
        setVerificationCode('');
        setTwoFactorMessage({
          text: 'Kích hoạt xác thực 2 lớp (Google Authenticator) thành công!',
          type: 'success',
        });
      } else {
        setTwoFactorMessage({
          text: resData.error || 'Mã xác thực không hợp lệ. Vui lòng thử lại.',
          type: 'error',
        });
      }
    } catch (err) {
      setTwoFactorMessage({ text: 'Lỗi kết nối máy chủ', type: 'error' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const disable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) {
      setTwoFactorMessage({ text: 'Vui lòng nhập mật khẩu hiện tại để tắt 2FA', type: 'error' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await postAuth({
        action: 'disable_2fa',
        password: disablePassword,
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        setIs2FAEnabled(false);
        setShowDisableModal(false);
        setDisablePassword('');
        setTwoFactorMessage({ text: 'Đã tắt xác thực 2 lớp thành công.', type: 'success' });
      } else {
        setTwoFactorMessage({ text: resData.error || 'Không thể tắt 2FA', type: 'error' });
      }
    } catch (err) {
      setTwoFactorMessage({ text: 'Lỗi kết nối máy chủ', type: 'error' });
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const openDisable = () => setShowDisableModal(true);

  const cancelDisable = () => {
    setShowDisableModal(false);
    setDisablePassword('');
  };

  const copySecret = () => {
    if (twoFactorSecret) {
      navigator.clipboard.writeText(twoFactorSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), COPY_FEEDBACK_MS);
    }
  };

  const changeVerificationCode = (value: string) => setVerificationCode(sanitizeOtp(value));

  return {
    is2FAEnabled,
    isSettingUp2FA,
    qrCodeUrl,
    twoFactorSecret,
    verificationCode,
    twoFactorLoading,
    twoFactorMessage,
    copiedSecret,
    disablePassword,
    showDisableModal,
    setDisablePassword,
    changeVerificationCode,
    startSetup,
    cancelSetup,
    confirm,
    disable,
    openDisable,
    cancelDisable,
    copySecret,
  };
}

export type TwoFactorState = ReturnType<typeof useTwoFactor>;
