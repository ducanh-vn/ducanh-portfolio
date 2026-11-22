'use client';

import React from 'react';
import { Lock, ShieldCheck, Smartphone } from 'lucide-react';
import { useAdminLogin } from '@/hooks/admin/useAdminLogin';
import PasswordStep from '@/components/admin/login/PasswordStep';
import TwoFactorStep from '@/components/admin/login/TwoFactorStep';

export default function AdminLoginPage() {
  const login = useAdminLogin();
  const { step } = login;

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-6 text-neutral-200">
      <div className="max-w-md w-full bg-[#1a1a1a] border border-neutral-800 rounded-2xl p-8 shadow-2xl transition-all">
        {/* Header Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#242424] border border-neutral-700 mx-auto mb-6 text-[#f1f505]">
          {step === 'password' ? <Lock className="w-6 h-6" /> : <Smartphone className="w-6 h-6" />}
        </div>

        <h1 className="text-2xl font-serif text-center uppercase tracking-wider text-white">
          {step === 'password' ? 'Admin CMS Portal' : 'Xác thực 2 lớp (2FA)'}
        </h1>
        <p className="text-xs text-neutral-400 text-center mt-2">
          {step === 'password'
            ? 'Đăng nhập để cập nhật hồ sơ, kỹ năng và dự án'
            : 'Mở ứng dụng Google Authenticator trên điện thoại để lấy mã xác thực 6 chữ số'}
        </p>

        {login.error && (
          <div className="mt-6 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-xs text-center">
            {login.error}
          </div>
        )}

        {step === 'password' && <PasswordStep login={login} />}
        {step === '2fa' && <TwoFactorStep login={login} />}

        <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#f1f505]" />
            <span>2FA Encrypted Session</span>
          </span>
          <a href="/" className="hover:text-white transition-colors">
            ← Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
