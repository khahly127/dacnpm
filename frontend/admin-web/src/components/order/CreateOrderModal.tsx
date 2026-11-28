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

      {/* Body Form */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
        {errorMessage && (
          <div className="p-3 bg-[#FDF2F0] border border-[#F8D7DA] rounded-xl flex items-start gap-2 text-xs text-[#C23924]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Chọn bàn */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Chọn bàn ăn <span className="text-[#C23924]">*</span>
          </label>
          <select
            value={tableId}
            onChange={(e) => setTableId(Number(e.target.value))}
            className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] focus:outline-none focus:border-[#8E2813] cursor-pointer"
          >
            {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                Bàn {String(n).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Danh sách món gọi */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-[#3C342F]">
              Danh sách món ăn <span className="text-[#C23924]">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs font-bold text-[#8E2813] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm món
            </button>
          </div>

          <div className="space-y-2.5">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl flex items-center gap-2 text-xs"
              >
                <div className="flex-1">
                  <select
                    value={item.dishId}
                    onChange={(e) => handleItemChange(idx, 'dishId', Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-[#EAE3D6] rounded-lg text-xs font-semibold text-[#26201E] cursor-pointer"
                  >
                    {SAMPLE_DISH_OPTIONS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({new Intl.NumberFormat('vi-VN').format(d.price)} VNĐ)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-16">
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={item.quantity}
                    onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-white border border-[#EAE3D6] rounded-lg text-center text-xs font-bold text-[#8E2813]"
                  />
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 text-[#8A8175] hover:text-red-600 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ghi chú chung */}
        <div>
          <label className="block text-xs font-bold text-[#3C342F] mb-1.5">
            Ghi chú phục vụ / Bếp
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: Không hành, không tiêu, đồ ăn ra cùng lúc..."
            className="w-full px-3.5 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813]"
          />
        </div>

        {/* Nút hành động */}
        <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#6E6359] hover:bg-[#F5EFE6] rounded-xl cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo đơn hàng'}
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
