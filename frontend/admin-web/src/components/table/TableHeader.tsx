'use strict';

import React from 'react';
import { Utensils, QrCode } from 'lucide-react';
import { TableViewMode } from '../../types/table';

interface TableHeaderProps {
  viewMode: TableViewMode;
  onViewModeChange: (mode: TableViewMode) => void;
  totalTables: number;
}

export function TableHeader({ viewMode, onViewModeChange, totalTables }: TableHeaderProps) {
  const isTables = viewMode === 'tables';

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-2xl font-black text-[#2D241E] tracking-tight">
          {isTables ? 'Quản Lý Bàn Ăn' : 'Quản Lý Mã QR'}
        </h1>
        <p className="text-xs text-[#8A8175] mt-1 font-medium max-w-2xl">
          {isTables
            ? 'Giám sát sơ đồ không gian, cập nhật trạng thái thực khách và quản lý thời gian phục vụ trực tiếp tại từng bàn ăn.'
            : 'Phát hành, quản lý định danh bảo mật, tải xuống bộ ấn phẩm và hỗ trợ in ấn mã QR trực tiếp cho từng vị trí bàn ăn.'}
        </p>
      </div>

      {/* Top-right view mode switch tabs */}
      <div className="flex items-center gap-2 bg-[#F5EFE6] p-1 rounded-xl self-start lg:self-auto border border-[#EAE3D6]">
        <button
          type="button"
          onClick={() => onViewModeChange('tables')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            isTables
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'text-[#6E6457] hover:text-[#2D241E] hover:bg-white/60'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>Danh Sách Bàn</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              isTables ? 'bg-white/20 text-white' : 'bg-[#EAE3D6] text-[#6E6457]'
            }`}
          >
            {totalTables}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('qr')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            !isTables
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'text-[#6E6457] hover:text-[#2D241E] hover:bg-white/60'
          }`}
        >
          <QrCode className="w-3.5 h-3.5" />
          <span>In & Quản Lý QR</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              !isTables ? 'bg-white/20 text-white' : 'bg-[#EAE3D6] text-[#6E6457]'
            }`}
          >
            {totalTables}
          </span>
        </button>
      </div>
    </div>
  );
}
