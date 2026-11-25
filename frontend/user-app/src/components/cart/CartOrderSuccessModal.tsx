'use client';

import React from 'react';
import { CheckCircle2, ClipboardList, Utensils } from 'lucide-react';

interface CartOrderSuccessModalProps {
  isOpen: boolean;
  orderCode?: string;
  tableName: string;
  onViewOrdered: () => void;
  onBackToMenu: () => void;
}

export function CartOrderSuccessModal({
  isOpen,
  orderCode = '#DH009',
  tableName,
  onViewOrdered,
  onBackToMenu,
}: CartOrderSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#EFE9DF] text-center flex flex-col items-center">
        {/* Animated Checkmark Circle */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
          <CheckCircle2 className="w-9 h-9 stroke-[2.2] animate-bounce" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[#231F20]">
          Đặt món thành công!
        </h3>

        {/* Order code pill */}
        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF2EC] border border-[#F6D8C8] text-[#8B2323] text-xs font-bold">
          <span>Mã đơn:</span>
          <span>{orderCode}</span>
          <span>•</span>
          <span>{tableName}</span>
        </div>

        {/* Message */}
        <p className="mt-3 text-xs sm:text-sm text-[#5C5248] leading-relaxed">
          Đơn hàng đã được chuyển tới bộ phận bếp của Casa Cozy Bistro để chế biến. Quý khách vui lòng thư giãn trong giây lát!
        </p>

        {/* Action Buttons */}
        <div className="mt-6 w-full flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onViewOrdered}
            className="w-full bg-[#8B2323] hover:bg-[#781E1E] text-white font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Xem món đã gọi</span>
          </button>

          <button
            type="button"
            onClick={onBackToMenu}
            className="w-full bg-[#F5EFE6] hover:bg-[#ECE4D8] text-[#4A3B32] font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 border border-[#E5DCD0] transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4 text-[#8B2323]" />
            <span>Tiếp tục xem thực đơn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
