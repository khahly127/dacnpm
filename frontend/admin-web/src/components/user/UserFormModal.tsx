'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, Briefcase, Lock, User, Mail, Phone, Hash, AlertCircle } from 'lucide-react';
import { UserItem, UserRole, CreateUserInput, UpdateUserInput } from '@/types/user';

interface UserFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: UserItem | null;
  onClose: () => void;
  onSubmit: (data: CreateUserInput | UpdateUserInput) => Promise<{ success: boolean; message?: string }>;
}

function UserFormContent({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Omit<UserFormModalProps, 'isOpen'>) {
  const [name, setName] = useState(mode === 'edit' && initialData ? initialData.name : '');
  const [email, setEmail] = useState(mode === 'edit' && initialData ? initialData.email : '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(mode === 'edit' && initialData ? initialData.role : 'MANAGER');
  const [phone, setPhone] = useState(mode === 'edit' && initialData ? initialData.phone || '' : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate
    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ và tên nhân viên.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập tài khoản / email đăng nhập.');
      return;
    }
    if (mode === 'create') {
      if (!password || password.length < 8) {
        setErrorMessage('Mật khẩu bắt buộc và phải có ít nhất 8 ký tự.');
        return;
      }
    } else {
      if (password && password.length < 8) {
        setErrorMessage('Mật khẩu mới nếu thay đổi phải có ít nhất 8 ký tự.');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const payload: CreateUserInput | UpdateUserInput = {
        name: name.trim(),
        email: email.trim(),
        role,
        phone: phone.trim() || undefined,
        ...(password.trim() ? { password: password.trim() } : {}),
      };

      const result = await onSubmit(payload);
      if (!result.success) {
        setErrorMessage(result.message || 'Thao tác không thành công.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra sự cố khi lưu thông tin. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Modal */}
      <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
        <div>
          <h2 className="text-base font-bold text-[#26201E]">
            {mode === 'create' ? 'Thêm Nhân Viên Mới' : 'Chỉnh Sửa Thông Tin Nhân Viên'}
          </h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            {mode === 'create'
              ? 'Nhập thông tin nhân sự để cấp tài khoản truy cập hệ thống Casa Cozy.'
              : 'Cập nhật thông tin tài khoản và vai trò nhân sự.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Khi Sửa: Hiển thị Mã nhân viên (Khóa - Không được sửa) */}
        {mode === 'edit' && initialData && (
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
              Mã nhân viên (Hệ thống cấp)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
              <input
                type="text"
                disabled
                value={initialData.code}
                className="w-full pl-9 pr-24 py-2 bg-[#F5EFE6] border border-[#EAE3D6] rounded-xl text-xs font-bold text-[#8E2813] cursor-not-allowed select-none opacity-80"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8A8175] bg-white px-2 py-0.5 rounded-md border border-[#EAE3D6]">
                Không thể sửa
              </span>
            </div>
          </div>
        )}

        {/* Họ và tên */}
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
              placeholder="Ví dụ: Lê Hoàng Long"
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Tài khoản / Email đăng nhập */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Tài khoản đăng nhập / Email <span className="text-[#C23924]">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ví dụ: long_chef hoặc chef.long@casacozy.vn"
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            {mode === 'create' ? (
              <>
                Mật khẩu khởi tạo <span className="text-[#C23924]">*</span>
              </>
            ) : (
              'Mật khẩu mới (Tùy chọn)'
            )}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="password"
              required={mode === 'create'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === 'create'
                  ? 'Tối thiểu 8 ký tự'
                  : 'Để trống nếu giữ nguyên mật khẩu cũ'
              }
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
          <p className="text-[11px] text-[#8A8175] mt-1">
            {mode === 'create'
              ? 'Mật khẩu cần tối thiểu 8 ký tự để bảo mật hệ thống.'
              : 'Chỉ nhập vào ô này nếu bạn muốn đổi mật khẩu mới cho nhân sự này.'}
          </p>
        </div>

        {/* Vai trò & Phân quyền */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Vai trò & Phân quyền <span className="text-[#C23924]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`relative flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                role === 'MANAGER'
                  ? 'bg-[#EBF3FF] border-[#BFDBFE] ring-1 ring-[#1D4ED8]'
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-[#F5EFE6]'
              }`}
            >
              <input
                type="radio"
                name="user_role"
                value="MANAGER"
                checked={role === 'MANAGER'}
                onChange={() => setRole('MANAGER')}
                className="sr-only"
              />
              <Briefcase
                className={`w-4 h-4 shrink-0 ${
                  role === 'MANAGER' ? 'text-[#1D4ED8]' : 'text-[#8A8175]'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-[#26201E]">Quản lý</div>
                <div className="text-[10px] text-[#8A8175]">Bàn, đơn & ca trực</div>
              </div>
            </label>

            <label
              className={`relative flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                role === 'ADMIN'
                  ? 'bg-[#FDF2EC] border-[#F6D8C8] ring-1 ring-[#8E2813]'
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-[#F5EFE6]'
              }`}
            >
              <input
                type="radio"
                name="user_role"
                value="ADMIN"
                checked={role === 'ADMIN'}
                onChange={() => setRole('ADMIN')}
                className="sr-only"
              />
              <ShieldCheck
                className={`w-4 h-4 shrink-0 ${
                  role === 'ADMIN' ? 'text-[#8E2813]' : 'text-[#8A8175]'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-[#26201E]">Quản trị viên</div>
                <div className="text-[10px] text-[#8A8175]">Toàn quyền hệ thống</div>
              </div>
            </label>
          </div>
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Số điện thoại liên hệ (Tùy chọn)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0988 ••• 391"
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Footer nút hành động */}
        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? 'Đang lưu...'
              : mode === 'create'
              ? 'Thêm nhân viên'
              : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function UserFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: UserFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <UserFormContent
        key={`${mode}-${initialData?.id || 'new'}`}
        mode={mode}
        initialData={initialData}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}
