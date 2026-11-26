'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Hash,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { AuthUser } from '@/types/auth';
import { authService } from '@/services/authService';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // State cho Tab Hồ sơ
  const [name, setName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // State cho Tab Đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Lấy dữ liệu user khi mở modal
  useEffect(() => {
    if (isOpen) {
      const user = authService.getCurrentUser();
      setCurrentUser(user);
      setName(user?.name || '');
      setProfileMessage(null);
      setPasswordMessage(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setActiveTab('profile');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Lấy 2 chữ cái đại diện cho avatar
  const getAvatarInitials = (userName?: string) => {
    if (!userName) return 'QL';
    const words = userName.trim().split(' ');
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[words.length - 2][0] + words[words.length - 1][0]).toUpperCase();
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  // Xử lý cập nhật thông tin cá nhân (họ tên)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMessage(null);

    if (!name.trim()) {
      setProfileMessage({ type: 'error', text: 'Vui lòng nhập họ và tên.' });
      return;
    }

    try {
      setIsUpdatingProfile(true);
      const res = await authService.updateProfile(name.trim());
      if (res.success) {
        setProfileMessage({ type: 'success', text: 'Cập nhật họ và tên thành công!' });
        const updated = authService.getCurrentUser();
        setCurrentUser(updated);
      } else {
        setProfileMessage({ type: 'error', text: res.message || 'Cập nhật thông tin thất bại.' });
      }
    } catch {
      setProfileMessage({ type: 'error', text: 'Đã xảy ra sự cố kết nối máy chủ.' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword) {
      setPasswordMessage({ type: 'error', text: 'Vui lòng nhập mật khẩu hiện tại.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu mới phải có tối thiểu 8 ký tự.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Mật khẩu xác nhận không trùng khớp.' });
      return;
    }

    try {
      setIsChangingPass(true);
      const res = await authService.changePassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu tài khoản thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: res.message || 'Đổi mật khẩu thất bại.' });
      }
    } catch {
      setPasswordMessage({ type: 'error', text: 'Đã xảy ra sự cố kết nối máy chủ.' });
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8E2813] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">Thông Tin Tài Khoản</h2>
              <p className="text-xs text-[#8A8175]">Quản lý hồ sơ cá nhân và bảo mật tài khoản</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Khung tóm tắt danh tính User (Profile Summary Card) */}
        <div className="p-6 bg-gradient-to-b from-[#FAF7F2] to-white border-b border-[#F0EAE1]">
          <div className="flex items-center gap-4">
            {/* Avatar tròn */}
            <div className="w-14 h-14 rounded-full bg-[#342A27] text-white flex items-center justify-center text-lg font-bold shadow-md ring-4 ring-[#FAF7F2] shrink-0">
              {getAvatarInitials(currentUser?.name)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-[#26201E] truncate">
                  {currentUser?.name || 'Nguyễn Văn An'}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8]">
                  {currentUser?.employeeCode || '#NV-01'}
                </span>
              </div>
              <p className="text-xs text-[#8A8175] truncate mt-0.5">
                {currentUser?.email || 'manager@casacozy.vn'}
              </p>

              {/* Badges quyền hạn & trạng thái */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8E2813] text-white shadow-2xs">
                    <ShieldCheck className="w-3 h-3 text-amber-300" />
                    <span>Quản trị viên (Toàn quyền)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBF3FF] text-[#1D4ED8] border border-[#BFDBFE]">
                    <Briefcase className="w-3 h-3 text-[#1D4ED8]" />
                    <span>Quản lý (Bàn & đơn hàng)</span>
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>Đang hoạt động</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Thanh chuyển đổi Tab */}
        <div className="px-6 pt-3 flex border-b border-[#F0EAE1] bg-white gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile'
                ? 'text-[#8E2813] border-b-2 border-[#8E2813]'
                : 'text-[#8A8175] hover:text-[#26201E]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Hồ sơ cá nhân</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('password')}
            className={`pb-3 text-xs font-bold transition-all relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'password'
                ? 'text-[#8E2813] border-b-2 border-[#8E2813]'
                : 'text-[#8A8175] hover:text-[#26201E]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Đổi mật khẩu</span>
          </button>
        </div>

        {/* Thân Modal */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: THÔNG TIN HỒ SƠ */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {profileMessage && (
                <div
                  className={`p-3 rounded-xl flex items-start gap-2 text-xs border ${
                    profileMessage.type === 'success'
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                      : 'bg-[#FDF2F0] border-[#F8D7DA] text-[#C23924]'
                  }`}
                >
                  {profileMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{profileMessage.text}</span>
                </div>
              )}

              {/* Mã nhân viên (Khóa) */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Mã nhân viên
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.employeeCode || '#NV-01'}
                    className="w-full pl-9 pr-24 py-2 bg-[#F5EFE6] border border-[#EAE3D6] rounded-xl text-xs font-bold text-[#8E2813] cursor-not-allowed select-none opacity-80"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8A8175] bg-white px-2 py-0.5 rounded-md border border-[#EAE3D6]">
                    Hệ thống cấp
                  </span>
                </div>
              </div>

              {/* Tài khoản đăng nhập (Khóa) */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Tài khoản đăng nhập / Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || 'manager@casacozy.vn'}
                    className="w-full pl-9 pr-24 py-2 bg-[#F5EFE6] border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#26201E] cursor-not-allowed select-none opacity-80"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8A8175] bg-white px-2 py-0.5 rounded-md border border-[#EAE3D6]">
                    Tên đăng nhập
                  </span>
                </div>
              </div>

              {/* Họ và tên (Cho phép sửa) */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Họ và tên <span className="text-[#C23924]">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên..."
                    className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Nút hành động */}
              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProfile || name.trim() === currentUser?.name}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isUpdatingProfile ? 'Đang lưu...' : 'Lưu thông tin'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ĐỔI MẬT KHẨU */}
          {activeTab === 'password' && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              {passwordMessage && (
                <div
                  className={`p-3 rounded-xl flex items-start gap-2 text-xs border ${
                    passwordMessage.type === 'success'
                      ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D]'
                      : 'bg-[#FDF2F0] border-[#F8D7DA] text-[#C23924]'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              {/* Mật khẩu hiện tại */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Mật khẩu hiện tại <span className="text-[#C23924]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu đang sử dụng"
                    className="w-full pl-9 pr-10 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8175] hover:text-[#26201E] cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Mật khẩu mới <span className="text-[#C23924]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full pl-9 pr-10 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8175] hover:text-[#26201E] cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-[#8A8175] mt-1">
                  Mật khẩu mới cần tối thiểu 8 ký tự để bảo đảm an toàn.
                </p>
              </div>

              {/* Nhập lại mật khẩu mới */}
              <div>
                <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
                  Xác nhận mật khẩu mới <span className="text-[#C23924]">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full pl-9 pr-10 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8175] hover:text-[#26201E] cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass || !currentPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isChangingPass ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
