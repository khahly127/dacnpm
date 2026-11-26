'use client';

import React, { useEffect, useState } from 'react';
import { Utensils, Clock } from 'lucide-react';
import { useTableSession } from '@/hooks/useTableSession';

export function ConfirmationTableCard() {
  const { tableName } = useTableSession();
  const [currentTime, setCurrentTime] = useState<string>('19:42');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#FAF3EA] border border-[#F2E5D4] rounded-2xl p-3.5 sm:p-4 flex items-center justify-between shadow-2xs">
      {/* Cụm thông tin bàn bên trái */}
      <div className="flex items-center gap-3">
        {/* Icon dao nĩa trên nền đỏ rượu */}
        <div className="w-11 h-11 rounded-xl bg-[#8B2323] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Utensils className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Text tên bàn, tầng và khu vực */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-[#231F20] tracking-tight">
              {tableName}
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FCE8D5] text-[#A64B2A] border border-[#F4D4B8]">
              Tầng 1
            </span>
          </div>
          <p className="text-[11px] text-[#7A6E62] mt-0.5 font-medium">
            Khu Trong Nhà • Không gian ấm cúng
          </p>
        </div>
      </div>

      {/* Đồng hồ thời gian bên phải */}
      <div className="flex items-center gap-1.5 text-xs text-[#7A6E62] font-semibold bg-white/70 px-2.5 py-1 rounded-lg border border-[#EDE3D5] shrink-0">
        <Clock className="w-3.5 h-3.5 text-[#8B2323]" />
        <span>{currentTime}</span>
      </div>
    </div>
  );
}
