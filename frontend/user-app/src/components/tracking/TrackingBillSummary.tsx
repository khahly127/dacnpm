'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface TrackingBillSummaryProps {
  grandTotal: number;
  totalDishesCount: number;
  breakdownText?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export function TrackingBillSummary({
  grandTotal,
  totalDishesCount,
  breakdownText,
}: TrackingBillSummaryProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Khung tổng tiền tạm tính */}
      <div className="bg-[#FAF4EC] rounded-2xl p-4 border border-[#EDE5D8] flex items-center justify-between shadow-2xs">
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-[#231F20]">
            Tạm tính toàn bàn ({totalDishesCount} món)
          </h4>
          {breakdownText && (
            <p className="text-[11px] text-[#8C7F72] font-medium mt-0.5">
              {breakdownText}
            </p>
          )}
        </div>

        <div className="text-right">
          <span className="text-base sm:text-lg font-black text-[#8B2323] tracking-tight">
            {formatCurrency(grandTotal)}đ
          </span>
        </div>
      </div>

      {/* Lời nhắc hỗ trợ từ nhà hàng */}
      <div className="flex items-start gap-2 px-2 py-1 text-center justify-center">
        <Info className="w-3.5 h-3.5 text-[#A89E91] shrink-0 mt-0.5" />
        <p className="text-[11px] text-[#8C7F72] leading-relaxed text-left">
          Khi cần hỗ trợ, quý khách vui lòng nhấn <b>Gọi NV</b> ở phía trên màn hình.
        </p>
      </div>
    </div>
  );
}
