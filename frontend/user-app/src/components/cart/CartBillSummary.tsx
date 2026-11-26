'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';

export function CartBillSummary() {
  const { totalQuantity, subtotal, vatAmount, grandTotal } = useCart();

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs mb-4">
      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-[#231F20] mb-3">
        Chi tiết tạm tính
      </h3>

      <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-[#5C5046]">
        {/* Row 1: Tổng tiền món ăn */}
        <div className="flex items-center justify-between">
          <span>Tổng tiền món ăn ({totalQuantity} phần)</span>
          <span className="font-semibold text-[#231F20]">
            {subtotal.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Row 2: Phí dịch vụ & VAT (8%) */}
        <div className="flex items-center justify-between">
          <span>Phí dịch vụ & VAT (8%)</span>
          <span className="font-semibold text-[#231F20]">
            {vatAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Divider */}
        <div className="border-b border-[#F0EBE1] my-1" />

        {/* Row 3: Tổng thanh toán */}
        <div className="flex items-baseline justify-between pt-0.5">
          <span className="font-bold text-sm text-[#231F20]">
            Tổng thanh toán
          </span>
          <span className="text-lg sm:text-xl font-extrabold text-[#231F20] tracking-tight">
            {grandTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
}
