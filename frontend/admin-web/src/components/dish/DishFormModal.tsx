'use client';

import React, { useState } from 'react';
import { X, Hash, Utensils, Tag, DollarSign, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { DishItem, DishStatus, CreateDishInput, UpdateDishInput } from '@/types/dish';

interface DishFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  initialData?: DishItem | null;
  categories: Array<{ id: number; name: string }>;
  onClose: () => void;
  onSubmit: (data: CreateDishInput | UpdateDishInput) => Promise<{ success: boolean; message?: string }>;
}

function DishFormContent({
  mode,
  initialData,
  categories,
  onClose,
  onSubmit,
}: Omit<DishFormModalProps, 'isOpen'>) {
  const [name, setName] = useState(mode === 'edit' && initialData ? initialData.name : '');
  const [subtitle, setSubtitle] = useState(mode === 'edit' && initialData ? (initialData.subtitle || '') : '');
  const [categoryId, setCategoryId] = useState<number>(
    mode === 'edit' && initialData
      ? initialData.categoryId
      : (categories[0]?.id || 1)
  );
  const [price, setPrice] = useState<string>(
    mode === 'edit' && initialData ? String(initialData.price) : ''
  );
  const [image, setImage] = useState(mode === 'edit' && initialData ? (initialData.image || '') : '');
  const [status, setStatus] = useState<DishStatus>(
    mode === 'edit' && initialData ? initialData.status : 'AVAILABLE'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập tên món ăn.');
      return;
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      setErrorMessage('Vui lòng nhập giá niêm yết hợp lệ (lớn hơn hoặc bằng 0).');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: CreateDishInput | UpdateDishInput = {
        name: name.trim(),
        subtitle: subtitle.trim() || undefined,
        categoryId: Number(categoryId),
        price: numericPrice,
        image: image.trim() || null,
        status,
      };

      const result = await onSubmit(payload);
      if (!result.success) {
        setErrorMessage(result.message || 'Thao tác không thành công.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra sự cố khi lưu món ăn. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header Modal */}
      <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
        <div>
          <h2 className="text-base font-bold text-[#26201E]">
            {mode === 'create' ? 'Thêm Món Ăn Mới' : 'Chỉnh Sửa Thông Tin Món Ăn'}
          </h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            {mode === 'create'
              ? 'Tạo mới món ăn trong thực đơn, cập nhật giá niêm yết và danh mục phục vụ.'
              : 'Cập nhật tên món, danh mục phân loại, đơn giá và trạng thái kinh doanh.'}
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
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Khi Sửa: Hiển thị Mã món (Khóa - Không được sửa) */}
        {mode === 'edit' && initialData && (
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
              Mã món ăn (Hệ thống cấp)
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

        {/* Tên món ăn */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Tên món ăn <span className="text-[#C23924]">*</span>
          </label>
          <div className="relative">
            <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Bò Bít Tết Wagyu Úc, Sườn Cừu Nướng Thảo Mộc..."
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Mô tả phụ / Tên món tiếng Anh */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Tên phụ / Mô tả ngắn nguyên liệu
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Ví dụ: Australian Wagyu Tenderloin, sốt nấm Truffle..."
            className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
          />
        </div>

        {/* Danh mục và Đơn vị giá */}
        <div className="grid grid-cols-2 gap-3">
          {/* Danh mục */}
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
              Danh mục thực đơn <span className="text-[#C23924]">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92] pointer-events-none" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full pl-9 pr-8 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors appearance-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8A8175] text-[10px]">
                ▼
              </div>
            </div>
          </div>

          {/* Giá niêm yết */}
          <div>
            <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
              Giá niêm yết (VNĐ) <span className="text-[#C23924]">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
              <input
                type="number"
                min={0}
                step={1000}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Ví dụ: 245000"
                className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors font-medium"
              />
            </div>
          </div>
        </div>

        {/* Link hình ảnh */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Đường dẫn hình ảnh (URL / Tên file)
          </label>
          <div className="relative">
            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Ví dụ: https://images.unsplash.com/... hoặc /dishes/wagyu.png"
              className="w-full pl-9 pr-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Trạng thái món ăn */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Trạng thái phục vụ
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {/* Đang phục vụ */}
            <label
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                status === 'AVAILABLE'
                  ? 'bg-[#ECFDF5] border-[#A7F3D0] ring-1 ring-[#059669]'
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-[#F5EFE6]'
              }`}
            >
              <input
                type="radio"
                name="dish_status"
                value="AVAILABLE"
                checked={status === 'AVAILABLE'}
                onChange={() => setStatus('AVAILABLE')}
                className="sr-only"
              />
              <span className="w-2 h-2 rounded-full bg-[#10B981] mb-1.5" />
              <span className="text-xs font-bold text-[#059669]">Đang phục vụ</span>
              <span className="text-[10px] text-[#8A8175] mt-0.5">Sẵn sàng gọi món</span>
            </label>

            {/* Tạm hết món */}
            <label
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                status === 'OUT_OF_STOCK'
                  ? 'bg-[#FEF2F2] border-[#FECACA] ring-1 ring-[#DC2626]'
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-[#F5EFE6]'
              }`}
            >
              <input
                type="radio"
                name="dish_status"
                value="OUT_OF_STOCK"
                checked={status === 'OUT_OF_STOCK'}
                onChange={() => setStatus('OUT_OF_STOCK')}
                className="sr-only"
              />
              <span className="w-2 h-2 rounded-full bg-[#DC2626] mb-1.5" />
              <span className="text-xs font-bold text-[#DC2626]">Tạm hết món</span>
              <span className="text-[10px] text-[#8A8175] mt-0.5">Hết nguyên liệu</span>
            </label>

            {/* Đã ẩn */}
            <label
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all ${
                status === 'HIDDEN'
                  ? 'bg-[#F3F4F6] border-[#D1D5DB] ring-1 ring-[#6B7280]'
                  : 'bg-[#FAF7F2] border-[#EAE3D6] hover:bg-[#F5EFE6]'
              }`}
            >
              <input
                type="radio"
                name="dish_status"
                value="HIDDEN"
                checked={status === 'HIDDEN'}
                onChange={() => setStatus('HIDDEN')}
                className="sr-only"
              />
              <span className="w-2 h-2 rounded-full bg-[#9CA3AF] mb-1.5" />
              <span className="text-xs font-bold text-[#4B5563]">Đã ẩn</span>
              <span className="text-[10px] text-[#8A8175] mt-0.5">Thời vụ / Lưu kho</span>
            </label>
          </div>
        </div>

        {/* Nút hành động */}
        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#6E6359] hover:bg-[#F5EFE6] rounded-xl transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? 'Đang lưu...'
              : mode === 'create'
              ? 'Thêm món mới'
              : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function DishFormModal({
  isOpen,
  mode,
  initialData,
  categories,
  onClose,
  onSubmit,
}: DishFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <DishFormContent
        key={`${mode}-${initialData?.id || 'new'}`}
        mode={mode}
        initialData={initialData}
        categories={categories}
        onClose={onClose}
        onSubmit={onSubmit}
      />
    </div>
  );
}
