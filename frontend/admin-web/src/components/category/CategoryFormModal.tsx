'use client';

import React, { useState } from 'react';
import { X, Hash, Layers, AlertCircle } from 'lucide-react';
import { CategoryItem, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';

interface CategoryFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: CategoryItem | null;
  onClose: () => void;
  onSubmit: (data: CreateCategoryInput | UpdateCategoryInput) => Promise<{ success: boolean; message?: string }>;
}

function CategoryFormContent({
  mode,
  initialData,
  onClose,
  onSubmit,
}: Omit<CategoryFormModalProps, 'isOpen'>) {
  const [name, setName] = useState(mode === 'edit' && initialData ? initialData.name : '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên danh mục món ăn.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreateCategoryInput | UpdateCategoryInput = {
        name: name.trim(),
      };

      const result = await onSubmit(payload);
      if (!result.success) {
        setErrorMessage(result.message || 'Thao tác không thành công.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra sự cố khi lưu danh mục. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Modal */}
      <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
        <div>
          <h2 className="text-base font-bold text-[#26201E]">
            {mode === 'create' ? 'Thêm Danh Mục Mới' : 'Chỉnh Sửa Danh Mục Món Ăn'}
          </h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            {mode === 'create'
              ? 'Tạo danh mục mới để phân loại các món ăn trên thực đơn.'
              : 'Cập nhật tên danh mục món ăn.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Khi Sửa: Hiển thị Mã danh mục (Khóa - Không được sửa) */}
        {mode === 'edit' && initialData && (
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
              Mã danh mục (Hệ thống cấp)
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
              <input
                type="text"
                disabled
                value={initialData.code}
                className="w-full pl-9 pr-24 py-2 bg-[#F5EFE6] border border-[#EAE3D6] rounded-xl text-xs font-bold text-[#8E2813] cursor-not-allowed select-none opacity-80"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#8A8175] bg-white px-2 py-0.5 rounded-md border border-[#EAE3D6]">
                Không thể sửa
              </span>
            </div>
          </div>
        )}

        {/* Tên danh mục */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Tên danh mục <span className="text-[#C23924]">*</span>
          </label>
          <div className="relative">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Khai vị, Món chính, Mỳ Ý & Risotto..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Footer nút hành động */}
        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#7C7267] hover:bg-[#FAF7F2] rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting
              ? 'Đang lưu...'
              : mode === 'create'
              ? 'Thêm danh mục'
              : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CategoryFormModal({
  isOpen,
  mode,
  initialData,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <CategoryFormContent
        key={`${mode}-${initialData?.id || 'new'}`}
        mode={mode}
        initialData={initialData}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}
