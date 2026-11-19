'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  FolderGit2,
  Clock,
  Wrench,
  Save,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Sparkles,
  Printer,
  LayoutTemplate,
  Palette,
} from 'lucide-react';
import { PortfolioData, ProjectItem, TimelineItem } from '@/lib/data';

interface AdminDashboardProps {
  initialData: PortfolioData;
}

export default function AdminDashboardClient({ initialData }: AdminDashboardProps) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'timeline' | 'skills' | 'cv' | 'security'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [newSkill, setNewSkill] = useState('');

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMessage, setPassMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 2FA State (Google Authenticator)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [showDisableModal, setShowDisableModal] = useState(false);

  const router = useRouter();

  // Load 2FA status
  useEffect(() => {
    fetch('/api/auth')
      .then((res) => res.json())
      .then((auth) => {
        if (typeof auth.twoFactorEnabled === 'boolean') {
          setIs2FAEnabled(auth.twoFactorEnabled);
        }
      })
      .catch((err) => console.error('Error fetching 2FA status:', err));
  }, []);

  // 2FA Handlers
  const handleStart2FASetup = async () => {
    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup_2fa' }),
      });

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

  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setTwoFactorMessage({ text: 'Vui lòng nhập đủ 6 chữ số từ Google Authenticator', type: 'error' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_enable_2fa',
          code: verificationCode.trim(),
        }),
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

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) {
      setTwoFactorMessage({ text: 'Vui lòng nhập mật khẩu hiện tại để tắt 2FA', type: 'error' });
      return;
    }

    setTwoFactorLoading(true);
    setTwoFactorMessage(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'disable_2fa',
          password: disablePassword,
        }),
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

  const handleCopySecret = () => {
    if (twoFactorSecret) {
      navigator.clipboard.writeText(twoFactorSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (e: React.FormEvent) => {
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
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_password',
          oldPassword,
          newPassword: newPassword.trim(),
        }),
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

  // Save changes to API
  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ text: 'Đã lưu mọi thay đổi thành công!', type: 'success' });
        router.refresh();
      } else {
        setMessage({ text: 'Lỗi khi lưu dữ liệu. Vui lòng kiểm tra lại.', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Không thể kết nối đến máy chủ.', type: 'error' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    router.push('/admin/login');
    router.refresh();
  };

  // Project Handlers
  const handleAddProject = () => {
    const newProj: ProjectItem = {
      id: `project-${Date.now()}`,
      num: `0${data.projects.length + 1}`,
      title: 'Dự án mới',
      category: 'Web App',
      year: new Date().getFullYear().toString(),
      desc: 'Mô tả ngắn gọn về tính năng và công nghệ sử dụng trong dự án...',
      badges: ['TypeScript', 'React'],
      liveDemo: '',
      github: '',
      features: [
        { title: 'Tính năng chính 1', detail: 'Chi tiết tính năng và hiệu năng...' },
      ],
    };
    setData({ ...data, projects: [...data.projects, newProj] });
  };

  const handleDeleteProject = (id: string) => {
    setData({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, val: any) => {
    const updated = [...data.projects];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, projects: updated });
  };

  // Timeline Handlers
  const handleAddTimeline = () => {
    const newItem: TimelineItem = {
      id: `timeline-${Date.now()}`,
      period: '2024 — HIỆN TẠI',
      role: 'Vị trí công việc / Học vấn',
      desc: 'Mô tả chi tiết các trách nhiệm và thành tựu đạt được...',
    };
    setData({ ...data, timeline: [newItem, ...data.timeline] });
  };

  const handleDeleteTimeline = (id: string) => {
    setData({
      ...data,
      timeline: data.timeline.filter((t) => t.id !== id),
    });
  };

  const handleUpdateTimeline = (index: number, field: keyof TimelineItem, val: string) => {
    const updated = [...data.timeline];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, timeline: updated });
  };

  // Skill Handlers
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!data.skills.includes(newSkill.trim())) {
      setData({ ...data, skills: [...data.skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setData({
      ...data,
      skills: data.skills.filter((s) => s !== skillToDelete),
    });
  };

  return (
    <div className="min-h-screen bg-[#111111] text-neutral-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#161616]/90 backdrop-blur-md border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center font-serif text-lg font-bold text-[#f1f505]">
            DA
          </div>
          <div>
            <h1 className="font-serif text-lg uppercase tracking-wider text-white">
              Portfolio Admin Studio
            </h1>
            <p className="text-[11px] text-neutral-400 font-sans">
              Hệ thống quản trị hồ sơ cá nhân
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {message && (
            <div
              className={`flex items-center space-x-2 text-xs px-3.5 py-1.5 rounded-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/60 border-red-500/50 text-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <a
            href="/"
            target="_blank"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs tracking-wider"
          >
            <span>Xem trang chủ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-neutral-400 hover:text-red-400 rounded-xl hover:bg-neutral-900 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <aside className="md:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <User className="w-4 h-4 text-[#f1f505]" />
            <span>Hồ sơ & Giới thiệu</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <FolderGit2 className="w-4 h-4 text-[#f1f505]" />
            <span>Dự án tiêu biểu ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'timeline'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-[#f1f505]" />
            <span>Dòng thời gian ({data.timeline.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'skills'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#f1f505]" />
            <span>Kỹ năng & Stack ({data.skills.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cv')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'cv'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-[#f1f505]" />
            <span>Công cụ tạo CV (Studio)</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
              activeTab === 'security'
                ? 'bg-[#1e1e1e] border border-[#f1f505] text-white'
                : 'text-neutral-400 hover:bg-[#181818] hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-[#f1f505]" />
            <span>Bảo mật & 2FA</span>
          </button>
        </aside>

        {/* Right Content Editor */}
        <main className="md:col-span-9 bg-[#171717] border border-neutral-800 rounded-2xl p-8 shadow-xl">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl uppercase tracking-wider text-white border-b border-neutral-800 pb-4">
                Hồ sơ cá nhân
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={data.profile.name}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, name: e.target.value } })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Tiêu đề nghề nghiệp
                  </label>
                  <input
                    type="text"
                    value={data.profile.role}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, role: e.target.value } })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={data.profile.email}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, email: e.target.value } })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Trạng thái sẵn sàng
                  </label>
                  <input
                    type="text"
                    value={data.profile.status}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, status: e.target.value },
                      })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Link GitHub
                  </label>
                  <input
                    type="text"
                    value={data.profile.github}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, github: e.target.value },
                      })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                    Link LinkedIn
                  </label>
                  <input
                    type="text"
                    value={data.profile.linkedin}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, linkedin: e.target.value },
                      })
                    }
                    className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Headline triết lý phát triển
                </label>
                <input
                  type="text"
                  value={data.profile.tagline}
                  onChange={(e) =>
                    setData({ ...data, profile: { ...data.profile, tagline: e.target.value } })
                  }
                  className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Giới thiệu bản thân (Bio)
                </label>
                <textarea
                  rows={4}
                  value={data.profile.bio}
                  onChange={(e) =>
                    setData({ ...data, profile: { ...data.profile, bio: e.target.value } })
                  }
                  className="w-full bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                    Dự án tiêu biểu
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Quản lý danh sách các dự án hiển thị trong Drawer và Gallery.
                  </p>
                </div>
                <button
                  onClick={handleAddProject}
                  className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs uppercase tracking-wider text-[#f1f505] transition-colors border border-neutral-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm dự án</span>
                </button>
              </div>

              <div className="space-y-6">
                {data.projects.map((proj, idx) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#f1f505] tracking-widest font-bold">
                        {proj.num} — {proj.title}
                      </span>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-neutral-500 hover:text-red-400 rounded-lg transition-colors"
                        title="Xoá dự án"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Tên dự án
                        </label>
                        <input
                          type="text"
                          value={proj.title}
                          onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Phân loại (Category)
                        </label>
                        <input
                          type="text"
                          value={proj.category}
                          onChange={(e) => handleUpdateProject(idx, 'category', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Năm thực hiện
                        </label>
                        <input
                          type="text"
                          value={proj.year}
                          onChange={(e) => handleUpdateProject(idx, 'year', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                        Mô tả dự án
                      </label>
                      <textarea
                        rows={2}
                        value={proj.desc}
                        onChange={(e) => handleUpdateProject(idx, 'desc', e.target.value)}
                        className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          GitHub Repo URL
                        </label>
                        <input
                          type="text"
                          value={proj.github}
                          onChange={(e) => handleUpdateProject(idx, 'github', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Live Demo URL
                        </label>
                        <input
                          type="text"
                          value={proj.liveDemo}
                          onChange={(e) => handleUpdateProject(idx, 'liveDemo', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                  <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                    Dòng thời gian & Kinh nghiệm
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Cập nhật các cột mốc kinh nghiệm và học vấn.
                  </p>
                </div>
                <button
                  onClick={handleAddTimeline}
                  className="flex items-center space-x-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs uppercase tracking-wider text-[#f1f505] transition-colors border border-neutral-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm cột mốc</span>
                </button>
              </div>

              <div className="space-y-4">
                {data.timeline.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-[#f1f505] font-semibold">
                        Cột mốc #{idx + 1}
                      </span>
                      <button
                        onClick={() => handleDeleteTimeline(item.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Thời gian (Giai đoạn)
                        </label>
                        <input
                          type="text"
                          value={item.period}
                          onChange={(e) => handleUpdateTimeline(idx, 'period', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                          Chức danh / Vai trò
                        </label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => handleUpdateTimeline(idx, 'role', e.target.value)}
                          className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase text-neutral-400 mb-1">
                        Chi tiết công việc / Thành tích
                      </label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => handleUpdateTimeline(idx, 'desc', e.target.value)}
                        className="w-full bg-[#111] border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-800 pb-4">
                <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                  Kỹ năng & Công nghệ
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Quản lý danh sách các badge kỹ năng hiển thị trong profile.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Nhập tên kỹ năng mới (ví dụ: Docker, Next.js, GraphQL)..."
                  className="flex-1 bg-[#121212] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-5 py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-colors"
                >
                  Thêm
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-4">
                {data.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center space-x-2 px-3.5 py-2 bg-[#121212] border border-neutral-800 rounded-xl text-xs text-neutral-200 group"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CV BUILDER STUDIO */}
          {activeTab === 'cv' && (
            <div className="space-y-8">
              <div className="border-b border-neutral-800 pb-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#f1f505]" />
                    <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                      Bộ Tạo & Xuất CV (CV Studio)
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Công cụ tạo hồ sơ xin việc chuyên nghiệp, đồng bộ dữ liệu tự động và xuất file PDF chuẩn A4.
                  </p>
                </div>

                <a
                  href="/cv"
                  target="_blank"
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Mở Trình Tạo CV Trực Quan</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>

              {/* Quick Config Card */}
              <div className="p-6 rounded-2xl bg-[#141414] border border-neutral-800 space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#f1f505]" />
                  <span>Cấu hình nút "DOWNLOAD CV" trên Portfolio</span>
                </h4>
                <p className="text-xs text-neutral-400">
                  Đường dẫn khi khách truy cập bấm vào nút <strong>DOWNLOAD CV</strong> tại trang chủ portfolio của bạn:
                </p>

                <div className="max-w-md space-y-2">
                  <label className="block text-[11px] font-mono uppercase text-neutral-400">
                    Đường dẫn CV (Mặc định: /cv)
                  </label>
                  <input
                    type="text"
                    value={data.profile.cvUrl}
                    onChange={(e) =>
                      setData({ ...data, profile: { ...data.profile, cvUrl: e.target.value } })
                    }
                    placeholder="/cv hoặc link PDF Drive..."
                    className="w-full bg-[#111] border border-neutral-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#f1f505]"
                  />
                  <p className="text-[11px] text-neutral-500">
                    Mẹo: Để nguyên <code className="text-[#f1f505]">/cv</code> để người xem mở thẳng trình xem CV trực quan và in file PDF bất kỳ lúc nào.
                  </p>
                </div>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
                    <LayoutTemplate className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">3 Mẫu Thiết Kế</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Hỗ trợ chuyển đổi nhanh giữa <strong>Hiện đại (2 cột)</strong>, <strong>Chuẩn ATS (1 cột)</strong> và <strong>Editorial Luxury</strong>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
                    <Palette className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Tuỳ biến Màu Sắc</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Chọn màu điểm nhấn (Vàng Neon, Xanh Dương, Xanh Ngọc, Slate Tối giản, Đỏ Hồng) và bật/tắt ảnh thẻ dễ dàng.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#141414] border border-neutral-800 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-700 flex items-center justify-center text-[#f1f505]">
                    <Printer className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Xuất PDF Chuẩn A4</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Định dạng in ấn chuyên nghiệp, tự động loại bỏ thanh công cụ và định dạng vừa vặn trang giấy A4 mà không bị vỡ bố cục.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & 2FA */}
          {activeTab === 'security' && (
            <div className="space-y-10">
              {/* SECTION 1: 2FA GOOGLE AUTHENTICATOR */}
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
                    {is2FAEnabled ? (
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

                {twoFactorMessage && (
                  <div
                    className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                      twoFactorMessage.type === 'success'
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/50 border-red-500/50 text-red-200'
                    }`}
                  >
                    {twoFactorMessage.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span>{twoFactorMessage.text}</span>
                  </div>
                )}

                {/* If 2FA is active */}
                {is2FAEnabled && (
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

                    {!showDisableModal ? (
                      <button
                        type="button"
                        onClick={() => setShowDisableModal(true)}
                        className="px-4 py-2 bg-neutral-900 border border-red-500/30 text-red-400 text-xs rounded-xl hover:bg-red-950/30 transition-colors"
                      >
                        Tắt xác thực 2 lớp (Disable 2FA)
                      </button>
                    ) : (
                      <form onSubmit={handleDisable2FA} className="pt-4 border-t border-neutral-800 space-y-3 max-w-md">
                        <p className="text-xs text-neutral-300 font-medium">
                          Nhập mật khẩu quản trị để xác nhận tắt 2FA:
                        </p>
                        <div className="flex items-center space-x-2">
                          <input
                            type="password"
                            value={disablePassword}
                            onChange={(e) => setDisablePassword(e.target.value)}
                            placeholder="Mật khẩu hiện tại"
                            required
                            className="flex-1 bg-[#111] border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white"
                          />
                          <button
                            type="submit"
                            disabled={twoFactorLoading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {twoFactorLoading ? 'Đang xử lý...' : 'Xác nhận tắt'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowDisableModal(false);
                              setDisablePassword('');
                            }}
                            className="px-3 py-2 text-xs text-neutral-400 hover:text-white"
                          >
                            Huỷ
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {/* If 2FA is NOT active and NOT in setup mode */}
                {!is2FAEnabled && !isSettingUp2FA && (
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
                      onClick={handleStart2FASetup}
                      disabled={twoFactorLoading}
                      className="px-5 py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-all flex items-center space-x-2 shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{twoFactorLoading ? 'Đang tạo mã...' : 'Kích hoạt xác thực 2 lớp ngay'}</span>
                    </button>
                  </div>
                )}

                {/* 2FA SETUP WIZARD (QR CODE + VERIFICATION) */}
                {!is2FAEnabled && isSettingUp2FA && (
                  <div className="p-6 rounded-2xl bg-[#141414] border border-[#f1f505]/40 space-y-6">
                    <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                        <Smartphone className="w-4 h-4 text-[#f1f505]" />
                        <span>Thiết lập Google Authenticator</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSettingUp2FA(false);
                          setQrCodeUrl(null);
                        }}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        Huỷ bỏ
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      {/* Step 1: QR Code */}
                      <div className="md:col-span-5 flex flex-col items-center p-4 bg-white rounded-2xl">
                        {qrCodeUrl ? (
                          <img
                            src={qrCodeUrl}
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
                              {twoFactorSecret}
                            </span>
                            <button
                              type="button"
                              onClick={handleCopySecret}
                              className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                              title="Sao chép"
                            >
                              {copiedSecret ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <form onSubmit={handleConfirm2FA} className="pt-2 space-y-3">
                          <div>
                            <p className="text-xs text-neutral-300 font-semibold mb-1">
                              Bước 2: Nhập mã 6 chữ số từ ứng dụng để kích hoạt
                            </p>
                            <input
                              type="text"
                              value={verificationCode}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setVerificationCode(val);
                              }}
                              placeholder="000000"
                              required
                              maxLength={6}
                              inputMode="numeric"
                              className="w-full bg-[#101010] border border-neutral-700 rounded-xl px-4 py-2.5 text-center text-lg font-mono tracking-[0.4em] text-[#f1f505] focus:outline-none focus:border-[#f1f505]"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={twoFactorLoading || verificationCode.length !== 6}
                            className="w-full py-2.5 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-wider rounded-xl hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50"
                          >
                            {twoFactorLoading ? 'Đang xác thực...' : 'Xác nhận & Kích hoạt 2FA'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 2: CHANGE PASSWORD */}
              <div className="space-y-6 pt-6 border-t border-neutral-800">
                <div className="border-b border-neutral-800 pb-4">
                  <div className="flex items-center space-x-2">
                    <KeyRound className="w-5 h-5 text-[#f1f505]" />
                    <h2 className="font-serif text-2xl uppercase tracking-wider text-white">
                      Đổi Mật khẩu Quản trị
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1">
                    Cập nhật mật khẩu chính cho tài khoản Admin Studio.
                  </p>
                </div>

                {passMessage && (
                  <div
                    className={`p-4 rounded-xl border flex items-center space-x-3 text-xs ${
                      passMessage.type === 'success'
                        ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
                        : 'bg-red-950/50 border-red-500/50 text-red-200'
                    }`}
                  >
                    {passMessage.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                    )}
                    <span>{passMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showOldPass ? 'text' : 'password'}
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu hiện tại"
                        required
                        className="w-full bg-[#121212] border border-neutral-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPass(!showOldPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors"
                        title={showOldPass ? 'Ẩn' : 'Hiện'}
                      >
                        {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Mật khẩu mới (tối thiểu 6 ký tự)
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPass ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        required
                        minLength={6}
                        className="w-full bg-[#121212] border border-neutral-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPass(!showNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors"
                        title={showNewPass ? 'Ẩn' : 'Hiện'}
                      >
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPass ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        required
                        minLength={6}
                        className="w-full bg-[#121212] border border-neutral-700 rounded-xl pl-4 pr-12 py-2.5 text-sm text-white focus:outline-none focus:border-[#f1f505]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#f1f505] p-1.5 transition-colors"
                        title={showConfirmPass ? 'Ẩn' : 'Hiện'}
                      >
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passLoading}
                    className="px-6 py-3 bg-[#f1f505] text-black font-semibold text-xs uppercase tracking-widest rounded-xl hover:bg-[#e0e404] transition-all shadow-lg shadow-[#f1f505]/10 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{passLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
