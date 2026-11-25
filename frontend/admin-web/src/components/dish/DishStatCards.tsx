'use client';

import React from 'react';
import { UtensilsCrossed, CheckCircle2, MinusCircle, BadgeDollarSign } from 'lucide-react';
import { DishStats } from '@/types/dish';

interface DishStatCardsProps {
  stats: DishStats;
}

export function DishStatCards({ stats }: DishStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Thẻ 1: Tổng thực đơn */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-semibold text-[#8A8175] uppercase tracking-wider block">
            Tổng thực đơn
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#26201E]">
              {String(stats.total).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-[#8A8175]">Món</span>
          </div>
          <span className="text-[11px] text-[#A89E92] mt-0.5 block">
            {stats.totalCategories} danh mục ẩm thực
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FDF2EC] text-[#8E2813] flex items-center justify-center shrink-0 border border-[#F6D8C8]">
          <UtensilsCrossed className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 2: Đang phục vụ */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-semibold text-[#8A8175] uppercase tracking-wider block">
            Đang phục vụ
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#065F46]">
              {String(stats.available).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-[#8A8175]">Món</span>
          </div>
          <span className="text-[11px] text-[#059669] font-medium mt-0.5 block">
            {stats.availableRate} công suất thực đơn
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 border border-[#A7F3D0]">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 3 (Đã gộp): Tạm dừng / Hết */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-semibold text-[#8A8175] uppercase tracking-wider block">
            Tạm dừng / Hết
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-black text-[#C23924]">
              {String(stats.pausedOrOutOfStock ?? 0).padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-[#8A8175]">Món</span>
          </div>
          <span className="text-[11px] text-[#C23924] font-medium mt-0.5 block">
            Nguyên liệu hoặc tạm dừng
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] text-[#C23924] flex items-center justify-center shrink-0 border border-[#FECACA]">
          <MinusCircle className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 4 (Thay mới): Giá trung bình */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-4 flex items-center justify-between shadow-2xs">
        <div>
          <span className="text-[11px] font-semibold text-[#8A8175] uppercase tracking-wider block">
            Giá trung bình
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black text-[#92400E] whitespace-nowrap">
              {stats.formattedAveragePrice || '~185.000 VNĐ'}
            </span>
          </div>
          <span className="text-[11px] text-[#8A8175] mt-0.5 block font-medium">
            {stats.priceRangeText || 'Dao động 45k – 550k'}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 border border-[#FDE68A]">
          <BadgeDollarSign className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
