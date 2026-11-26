'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
  Briefcase,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { useLoginForm } from '@/hooks/useLoginForm';

export function LoginForm() {
  const {
    formData,
    setRole,
    handleChange,
    showPassword,
    setShowPassword,
    loading,
    errorMessage,
    language,
    setLanguage,
    handleSubmit,
  } = useLoginForm();

  return (
    <div className="w-full lg:w-1/2 h-full bg-white flex flex-col justify-between p-6 sm:p-8 lg:p-9 overflow-y-auto">
      {/* 1. Header: Logo bên trái & Nút ngôn ngữ bên phải */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-xs shrink-0 border border-[#EAE3D6] bg-white">
            <Image
              src="/images/logo.jpg"
              alt="Casa Cozy Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="text-xs font-black tracking-wider text-[#26201E] uppercase">
              CASA COZY
            </div>
            <div className="text-[9px] tracking-wider text-[#8A8175] font-semibold uppercase">
              Bistro Management
            </div>
          </div>
        </div>

        {/* Nút ngôn ngữ VIE | ENG */}
        <div className="flex items-center bg-[#FAF7F2] p-0.5 rounded-lg border border-[#EAE3D6] text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setLanguage('VIE')}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              language === 'VIE'
                ? 'bg-white text-[#26201E] shadow-2xs font-black'
                : 'text-[#8A8175] hover:text-[#26201E]'
            }`}
          >
            VIE
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ENG')}
            className={`px-2.5 py-0.5 rounded-md transition-all cursor-pointer ${
              language === 'ENG'
                ? 'bg-white text-[#26201E] shadow-2xs font-black'
                : 'text-[#8A8175] hover:text-[#26201E]'
            }`}
          >
            ENG
          </button>
        </div>
      </div>

      {/* 2. Khối Form đăng nhập trung tâm */}
      <div className="max-w-[360px] w-full mx-auto my-auto py-2">
        {/* Tiêu đề */}
        <h2 className="text-xl sm:text-2xl font-black text-[#26201E] tracking-tight mb-1">
          Đăng Nhập Hệ Thống
        </h2>
        <p className="text-xs text-[#7C7267] mb-3 leading-snug">
          Vui lòng đăng nhập bằng tài khoản Quản lý hoặc Quản trị viên được cấp quyền.
        </p>

        {/* Tab chọn vai trò: Quản lý vs Quản trị viên (Mặc định active ở Quản lý) */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE3D6] mb-3">
          <button
            type="button"
            onClick={() => setRole('MANAGER')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              formData.role === 'MANAGER'
                ? 'bg-white text-[#8E2813] shadow-xs'
                : 'text-[#69635A] hover:text-[#26201E]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Quản lý</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('ADMIN')}
            className={`flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              formData.role === 'ADMIN'
                ? 'bg-white text-[#8E2813] shadow-xs'
                : 'text-[#69635A] hover:text-[#26201E]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" strokeWidth={2} />
            <span>Quản trị viên</span>
          </button>
        </div>

        {/* Hộp thông báo đặc quyền */}
        <div className="bg-[#FDF2EC] border border-[#F6D8C8] rounded-xl p-2.5 mb-3 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[#8E2813] shrink-0 mt-0.5" strokeWidth={2} />
          <p className="text-[11px] text-[#8E2813] leading-relaxed">
            {formData.role === 'MANAGER' ? (
              <>
                <strong className="font-bold">Đặc quyền Quản lý:</strong> Giám sát hoạt động phục vụ bàn trực tiếp, điều phối tiến độ bếp, kiểm tra đơn hàng và chốt ca làm việc.
              </>
            ) : (
              <>
                <strong className="font-bold">Đặc quyền Quản trị viên:</strong> Quản trị toàn diện thực đơn món ăn, cấu hình sơ đồ bàn & mã QR, phân quyền tài khoản nhân sự và tổng hợp báo cáo doanh thu.
              </>
            )}
          </p>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[11px] p-2.5 rounded-lg mb-2.5 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          {/* Trường 1: Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#26201E] mb-1">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89E92]" />
              <input
                type="text"
                required
                value={formData.identifier}
                onChange={(e) => handleChange('identifier', e.target.value)}
                placeholder={
                  formData.role === 'MANAGER'
                    ? 'Ví dụ: manager123@gmail.com hoặc mã quản lý'
                    : 'Ví dụ: admin123@gmail.com'
                }
                className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Trường 2: Mật khẩu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-[#26201E]">
                Mật khẩu
              </label>
              <Link
                href="#"
                className="text-[11px] font-semibold text-[#8E2813] hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89E92]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="Nhập mật khẩu tài khoản"
                className="w-full pl-9 pr-10 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-lg text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A89E92] hover:text-[#26201E] cursor-pointer"
                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Checkbox ghi nhớ */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              type="checkbox"
              id="rememberMe"
              checked={formData.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#8E2813] border-[#EAE3D6] focus:ring-[#8E2813] accent-[#8E2813] cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-[11px] text-[#69635A] font-medium cursor-pointer select-none"
            >
              Ghi nhớ phiên đăng nhập trên thiết bị này
            </label>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Đang xác thực...' : 'ĐĂNG NHẬP VÀO HỆ THỐNG'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* 3. Footer: Hotline ca trực */}
      <div className="pt-2 border-t border-[#F5EFE6] text-center space-y-0.5">
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#69635A]">
          <Headphones className="w-3 h-3 text-[#8E2813]" />
          <span>Hỗ trợ kỹ thuật ca trực:</span>
          <strong className="text-[#26201E] font-bold">1900 6886</strong>
        </div>
        <p className="text-[10px] text-[#A89E92]">
          © 2025 Casa Cozy Restaurant. Bảo mật nội bộ.
        </p>
      </div>
    </div>
  );
}
