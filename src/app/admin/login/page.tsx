'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Smartphone, ArrowLeft, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const [step, setStep] = useState<'password' | '2fa'>('password');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // STEP 1: VERIFY PASSWORD
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

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
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_2fa_login',
          code: twoFactorCode.trim(),
        }),
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

        {error && (
          <div className="mt-6 p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        {/* STEP 1: PASSWORD FORM */}
        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">
                Mật khẩu quản trị
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu quản trị..."
                  required
                  autoFocus
                  className="w-full bg-[#141414] border border-neutral-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#f1f505] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors focus:outline-none"
                  title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#f1f505] text-black font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#e0e404] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
            >
              <span>{loading ? 'Đang xác thực...' : 'Đăng nhập'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: 2FA CODE FORM */}
        {step === '2fa' && (
          <form onSubmit={handle2FASubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2 text-center">
                Mã xác thực Google Authenticator
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setTwoFactorCode(val);
                  }}
                  placeholder="000000"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  autoFocus
                  className="w-full bg-[#141414] border border-neutral-700 rounded-xl px-4 py-3.5 text-center text-xl font-mono tracking-[0.5em] text-[#f1f505] focus:outline-none focus:border-[#f1f505] transition-colors placeholder:text-neutral-700"
                />
              </div>
              <p className="text-[11px] text-neutral-500 text-center mt-2">
                Mã 6 chữ số thay đổi mỗi 30 giây trong ứng dụng xác thực
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || twoFactorCode.length !== 6}
              className="w-full bg-[#f1f505] text-black font-semibold py-3 px-4 rounded-xl text-xs uppercase tracking-widest hover:bg-[#e0e404] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
            >
              <span>{loading ? 'Đang kiểm tra...' : 'Xác nhận & Đăng nhập'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setStep('password');
                setError('');
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại nhập mật khẩu</span>
            </button>
          </form>
        )}

        {/* Footer */}
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
