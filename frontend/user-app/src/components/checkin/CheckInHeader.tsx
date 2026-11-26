'use client';

import React from 'react';
import Image from 'next/image';

interface CheckInHeaderProps {
  title?: string;
  slogan?: string;
  subtitle?: string;
}

export function CheckInHeader({
  title = 'Casa Cozy',
  slogan = 'Bếp ấm & Bàn ăn • Trải nghiệm ẩm thực trọn vẹn',
  subtitle = 'Xác Nhận Bàn Ăn Của Bạn',
}: CheckInHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* 1. Logo hình vuông bo tròn viền ấm */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border border-[#EAE3D6] shadow-[0_4px_16px_rgba(139,35,35,0.06)] p-2 mb-2.5 flex items-center justify-center">
        <Image
          src="/images/logo.jpg"
          alt="Casa Cozy Logo"
          fill
          className="object-contain p-1.5"
          priority
        />
      </div>

      {/* 2. Tên thương hiệu & Khẩu hiệu */}
      <h1 className="text-xl sm:text-2xl font-black text-[#231F20] tracking-tight">
        {title}
      </h1>
      <p className="text-[11px] sm:text-xs text-[#8A7E72] mt-0.5 font-medium">
        {slogan}
      </p>

      {/* 3. Tiêu đề chức năng cổng check-in */}
      <div className="mt-4 pt-3 border-t border-[#EAE3D6]/60 w-full max-w-[320px]">
        <h2 className="text-sm sm:text-base font-extrabold text-[#8E2813] uppercase tracking-wider">
          {subtitle}
        </h2>
        <p className="text-[11px] text-[#6E6357] mt-0.5">
          Quét mã QR tại bàn hoặc nhập số bàn để bắt đầu gọi món
        </p>
      </div>
    </div>
  );
}
