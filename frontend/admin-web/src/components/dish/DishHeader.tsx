'use client';

import React from 'react';
import { Plus, Download } from 'lucide-react';

interface DishHeaderProps {
  onAddDish?: () => void;
  onExportExcel?: () => void;
}

export function DishHeader({ onAddDish, onExportExcel }: DishHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-[#26201E] tracking-tight">
          Quản Lý Món Ăn
        </h1>
        <p className="text-xs text-[#7C7267] mt-1 font-normal">
          Quản lý danh mục, cập nhật giá niêm yết và kiểm soát trạng thái kinh doanh của các món ăn trên hệ thống
        </p>
      </div>

      <div className="flex items-center gap-2.5 self-start sm:self-auto">
        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#3C342F] text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#7C7267]" />
            <span>Xuất Excel</span>
          </button>
        )}

        <button
          type="button"
          onClick={onAddDish}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Món Mới</span>
        </button>
      </div>
    </div>
  );
}
