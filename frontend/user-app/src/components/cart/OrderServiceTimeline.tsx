'use client';

import React from 'react';
import { TrendingUp, Clock, CookingPot, Bell } from 'lucide-react';

interface OrderServiceTimelineProps {
  time: string;
}

export function OrderServiceTimeline({ time }: OrderServiceTimelineProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs">
      {/* Header: Biểu tượng Tiến độ phục vụ */}
      <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#231F20] pb-2 border-b border-[#F7F2EA]">
        <TrendingUp className="w-4 h-4 text-[#8B2323]" />
        <span>Tiến độ phục vụ</span>
      </div>

      {/* Stepper timeline 3 bước */}
      <div className="relative pt-4 pb-1">
        {/* Thanh line nối giữa các bước */}
        <div className="absolute top-8 left-9 right-9 h-0.5 bg-[#EFE8DD] z-0" />
        <div className="absolute top-8 left-9 w-[18%] h-0.5 bg-[#E88938] z-0" />

        <div className="grid grid-cols-3 relative z-10">
          {/* Bước 1: Chờ tiếp nhận (Đang hoạt động) */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#E88938] text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4 stroke-[2.3]" />
            </div>
            <span className="text-[11px] font-bold text-[#E88938] mt-2 leading-tight">
              1. Chờ xác nhận
            </span>
            <span className="text-[10px] text-[#8C7F72] mt-0.5">
              Vừa gửi lúc {time}
            </span>
          </div>

          {/* Bước 2: Đang chế biến */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#F5EFE6] border border-[#E8DEC0] text-[#A89F91] flex items-center justify-center">
              <CookingPot className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-[#7A6E62] mt-2 leading-tight">
              2. Đang chế biến
            </span>
            <span className="text-[10px] text-[#A89F91] mt-0.5">
              Chờ nấu
            </span>
          </div>

          {/* Bước 3: Lên bàn */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-[#F5EFE6] border border-[#E8DEC0] text-[#A89F91] flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium text-[#7A6E62] mt-2 leading-tight">
              3. Lên bàn
            </span>
            <span className="text-[10px] text-[#A89F91] mt-0.5">
              Chờ phục vụ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
