'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface CategoryHeaderProps {
  onAddCategory?: () => void;
}

export function CategoryHeader({ onAddCategory }: CategoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-[#26201E] tracking-tight">
          Quản Lý Danh Mục Món Ăn
        </h1>
        <p className="text-xs text-[#7C7267] mt-1 font-normal">
          Phân loại nhóm món ăn và điều chỉnh thứ tự hiển thị trên thực đơn e-Menu QR.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddCategory}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all self-start sm:self-auto cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Thêm Danh Mục Mới</span>
      </button>
    </div>
  );
}
