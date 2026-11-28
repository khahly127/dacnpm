'use client';

import React from 'react';
import { MetricCard } from '@/types/dashboard';
import {
  CreditCard,
  ShoppingCart,
  ReceiptText,
  Armchair,
  TrendingUp,
} from 'lucide-react';

interface StatCardsProps {
  metrics: MetricCard[];
}

export function StatCards({ metrics }: StatCardsProps) {
  // Hàm hiển thị số liệu: luôn đảm bảo không bị trống text dù dữ liệu từ API dạng nào
  const renderValue = (card: MetricCard) => {
    // 1. Nếu đã có sẵn numberValue và unit
    if (card.numberValue) {
      return (
        <div className="my-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[#26201E] tracking-tight">
            {card.numberValue}
          </span>
          {card.unit && (
            <span className="text-xs font-semibold text-[#8A8175]">
              {card.unit}
            </span>
          )}
        </div>
      );
    }

    // 2. Dự phòng: tự động tách số và đơn vị từ chuỗi `card.value`
    const val = card.value || '';
    const match = val.match(/^([0-9.,/]+)\s*(.*)$/);
    if (match) {
      return (
        <div className="my-2.5 flex items-baseline gap-1.5">
          <span className="text-2xl font-black text-[#26201E] tracking-tight">
            {match[1]}
          </span>
          {match[2] && (
            <span className="text-xs font-semibold text-[#8A8175]">
              {match[2]}
            </span>
          )}
        </div>
      );
    }

    // 3. Fallback hiển thị nguyên giá trị
    return (
      <div className="my-2.5">
        <span className="text-2xl font-black text-[#26201E] tracking-tight">
          {val}
        </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((card) => {
        return (
          <div
            key={card.id}
            className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-xs flex flex-col justify-between"
          >
            {/* Hàng trên: Tiêu đề & Icon Lucide */}
            <div className="flex items-start justify-between">
              <span className="text-xs font-semibold text-[#7C7267]">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FAF0E9] text-[#8E2813] flex items-center justify-center shrink-0">
                {card.type === 'revenue' && (
                  <CreditCard className="w-4 h-4 text-[#8E2813]" strokeWidth={2} />
                )}
                {card.type === 'orders' && (
                  <ShoppingCart className="w-4 h-4 text-[#8E2813]" strokeWidth={2} />
                )}
                {card.type === 'aov' && (
                  <ReceiptText className="w-4 h-4 text-[#8E2813]" strokeWidth={2} />
                )}
                {card.type === 'occupancy' && (
                  <Armchair className="w-4 h-4 text-[#8E2813]" strokeWidth={2} />
                )}
              </div>
            </div>

            {/* Giá trị chính (Số to nổi bật, đơn vị nhỏ gọn) */}
            {renderValue(card)}

            {/* Hàng dưới: So sánh (TrendingUp) hoặc Progress bar */}
            {card.type === 'occupancy' ? (
              <div className="mt-1">
                <div className="flex items-center justify-between text-[11px] text-[#7C7267] mb-1.5 font-medium">
                  <span>{card.comparisonText}</span>
                </div>
                <div className="w-full h-1.5 bg-[#F0EBE1] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#8E2813] rounded-full transition-all duration-500"
                    style={{ width: `${card.extraInfo?.occupancyRate || 41.7}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-[#8E2813] font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-[#8E2813]" strokeWidth={2.2} />
                <span>{card.comparisonText}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
