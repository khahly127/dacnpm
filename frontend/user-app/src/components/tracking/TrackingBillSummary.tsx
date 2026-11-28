'use client';

import React from 'react';

interface TrackingBillSummaryProps {
  grandTotal: number;
  totalDishesCount: number;
  breakdownText?: string;
  dishesTotal?: number;
  vatAmount?: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

export function TrackingBillSummary({
  grandTotal,
  totalDishesCount,
  breakdownText,
  dishesTotal,
  vatAmount,
}: TrackingBillSummaryProps) {
  const calculatedSubtotal =
    dishesTotal !== undefined && dishesTotal > 0
      ? dishesTotal
      : Math.round(grandTotal / 1.08);
  const calculatedVat =
    vatAmount !== undefined
      ? vatAmount
      : Math.max(0, grandTotal - calculatedSubtotal);

  return (
    <div className="w-full bg-[#FAF4EC] rounded-2xl p-4 border border-[#EDE5D8] shadow-2xs">
      <div className="flex flex-col gap-2 text-xs sm:text-sm">
        {/* Dòng 1: Tiền món ăn */}
        <div className="flex items-center justify-between text-[#5C5046]">
          <span>Tiền món ăn ({totalDishesCount} món)</span>
          <span className="font-semibold text-[#231F20]">
            {formatCurrency(calculatedSubtotal)}đ
          </span>
        </div>

        {/* Dòng 2: Thuế VAT (8%) */}
        <div className="flex items-center justify-between text-[#5C5046]">
          <span>Thuế VAT (8%)</span>
          <span className="font-semibold text-[#231F20]">
            +{formatCurrency(calculatedVat)}đ
          </span>
        </div>

        {/* Đường phân cách */}
        <div className="border-b border-[#EDE5D8] my-0.5" />

        {/* Dòng 3: Tạm tính toàn bàn */}
        <div className="flex items-baseline justify-between pt-0.5">
          <div className="flex flex-col">
            <span className="font-bold text-xs sm:text-sm text-[#231F20]">
              Tạm tính toàn bàn
            </span>
            {breakdownText && (
              <span className="text-[11px] text-[#8C7F72] font-medium mt-0.5">
                {breakdownText}
              </span>
            )}
          </div>
          <span className="text-base sm:text-lg font-black text-[#8B2323] tracking-tight">
            {formatCurrency(grandTotal)}đ
          </span>
        </div>
      </div>
    </div>
  );
}
