'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';

interface OrderHeaderProps {
  onAddOrder?: () => void;
  onExportExcel?: () => void;
}

export function OrderHeader({ onAddOrder, onExportExcel }: OrderHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-[#26201E] tracking-tight">
          Quản Lý Đơn Hàng
        </h1>
        <p className="text-xs text-[#8A8175] mt-1 font-medium">
          Giám sát, phân luồng chế biến và cập nhật trạng thái đơn hàng theo thời gian thực tại các bàn ăn.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onExportExcel && (
          <button
            type="button"
            onClick={onExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#3C342F] text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#8A8175]" />
            <span>Xuất Excel</span>
          </button>
        )}

        {onAddOrder && (
          <button
            type="button"
            onClick={onAddOrder}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Đơn Tại Bàn</span>
          </button>
        )}
      </div>
    </div>
  );
}
