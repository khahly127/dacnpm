'use strict';

import React from 'react';
import { Armchair, Utensils, Sparkles, QrCode } from 'lucide-react';
import { TableStats } from '../../types/table';

interface TableStatCardsProps {
  stats: TableStats;
}

export function TableStatCards({ stats }: TableStatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tổng số bàn ăn */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#EAE3D6] shadow-2xs flex items-center justify-between hover:border-[#D8CFBF] transition-all">
        <div>
          <span className="text-[11px] font-bold text-[#8A8175] uppercase tracking-wider block">
            TỔNG SỐ BÀN ĂN
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-[#2D241E]">{stats.total}</span>
            <span className="text-xs font-semibold text-[#8A8175]">Bàn</span>
          </div>
          <span className="text-[11px] text-[#8A8175] flex items-center gap-1.5 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A8175] shrink-0" />
            Phân bố trên {stats.areaCount} khu vực phục vụ
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#6E6457] shrink-0">
          <Armchair className="w-5 h-5" />
        </div>
      </div>

      {/* 2. Đang hoạt động */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#EAE3D6] shadow-2xs flex items-center justify-between hover:border-[#D8CFBF] transition-all">
        <div>
          <span className="text-[11px] font-bold text-[#8A8175] uppercase tracking-wider block">
            ĐANG HOẠT ĐỘNG
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-[#8B2323]">{stats.occupied}</span>
            <span className="text-xs font-semibold text-[#8A8175]">Bàn</span>
          </div>
          <span className="text-[11px] text-[#8A8175] flex items-center gap-1.5 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B2323] shrink-0" />
            {stats.capacityPercentage}% công suất hiện diện lúc này
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#FEECEC] border border-[#FCD2D2] flex items-center justify-center text-[#D9383A] shrink-0">
          <Utensils className="w-5 h-5" />
        </div>
      </div>

      {/* 3. Bàn trống sẵn sàng */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#EAE3D6] shadow-2xs flex items-center justify-between hover:border-[#D8CFBF] transition-all">
        <div>
          <span className="text-[11px] font-bold text-[#8A8175] uppercase tracking-wider block">
            BÀN TRỐNG SẴN SÀNG
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-black text-[#2D241E]">{stats.available}</span>
            <span className="text-xs font-semibold text-[#8A8175]">Bàn</span>
          </div>
          <span className="text-[11px] text-[#8A8175] flex items-center gap-1.5 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
            Sạch sẽ, đã dọn ly muỗng dao nĩa
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8A8175] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* 4. Mã QR đã kích hoạt */}
      <div className="bg-white p-4.5 rounded-2xl border border-[#EAE3D6] shadow-2xs flex items-center justify-between hover:border-[#D8CFBF] transition-all">
        <div>
          <span className="text-[11px] font-bold text-[#8A8175] uppercase tracking-wider block">
            MÃ QR ĐÃ KÍCH HOẠT
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#2D241E]">
              {stats.qrActive}/{stats.total}
            </span>
            <span className="text-[11px] font-black text-[#D97706] bg-[#FEF3E7] px-1.5 py-0.5 rounded-md">
              {stats.total > 0 ? Math.round((stats.qrActive / stats.total) * 100) : 0}%
            </span>
          </div>
          <span className="text-[11px] text-[#8A8175] flex items-center gap-1.5 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
            Đồng bộ thực đơn eMenu trực tiếp
          </span>
        </div>
        <div className="w-11 h-11 rounded-xl bg-[#FEF3E7] border border-[#FDE5CA] flex items-center justify-center text-[#D97706] shrink-0">
          <QrCode className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
