'use client';

import React from 'react';
import { Search, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { OrderFiltersState } from '@/types/order';

interface OrderFiltersProps {
  filters: OrderFiltersState;
  tabCounts: {
    ALL: number;
    PENDING: number;
    COOKING: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  onFilterChange: (newFilters: Partial<OrderFiltersState>) => void;
  onRefresh?: () => void;
}

export function OrderFilters({
  filters,
  tabCounts,
  onFilterChange,
  onRefresh,
}: OrderFiltersProps) {
  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: tabCounts.ALL },
    { key: 'PENDING', label: 'Chờ tiếp nhận', count: tabCounts.PENDING },
    { key: 'COOKING', label: 'Đang chế biến', count: tabCounts.COOKING },
    { key: 'COMPLETED', label: 'Đã phục vụ', count: tabCounts.COMPLETED },
    { key: 'CANCELLED', label: 'Đã hủy', count: tabCounts.CANCELLED },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* 1. Thanh Tabs Trạng thái bên trái */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = filters.statusTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onFilterChange({ statusTab: tab.key as OrderFiltersState['statusTab'] })}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#26201E] text-white shadow-xs'
                  : 'bg-white border border-[#EAE3D6] text-[#69635A] hover:bg-[#FAF7F2]'
              }`}
            >
              <span>{tab.label} ({tab.count})</span>
            </button>
          );
        })}
      </div>

      {/* 2. Ô tìm kiếm & Nút bộ lọc bên phải */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1 sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm mã đơn, số bàn, nhân viên..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs"
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#3C342F] text-xs font-bold rounded-xl transition-colors shadow-2xs shrink-0 cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#8A8175]" />
          <span>Bộ lọc</span>
        </button>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Tải lại danh sách"
            className="p-2 bg-white border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#8A8175] hover:text-[#26201E] rounded-xl transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
