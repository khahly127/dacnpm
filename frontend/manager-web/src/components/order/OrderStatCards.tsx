'use client';

import React from 'react';
import { FileText, Hourglass, CookingPot, CheckCircle2, TrendingUp, Check } from 'lucide-react';
import { OrderStats } from '@/types/order';

interface OrderStatCardsProps {
  stats: OrderStats;
}

export function OrderStatCards({ stats }: OrderStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Thẻ 1: Tổng đơn hôm nay */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#8A8175]">
            Tổng đơn hôm nay
          </span>
          <div className="text-2xl font-black text-[#26201E] mt-1">
            {stats.totalToday}{' '}
            <span className="text-xs font-normal text-[#8A8175]">đơn</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#059669] mt-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{stats.growthRate} so với hôm qua</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8E2813] shadow-xs shrink-0">
          <FileText className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 2: Chờ xác nhận (Cần xử lý ngay) */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#8A8175]">
            Chờ xác nhận
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-black text-[#DC2626]">
              {String(stats.pending).padStart(2, '0')}{' '}
              <span className="text-xs font-normal text-[#8A8175]">đơn</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
          </div>
          <div className="text-[11px] font-bold text-[#DC2626] mt-1.5">
            Cần xử lý ngay
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] shadow-xs shrink-0">
          <Hourglass className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 3: Đang chuẩn bị */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#8A8175]">
            Đang chuẩn bị
          </span>
          <div className="text-2xl font-black text-[#26201E] mt-1">
            {String(stats.cooking).padStart(2, '0')}{' '}
            <span className="text-xs font-normal text-[#8A8175]">đơn</span>
          </div>
          <div className="text-[11px] font-medium text-[#8A8175] mt-1.5">
            Bếp đang ra món
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shadow-xs shrink-0">
          <CookingPot className="w-5 h-5" />
        </div>
      </div>

      {/* Thẻ 4: Đã hoàn tất */}
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[#8A8175]">
            Đã hoàn tất
          </span>
          <div className="text-2xl font-black text-[#059669] mt-1">
            {stats.completed}{' '}
            <span className="text-xs font-normal text-[#8A8175]">đơn</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#059669] mt-1.5">
            <Check className="w-3.5 h-3.5" />
            <span>{stats.onTimeRate} tỷ lệ đúng giờ</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669] shadow-xs shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
