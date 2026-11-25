'use client';

import React from 'react';
import { X, Pencil, Layers } from 'lucide-react';
import { CategoryItem } from '@/types/category';

interface CategoryDetailModalProps {
  isOpen: boolean;
  category: CategoryItem | null;
  onClose: () => void;
  onEdit?: (category: CategoryItem) => void;
}

export function CategoryDetailModal({
  isOpen,
  category,
  onClose,
  onEdit,
}: CategoryDetailModalProps) {
  if (!isOpen || !category) return null;

  const detailRows = [
    {
      field: 'Mã danh mục',
      value: (
        <span className="inline-block px-2 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-xs border border-[#F6D8C8]">
          {category.code}
        </span>
      ),
    },
    {
      field: 'Tên danh mục',
      value: <span className="font-bold text-[#26201E]">{category.name}</span>,
    },
    {
      field: 'Số lượng món ăn đang có',
      value: (
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3C342F] font-bold text-xs border border-[#EAE3D6]">
          {String(category.dishCount).padStart(2, '0')} món ăn
        </span>
      ),
    },
    {
      field: 'Thứ tự hiển thị menu',
      value: (
        <span className="text-xs font-semibold text-[#8E2813]">
          Vị trí ưu tiên số {category.displayOrder}
        </span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8E2813] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">{category.name}</h2>
              <p className="text-xs text-[#8A8175]">Chi tiết danh mục thực đơn</p>
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

        {/* Nội dung danh sách thông tin */}
        <div className="p-6">
          <div className="divide-y divide-[#F5EFE6] border border-[#EAE3D6] rounded-xl overflow-hidden bg-white">
            {detailRows.map((row, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 gap-1 hover:bg-[#FCFAF7] transition-colors"
              >
                <span className="text-xs font-semibold text-[#7C7267] sm:w-1/2">
                  {row.field}
                </span>
                <div className="sm:w-1/2 sm:text-right flex sm:justify-end">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5 bg-[#FAF7F2]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-white rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(category);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#8E2813] hover:bg-[#782210] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
