import React from 'react';
import type { Metadata } from 'next';
import { LoginBanner } from '@/components/auth/LoginBanner';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng Nhập Quản Lý - Casa Cozy Bistro',
  description: 'Hệ thống Quản lý Vận hành POS & ERP Casa Cozy Bistro',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2] flex items-center justify-center p-4 sm:p-6 lg:p-8 select-none">
      {/* Khung Card Đăng Nhập Nổi Ở Giữa Màn Hình (Không tràn viền 100% toàn màn hình) */}
      <div className="w-full max-w-[1080px] h-auto lg:h-[650px] bg-white rounded-3xl shadow-xl border border-[#EAE3D6] overflow-hidden flex flex-col lg:flex-row">
        {/* 1. Nửa bên trái: Banner thương hiệu với ảnh nền /images/bg_login.jpg */}
        <LoginBanner />

        {/* 2. Nửa bên phải: Form đăng nhập */}
        <LoginForm />
      </div>
    </div>
  );
}
