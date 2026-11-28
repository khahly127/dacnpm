'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ConfirmationHeaderProps {
  onBack: () => void;
}

export function ConfirmationHeader({ onBack }: ConfirmationHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between pb-3 pt-1 border-b border-[#EFE9DF] mb-1">
      {/* Nút ← quay lại giỏ hàng */}
      <button
        type="button"
        onClick={onBack}
        className="w-8 h-8 -ml-1 rounded-full hover:bg-black/5 active:scale-90 text-[#231F20] flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Quay lại giỏ hàng"
      >
        <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* Tiêu đề căn giữa: Xác Nhận Đặt Món */}
      <h1 className="text-sm sm:text-base font-bold text-[#231F20] tracking-tight">
        Xác Nhận Đặt Món
      </h1>

      {/* Placeholder khoảng trống cân đối hai bên */}
      <div className="w-8" />
    </div>
  );
}
