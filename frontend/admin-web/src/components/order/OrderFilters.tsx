'use client';

import React from 'react';
import { Search, SlidersHorizontal, RefreshCw, ListOrdered, Armchair } from 'lucide-react';
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
  viewMode?: 'ROUNDS' | 'BY_TABLE';
  onViewModeChange?: (mode: 'ROUNDS' | 'BY_TABLE') => void;
}

export function OrderFilters({
  filters,
  tabCounts,
  onFilterChange,
  onRefresh,
  viewMode = 'ROUNDS',
  onViewModeChange,
}: OrderFiltersProps) {
  const tabs = [
    { key: 'ALL', label: 'Tất cả', count: tabCounts.ALL },
    { key: 'PENDING', label: 'Chờ xác nhận', count: tabCounts.PENDING },
    { key: 'COOKING', label: 'Đang chuẩn bị', count: tabCounts.COOKING },
    { key: 'COMPLETED', label: 'Đã phục vụ', count: tabCounts.COMPLETED },
    { key: 'CANCELLED', label: 'Đã hủy', count: tabCounts.CANCELLED },
  ] as const;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      {/* 1. Thanh Tabs Trạng thái bên trái (hoặc Tiêu đề khi ở chế độ Theo bàn ăn) */}
      {viewMode === 'BY_TABLE' ? (
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8E2813] shrink-0">
            <Armchair className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#26201E]">Sơ đồ đơn gom theo bàn ăn</div>
            <div className="text-[11px] text-[#8A8175]">Tổng hợp tất cả các đợt gọi món theo từng bàn</div>
          </div>
        </div>
      ) : (
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
      )}

      {/* 2. Ô tìm kiếm & Cụm Icon Chuyển đổi chế độ xem & Nút bộ lọc bên phải */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm mã đơn, số bàn, nhân viên..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs"
          />
        </div>

        {/* Cụm Icon Toggle: Dạng danh sách vs Theo bàn ăn */}
        {onViewModeChange && (
          <div className="flex items-center p-1 bg-white border border-[#EAE3D6] rounded-xl shadow-2xs gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => onViewModeChange('ROUNDS')}
              title="Xem dạng danh sách đợt gọi"
              aria-label="Xem dạng danh sách đợt gọi"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'ROUNDS'
                  ? 'bg-[#8E2813] text-white shadow-xs'
                  : 'text-[#8A8175] hover:text-[#26201E] hover:bg-[#FAF7F2]'
              }`}
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('BY_TABLE')}
              title="Xem gom theo bàn ăn"
              aria-label="Xem gom theo bàn ăn"
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                viewMode === 'BY_TABLE'
                  ? 'bg-[#8E2813] text-white shadow-xs'
                  : 'text-[#8A8175] hover:text-[#26201E] hover:bg-[#FAF7F2]'
              }`}
            >
              <Armchair className="w-4 h-4" />
            </button>
          </div>
        )}

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
