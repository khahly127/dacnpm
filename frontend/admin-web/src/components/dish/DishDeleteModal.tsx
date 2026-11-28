'use client';

import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { DishItem } from '@/types/dish';

interface DishDeleteModalProps {
  isOpen: boolean;
  dish: DishItem | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export function DishDeleteModal({
  isOpen,
  dish,
  onClose,
  onConfirm,
}: DishDeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen || !dish) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage(null);
      const result = await onConfirm(dish.id);
      if (!result.success) {
        setErrorMessage(result.message || 'Xóa món ăn thất bại.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi khi kết nối máy chủ để xóa món ăn.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FDF2F0] text-[#C23924] flex items-center justify-center shrink-0 border border-[#F8D7DA]">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">Xác nhận xóa món ăn</h2>
              <p className="text-xs text-[#8A8175]">Hành động này không thể hoàn tác</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung xác nhận */}
        <div className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <p className="text-xs text-[#3C342F] leading-relaxed">
            Bạn có chắc chắn muốn xóa món ăn sau khỏi danh sách thực đơn nhà hàng không?
          </p>

          {/* Hộp thông tin món ăn bị xóa */}
          <div className="p-3.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#26201E] text-sm">{dish.name}</span>
              <span className="px-2 py-0.5 bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] rounded-md border border-[#F6D8C8]">
                {dish.code}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#8A8175]">
              <span>Danh mục: {dish.categoryName}</span>
              <span className="font-semibold text-[#8E2813]">{dish.formattedPrice}</span>
            </div>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#6E6359] hover:bg-[#EFE9DF] rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-5 py-2 bg-[#C23924] hover:bg-[#A82E1C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
