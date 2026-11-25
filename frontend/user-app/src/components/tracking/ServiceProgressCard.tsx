'use client';

import React from 'react';
import { Check, CookingPot, Bell, Clock } from 'lucide-react';

interface ServiceProgressCardProps {
  progressPercent: number;
  readyDishesCount: number;
  totalDishesCount: number;
  timelineStep: 1 | 2 | 3;
  isConfirmed?: boolean;
  firstOrderTime?: string;
}

export function ServiceProgressCard({
  progressPercent,
  readyDishesCount,
  totalDishesCount,
  timelineStep,
  isConfirmed = false,
  firstOrderTime = '19:42',
}: ServiceProgressCardProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs">
      {/* Tiêu đề & Tỷ lệ hoàn tất */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[#231F20]">
            Tiến độ phục vụ
          </h3>
          {isConfirmed ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDF2EC] text-[#8B2323] border border-[#FADCCB]">
              {progressPercent}% Hoàn tất
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEFCE8] text-[#CA8A04] border border-[#FDE047]">
              Chờ xác nhận
            </span>
          )}
        </div>
        <span className="text-xs font-semibold text-[#8C7F72]">
          {readyDishesCount}/{totalDishesCount} món sẵn sàng
        </span>
      </div>

      {/* Thanh tiến độ ngang */}
      <div className="w-full h-1.5 bg-[#EFE8DD] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-[#8B2323] rounded-full transition-all duration-500 ease-out"
          style={{ width: isConfirmed ? `${Math.min(100, Math.max(8, progressPercent))}%` : '5%' }}
        />
      </div>

      {/* Stepper timeline 3 bước: Chờ xác nhận/Tiếp nhận -> Đang chế biến -> Lên bàn */}
      <div className="grid grid-cols-3 relative pt-1">
        {/* Bước 1: Chờ xác nhận -> Đã tiếp nhận */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isConfirmed
                ? 'bg-[#FDF2EC] border border-[#FAD8C8] text-[#D05A32] shadow-xs'
                : 'bg-[#FEFCE8] border border-[#FDE047] text-[#CA8A04] shadow-xs'
            }`}
          >
            {isConfirmed ? (
              <Check className="w-4 h-4 stroke-[2.8]" />
            ) : (
              <Clock className="w-4 h-4 animate-pulse" />
            )}
          </div>
          <span
            className={`text-[11px] font-bold mt-2 leading-tight ${
              isConfirmed ? 'text-[#231F20]' : 'text-[#CA8A04]'
            }`}
          >
            {isConfirmed ? '1. Đã tiếp nhận' : '1. Chờ xác nhận'}
          </span>
          <span className="text-[10px] text-[#8C7F72] mt-0.5 font-medium">
            {isConfirmed ? firstOrderTime : `Gửi lúc ${firstOrderTime}`}
          </span>
        </div>

        {/* Bước 2: Đang chuẩn bị */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isConfirmed && timelineStep === 2
                ? 'bg-[#8B2323] text-white shadow-xs'
                : isConfirmed && timelineStep > 2
                ? 'bg-[#FDF2EC] border border-[#FAD8C8] text-[#D05A32]'
                : 'bg-[#F5EFE6] border border-[#E8DEC0] text-[#A89F91]'
            }`}
          >
            {isConfirmed && timelineStep > 2 ? (
              <Check className="w-4 h-4 stroke-[2.8]" />
            ) : (
              <CookingPot className="w-4 h-4" />
            )}
          </div>
          <span
            className={`text-[11px] font-bold mt-2 leading-tight ${
              isConfirmed && timelineStep >= 2 ? 'text-[#8B2323]' : 'text-[#7A6E62]'
            }`}
          >
            2. Đang chuẩn bị
          </span>
          <span
            className={`text-[10px] mt-0.5 font-medium ${
              isConfirmed && timelineStep === 2
                ? 'text-[#8B2323]'
                : isConfirmed && timelineStep > 2
                ? 'text-[#16A34A]'
                : 'text-[#A89F91]'
            }`}
          >
            {isConfirmed && timelineStep === 2
              ? 'Bếp nóng'
              : isConfirmed && timelineStep > 2
              ? 'Đã nấu xong'
              : 'Chờ chuẩn bị'}
          </span>
        </div>

        {/* Bước 3: Lên bàn */}
        <div className="flex flex-col items-center text-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isConfirmed && timelineStep === 3
                ? progressPercent >= 100
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-[#8B2323] text-white shadow-xs'
                : 'bg-[#F5EFE6] border border-[#E8DEC0] text-[#A89F91]'
            }`}
          >
            <Bell className="w-4 h-4" />
          </div>
          <span
            className={`text-[11px] font-bold mt-2 leading-tight ${
              isConfirmed && timelineStep === 3 ? 'text-[#231F20]' : 'text-[#7A6E62]'
            }`}
          >
            3. Lên bàn
          </span>
          <span
            className={`text-[10px] mt-0.5 font-medium ${
              isConfirmed && timelineStep === 3
                ? progressPercent >= 100
                  ? 'text-[#16A34A] font-bold'
                  : 'text-[#5C5046]'
                : 'text-[#A89F91]'
            }`}
          >
            {isConfirmed && timelineStep === 3
              ? progressPercent >= 100
                ? 'Đã lên đủ món'
                : 'Chờ giao đủ'
              : 'Chờ phục vụ'}
          </span>
        </div>
      </div>
    </div>
  );
}
