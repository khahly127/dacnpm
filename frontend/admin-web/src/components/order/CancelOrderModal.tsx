'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, UtensilsCrossed } from 'lucide-react';
import { OrderItem } from '@/types/order';

interface CancelOrderModalProps {
  isOpen: boolean;
  order: OrderItem | null;
  onClose: () => void;
  onConfirm: (orderId: string, reason: string) => Promise<void> | void;
}

const DEFAULT_REASONS = [
  'Bếp hết nguyên liệu chế biến món ăn',
  'Khách hàng yêu cầu đổi món / hủy đợt gọi',
  'Đơn đặt trùng lặp / khách bấm nhầm trên QR',
  'Khác (nhập ghi chú bên dưới)',
];

export function CancelOrderModal({
  isOpen,
  order,
  onClose,
  onConfirm,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>(DEFAULT_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen || !order) return null;

  const handleConfirm = async () => {
    const finalReason = selectedReason.startsWith('Khác')
      ? customReason.trim() || 'Lý do khác'
      : selectedReason;

    setIsSubmitting(true);
    try {
      await onConfirm(order.id, finalReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FFF5F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#991B1B]">
                Hủy / Từ Chối Đơn Hàng
              </h2>
              <p className="text-xs text-[#DC2626]/80 font-medium">
                Mã đơn: <span className="font-bold">{order.code}</span> • {order.tableName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung */}
        <div className="p-6 space-y-4 text-xs">
          {/* Tóm tắt món trong đơn */}
          <div className="p-3 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#26201E] text-xs">
              <UtensilsCrossed className="w-3.5 h-3.5 text-[#8E2813]" />
              <span>Món ăn trong đợt gọi này:</span>
            </div>
            <div className="divide-y divide-[#EAE3D6]/60 text-[11px] text-[#3C342F] max-h-32 overflow-y-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span>
                    <strong className="text-[#8E2813]">{item.quantity}x</strong> {item.dishName}
                  </span>
                  <span className="font-semibold">{new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VNĐ</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-1 border-t border-[#EAE3D6] font-bold text-xs text-[#8E2813]">
              <span>Tổng tiền đơn:</span>
              <span>{order.formattedTotal}</span>
            </div>
          </div>

          {/* Chọn lý do hủy */}
          <div>
            <label className="block text-xs font-bold text-[#26201E] mb-2">
              Vui lòng chọn lý do từ chối / hủy đơn:
            </label>
            <div className="space-y-2">
              {DEFAULT_REASONS.map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedReason === reason
                      ? 'border-[#DC2626] bg-[#FEF2F2] text-[#991B1B] font-bold shadow-2xs'
                      : 'border-[#EAE3D6] bg-white text-[#3C342F] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="accent-[#DC2626] w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason.startsWith('Khác') && (
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do chi tiết..."
                rows={2}
                className="w-full mt-2 p-2.5 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#DC2626] transition-colors"
              />
            )}
          </div>

          <div className="p-3 bg-[#FEF2F2] rounded-xl border border-[#FECACA] text-[11px] text-[#991B1B] leading-relaxed">
            ⚠️ <strong>Lưu ý:</strong> Sau khi xác nhận hủy, đơn hàng sẽ chuyển sang trạng thái <strong>Đã hủy</strong> và số tiền của đơn này sẽ được tự động trừ ra khỏi hóa đơn tổng của bàn.
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-white border border-[#EAE3D6] hover:bg-[#F5EFE6] text-[#3C342F] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Giữ lại đơn
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Đang hủy...' : 'Xác nhận hủy đơn'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
