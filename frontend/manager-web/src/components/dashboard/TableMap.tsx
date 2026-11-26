'use client';

import React from 'react';
import Link from 'next/link';
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
            <Link
              href="/table"
              className="text-xs font-semibold text-[#8E2813] hover:underline whitespace-nowrap"
            >
              Sơ đồ chi tiết →
            </Link>
          </div>
        </div>

        {/* Hàng 2: Dòng phụ đề */}
        <p className="text-xs text-[#8A8175] font-normal">
          Giám sát trạng thái các bàn phục vụ tại sảnh chính Casa Cozy.
        </p>
      </div>

      {/* Lưới các bàn ăn */}
      <div className="pt-4 flex-1">
        {tables.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-xs text-[#8A8175]">
            Không tìm thấy bàn nào theo bộ lọc này.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tables.map((table) => {
              const isOccupied = table.status !== 'AVAILABLE' && table.status !== 'RESERVED';

              return (
                <div
                  key={table.id}
                  className={`rounded-xl p-3.5 border transition-all ${
                    isOccupied
                      ? 'bg-[#FFF8F6] border-[#F6D2C4] shadow-2xs'
                      : 'bg-[#FAF7F2]/60 border-[#EAE3D6] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#26201E] flex items-center gap-1">
                      {table.code}
                      {table.hasAlert && (
                        <span className="text-[#8E2813] text-sm leading-none font-black" title="Cần hỗ trợ">
                          ★
                        </span>
                      )}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${getBadgeStyle(
                        table.status
                      )}`}
                    >
                      {table.statusText}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#26201E] truncate mb-0.5">
                    {table.capacityText}
                  </div>
                  <div className="text-[11px] text-[#7C7267] truncate" title={table.detailNote}>
                    {table.detailNote}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#F5EFE6] flex items-center justify-between">
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
                    {table.subAmount ? (
                      <span className="text-xs font-bold text-[#8E2813]">
                        {table.subAmount}
                      </span>
                    ) : (
                      <span className="opacity-0">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
