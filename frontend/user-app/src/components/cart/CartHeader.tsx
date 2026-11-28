'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useTableSession } from '@/hooks/useTableSession';

interface CartHeaderProps {
  onClose: () => void;
}

export function CartHeader({ onClose }: CartHeaderProps) {
  const { tableName } = useTableSession();

  return (
    <div className="w-full flex items-center justify-between pb-3 pt-1 border-b border-[#EFE9DF] mb-1">
      {/* Nút X đóng giỏ hàng / quay lại thực đơn */}
      <button
        type="button"
        onClick={onClose}
        className="w-8 h-8 -ml-1 rounded-full hover:bg-black/5 active:scale-90 text-[#231F20] flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Quay lại thực đơn"
      >
        <X className="w-5 h-5 stroke-[2.2]" />
      </button>

      {/* Tiêu đề căn giữa: Giỏ hàng • Bàn 05 */}
      <h1 className="text-sm sm:text-base font-bold text-[#231F20] tracking-tight">
        Giỏ hàng • {tableName}
      </h1>

      {/* Placeholder khoảng trống cân đối hai bên */}
      <div className="w-8" />
    </div>
  );
}
