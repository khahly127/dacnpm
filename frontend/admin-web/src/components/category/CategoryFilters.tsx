'use client';

import React from 'react';
import { Search, ChevronDown, RotateCw, ArrowUpDown } from 'lucide-react';
import { CategoryFiltersState, CategoryStatus } from '@/types/category';

interface CategoryFiltersProps {
  filters: CategoryFiltersState;
  onFilterChange: (filters: Partial<CategoryFiltersState>) => void;
  onRefresh?: () => void;
}

export function CategoryFilters({
  filters,
  onFilterChange,
  onRefresh,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Ô tìm kiếm */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Tìm theo tên danh mục, mã phân loại #DM..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs"
        />
      </div>

      {/* Bộ lọc dropdown & nút làm mới */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Dropdown 1: Trạng thái QR */}
        <div className="relative">
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({
                statusFilter: e.target.value as 'ALL' | CategoryStatus,
              })
            }
            className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="VISIBLE">Đang hiển thị</option>
            <option value="HIDDEN">Đang ẩn</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Dropdown 2: Sắp xếp */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as CategoryFiltersState['sortBy'],
              })
            }
            className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs cursor-pointer"
          >
            <option value="MENU_ORDER">Sắp xếp: Thứ tự hiển thị menu</option>
            <option value="DISH_COUNT">Sắp xếp: Số món ăn giảm dần</option>
            <option value="NAME_ASC">Sắp xếp: Tên A-Z</option>
          </select>
          <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Nút Làm Mới */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Làm mới danh sách"
            className="p-2 bg-white border border-[#EAE3D6] text-[#7C7267] hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
