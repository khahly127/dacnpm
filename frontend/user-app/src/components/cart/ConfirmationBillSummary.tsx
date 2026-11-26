'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';

export function ConfirmationBillSummary() {
  const { distinctItemsCount, subtotal, vatAmount, grandTotal } = useCart();

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Tiêu đề section: Vạch đỏ + Chi tiết thanh toán */}
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-4 bg-[#8B2323] rounded-full" />
        <h3 className="text-sm sm:text-base font-bold text-[#231F20]">
          Chi tiết thanh toán
        </h3>
      </div>

      {/* Card bảng kê chi tiết thanh toán */}
      <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs flex flex-col gap-2.5">
        {/* Tiền món ăn */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#5C5046]">
          <span>Tiền món ăn ({distinctItemsCount} món)</span>
          <span className="font-semibold text-[#231F20]">
            {subtotal.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Thuế VAT & Phí dịch vụ */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-[#5C5046]">
          <span className="flex items-center gap-1">
            <span>Thuế VAT & Phí dịch vụ (8%)</span>
            <span className="text-[10px] text-[#A89F91]">ⓘ</span>
          </span>
          <span className="font-semibold text-[#231F20]">
            +{vatAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        {/* Đường kẻ phân cách */}
        <div className="border-b border-[#F0EBE1] my-1" />

        {/* Tổng thanh toán */}
        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base text-[#231F20]">
              Tổng thanh toán
            </span>
            <span className="text-[10px] text-[#8C7F72]">
              Đã bao gồm thuế phí
            </span>
          </div>

          <span className="text-xl sm:text-2xl font-extrabold text-[#8B2323] tracking-tight">
            {grandTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
}
