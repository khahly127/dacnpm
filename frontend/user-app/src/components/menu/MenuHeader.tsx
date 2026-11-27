'use client';

import React from 'react';
import { useTableSession } from '@/hooks/useTableSession';

export function MenuHeader() {
  const { tableName } = useTableSession();

  return (
    <div className="w-full flex items-center justify-between py-3 px-4 bg-[#FAF7F2]/90 backdrop-blur-md sticky top-0 z-20 border-b border-[#EFE9DF]/80">
      {/* Table Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-[#EAE3D6] shadow-xs text-xs sm:text-sm font-bold text-[#231F20]">
        <svg
          className="w-3.5 h-3.5 text-[#8B2323] fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M4 7H20V9H4V7ZM6 10H18V12H6V10ZM6.5 12L5 18H7L8 12H6.5ZM17.5 12L19 18H17L16 12H17.5Z" />
        </svg>
        <span suppressHydrationWarning>{tableName}</span>
        <span className="text-[#A89F91]">•</span>
        <span className="text-[#6B5E52] font-semibold">Casa Cozy</span>
      </div>

      {/* Connection Status Badge (Hướng 1: Đang kết nối) */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-semibold select-none shadow-xs">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Đang kết nối</span>
      </div>
    </div>
  );
}
