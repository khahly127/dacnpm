'use client';

import React from 'react';
import Image from 'next/image';
import { Utensils, ClipboardCheck, Wine } from 'lucide-react';

export function LoginBanner() {
  return (
    <div className="relative hidden lg:flex lg:w-1/2 h-full min-h-[550px] lg:min-h-0 flex-col justify-between p-8 xl:p-9 overflow-hidden select-none">
      {/* 1. Ảnh nền từ thư mục public/images/bg_login.jpg */}
      <Image
        src="/images/bg_login.jpg"
        alt="Casa Cozy Bistro Dining Room"
        fill
        priority
        className="object-cover"
      />

      {/* 2. Lớp phủ Gradient tối màu */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35 z-10" />

      {/* 3. Phần chữ giới thiệu thương hiệu */}
      <div className="relative z-20 mt-auto mb-6 max-w-lg">
        <span className="font-serif italic text-amber-200/90 text-lg tracking-wide block mb-1.5">
          Casa Cozy Bistro
        </span>
        <h1 className="text-2xl xl:text-3xl font-black text-white leading-tight tracking-tight mb-2.5">
          Hệ Thống Quản Trị & Vận Hành (POS & ERP) Tập Trung
        </h1>
        <p className="text-xs text-stone-300 leading-relaxed font-normal">
          Tối ưu quy trình phục vụ bàn, order món, quản lý kho nguyên liệu và điều hành doanh thu chuỗi nhà hàng ẩm thực.
        </p>
      </div>

      {/* 4. Ba khối Card tính năng nhỏ gọn vừa vặn ở đáy */}
      <div className="relative z-20 grid grid-cols-3 gap-2.5">
        {/* Card 1: Vận hành */}
        <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2} />
            <span className="text-[9px] font-bold text-amber-300 tracking-wider uppercase">
              VẬN HÀNH
            </span>
          </div>
          <span className="text-[11px] font-bold text-white leading-snug">
            Bếp & POS Đồng Bộ
          </span>
        </div>

        {/* Card 2: Quản trị */}
        <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ClipboardCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2} />
            <span className="text-[9px] font-bold text-amber-300 tracking-wider uppercase">
              QUẢN TRỊ
            </span>
          </div>
          <span className="text-[11px] font-bold text-white leading-snug">
            Kiểm Kê Kho Real-time
          </span>
        </div>

        {/* Card 3: Báo cáo */}
        <div className="bg-black/45 backdrop-blur-md border border-white/15 rounded-xl p-2.5 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Wine className="w-3.5 h-3.5 text-amber-400 shrink-0" strokeWidth={2} />
            <span className="text-[9px] font-bold text-amber-300 tracking-wider uppercase">
              BÁO CÁO
            </span>
          </div>
          <span className="text-[11px] font-bold text-white leading-snug">
            Doanh Thu & Đặt Bàn
          </span>
        </div>
      </div>
    </div>
  );
}
