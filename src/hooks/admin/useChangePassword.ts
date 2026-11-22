'use client';

import React, { useState } from 'react';
import type { StatusMessage } from '@/types/admin';
import { postAuth } from '@/lib/api';

/** Change-password form state, show/hide toggles and submit handler. */
export function useChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<StatusMessage | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMessage(null);

    if (newPassword !== confirmPassword) {
      setPassMessage({ text: 'Mật khẩu xác nhận không trùng khớp!', type: 'error' });
      return;
    }

    if (newPassword.trim().length < 6) {
      setPassMessage({ text: 'Mật khẩu mới phải có ít nhất 6 ký tự!', type: 'error' });
      return;
    }

    setPassLoading(true);

    try {
      const res = await postAuth({
        action: 'change_password',
        oldPassword,
        newPassword: newPassword.trim(),
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setPassMessage({ text: 'Đổi mật khẩu thành công! Hãy lưu lại mật khẩu mới.', type: 'success' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassMessage({ text: resData.error || 'Đổi mật khẩu thất bại', type: 'error' });
      }
    } catch (err) {
      setPassMessage({ text: 'Không thể kết nối đến máy chủ', type: 'error' });
    } finally {
      setPassLoading(false);
    }
  };

  return {
    oldPassword,
    newPassword,
    confirmPassword,
    showOldPass,
    showNewPass,
    showConfirmPass,
    passLoading,
    passMessage,
    setOldPassword,
    setNewPassword,
    setConfirmPassword,
    toggleOldPass: () => setShowOldPass(!showOldPass),
    toggleNewPass: () => setShowNewPass(!showNewPass),
    toggleConfirmPass: () => setShowConfirmPass(!showConfirmPass),
    submit,
  };
}

export type ChangePasswordState = ReturnType<typeof useChangePassword>;
