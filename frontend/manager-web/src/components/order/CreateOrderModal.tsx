'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { CreateOrderInput } from '@/types/order';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateOrderInput) => Promise<{ success: boolean; message?: string }>;
}

const SAMPLE_DISH_OPTIONS = [
  { id: 1, name: 'Bò Wagyu Úc', price: 245000 },
  { id: 2, name: 'Sườn Cừu Nướng Thảo Mộc', price: 490000 },
  { id: 3, name: 'Gan Ngỗng Áp Chảo Foie Gras', price: 365000 },
  { id: 4, name: 'Mì Ý Hải Sản Nero di Seppia', price: 280000 },
  { id: 5, name: 'Cơm Ý Risotto Nấm Truffle', price: 320000 },
  { id: 6, name: 'Salad Cá Hồi Xông Khói', price: 215000 },
  { id: 7, name: 'Bánh Tiramisu Truyền Thống', price: 125000 },
  { id: 8, name: 'Rượu Vang Đỏ Bordeaux', price: 1450000 },
];

function CreateOrderContent({
  onClose,
  onSubmit,
}: Omit<CreateOrderModalProps, 'isOpen'>) {
  const [tableId, setTableId] = useState<number>(1);
  const [note, setNote] = useState('');
  const [items, setItems] = useState<Array<{ dishId: number; quantity: number; note: string }>>([
    { dishId: 1, quantity: 1, note: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddItem = () => {
    setItems((prev) => [...prev, { dishId: 1, quantity: 1, note: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: unknown) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Vui lòng chọn ít nhất 1 món ăn cho đơn hàng.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await onSubmit({
        tableId: Number(tableId),
        note: note.trim() || undefined,
        items: items.map((i) => ({
          dishId: Number(i.dishId),
          quantity: Number(i.quantity),
          note: i.note.trim() || undefined,
        })),
      });

      if (!res.success) {
        setErrorMessage(res.message || 'Tạo đơn hàng thất bại.');
      } else {
        onClose();
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi khi tạo đơn hàng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
        <div>
          <h2 className="text-base font-bold text-[#26201E]">Tạo Đơn Hàng Tại Bàn</h2>
          <p className="text-xs text-[#8A8175] mt-0.5">
            Nhập số bàn và chọn danh sách món ăn phục vụ cho thực khách.
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Số bàn */}
        <div>
          <label className="block text-xs font-bold text-[#26201E] mb-1.5">
            Chọn Bàn Phục Vụ <span className="text-[#8E2813]">*</span>
          </label>
          <select
            value={tableId}
            onChange={(e) => setTableId(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] focus:outline-none focus:border-[#8E2813] transition-colors"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <option key={num} value={num}>
                Bàn {num}
              </option>
            ))}
          </select>
        </div>

        {/* Ghi chú chung */}
        <div>
          <label className="block text-xs font-bold text-[#26201E] mb-1.5">
            Ghi Chú Phục Vụ / Bếp
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: Khách ăn ít cay, lên món nhanh..."
            className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] focus:outline-none focus:border-[#8E2813] transition-colors placeholder:text-[#A89E92]"
          />
        </div>

        {/* Danh sách món ăn */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#26201E] uppercase tracking-wider">
              Danh Sách Món Ăn ({items.length})
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-[#8E2813] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm món</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex items-center gap-2.5"
              >
                {/* Chọn món */}
                <select
                  value={item.dishId}
                  onChange={(e) => handleItemChange(index, 'dishId', Number(e.target.value))}
                  className="flex-1 px-2.5 py-1.5 bg-white border border-[#EAE3D6] rounded-lg text-xs text-[#26201E] focus:outline-none focus:border-[#8E2813]"
                >
                  {SAMPLE_DISH_OPTIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({new Intl.NumberFormat('vi-VN').format(d.price)}đ)
                    </option>
                  ))}
                </select>

                {/* Số lượng */}
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', Math.max(1, Number(e.target.value)))}
                  className="w-16 px-2 py-1.5 bg-white border border-[#EAE3D6] rounded-lg text-xs text-center font-bold text-[#8E2813] focus:outline-none focus:border-[#8E2813]"
                />

                {/* Xóa */}
                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="p-1.5 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Xóa món"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE3D6] bg-white hover:bg-[#FAF7F2] text-[#3C342F] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Đang tạo...' : 'Xác Nhận Tạo Đơn'}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CreateOrderModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <CreateOrderContent onClose={onClose} onSubmit={onSubmit} />
    </div>
  );
}
