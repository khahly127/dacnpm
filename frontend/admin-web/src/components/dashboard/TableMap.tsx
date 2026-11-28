'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';
import { TableItem } from '@/types/dashboard';
import { TableFilterType } from '@/hooks/useDashboard';

interface TableMapProps {
  tables: TableItem[];
  filter: TableFilterType;
  onFilterChange: (filter: TableFilterType) => void;
  counts: { all: number; occupied: number; available: number; reserved: number };
  onPayTable?: (tableId: number | string, tableName?: string) => void;
}

export function TableMap({ tables, filter, onFilterChange, counts, onPayTable }: TableMapProps) {
  const getBadgeStyle = (status: TableItem['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-[#F2EFE9] text-[#7C7267] border-[#E5E0D5]';
      case 'RESERVED':
        return 'bg-[#EAE5DC] text-[#554E46] border-[#D8D2C5]';
      case 'SERVING':
      case 'COOKING':
      case 'WAITING_KITCHEN':
      case 'EATING':
      case 'SERVED':
        return 'bg-[#FDF1EB] text-[#A6351B] border-[#F8D5C6]';
      default:
        return 'bg-[#F2EFE9] text-[#7C7267] border-[#E5E0D5]';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-xs flex flex-col justify-between h-full">
      {/* Phần Header: Tiêu đề cùng hàng với cụm nút bộ lọc, dòng mô tả nằm riêng bên dưới */}
      <div className="pb-4 border-b border-[#F5EFE6] space-y-1.5 min-h-[64px]">
        {/* Hàng 1: Đoạn text "Sơ Đồ Bàn Ăn Trực Tiếp" nằm CÙNG HÀNG với cụm nút và "Sơ đồ chi tiết" */}
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-[#26201E] whitespace-nowrap leading-tight">
            Sơ Đồ Bàn Ăn Trực Tiếp
          </h2>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Cụm 4 nút bộ lọc */}
            <div className="flex items-center gap-1 bg-[#FAF7F2] p-1 rounded-xl border border-[#EAE3D6]">
              <button
                type="button"
                onClick={() => onFilterChange('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#8E2813] text-white shadow-xs'
                    : 'text-[#69635A] hover:text-[#26201E]'
                }`}
              >
                Tất cả ({counts.all})
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('occupied')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'occupied'
                    ? 'bg-[#8E2813] text-white shadow-xs'
                    : 'text-[#69635A] hover:text-[#26201E]'
                }`}
              >
                Có khách ({counts.occupied})
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('available')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'available'
                    ? 'bg-[#8E2813] text-white shadow-xs'
                    : 'text-[#69635A] hover:text-[#26201E]'
                }`}
              >
                Bàn trống ({counts.available})
              </button>
              <button
                type="button"
                onClick={() => onFilterChange('reserved')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  filter === 'reserved'
                    ? 'bg-[#8E2813] text-white shadow-xs'
                    : 'text-[#69635A] hover:text-[#26201E]'
                }`}
              >
                Đặt trước ({counts.reserved})
              </button>
            </div>

            {/* Link Sơ đồ chi tiết */}
            <a
              href="#"
              className="text-xs font-semibold text-[#8E2813] hover:underline whitespace-nowrap"
            >
              Sơ đồ chi tiết →
            </a>
          </div>
        </div>

        {/* Hàng 2: Đoạn text mô tả nằm riêng bên dưới, thoải mái không gian 100% không bị chật */}
        <p className="text-xs text-[#8A8175] font-normal">
          Giám sát trạng thái 12 bàn phục vụ tại sảnh chính Casa Cozy.
        </p>
      </div>

      {/* Lưới 12 bàn ăn (4 cột x 3 hàng) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4">
        {tables.map((table) => {
          const isOccupied = table.status !== 'AVAILABLE' && table.status !== 'RESERVED';
          return (
            <div
              key={table.id}
              className={`rounded-xl p-3 border transition-all flex flex-col justify-between min-h-[115px] ${
                isOccupied
                  ? 'border-[#E8C2B3] bg-[#FFFAF7]'
                  : 'border-[#EAE3D6] bg-white hover:border-[#D5CABE]'
              }`}
            >
              {/* Mã bàn & Nhãn trạng thái */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#26201E]">
                    {table.code}
                  </span>
                  {table.hasAlert && (
                    <span className="text-[#8E2813] font-bold text-xs" title="Cần ưu tiên">★</span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(
                    table.status
                  )}`}
                >
                  {table.statusText}
                </span>
              </div>

              {/* Chi tiết khách / món */}
              <div className="my-1.5 space-y-0.5">
                <div className="text-xs font-bold text-[#26201E]">
                  {table.capacityText}
                </div>
                <div className="text-[11px] text-[#8A8175] font-normal truncate" title={table.detailNote}>
                  {table.detailNote}
                </div>
              </div>

              {/* Tạm tính & Nút Thanh toán */}
              <div className="flex items-center justify-between text-xs font-bold text-[#26201E] pt-1">
                <div>
                  {isOccupied && onPayTable && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const numId = Number(String(table.id).replace(/\D/g, '')) || table.id;
                        onPayTable(numId, table.code);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#8E2813] hover:bg-[#73200F] text-white text-[10px] font-bold shadow-2xs transition-colors cursor-pointer"
                      title="Mở thanh toán tổng hợp cho bàn này"
                    >
                      <CreditCard className="w-3 h-3" />
                      <span>Thanh toán</span>
                    </button>
                  )}
                </div>
                <div>
                  {table.subAmount ? table.subAmount : <span className="opacity-0">-</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
