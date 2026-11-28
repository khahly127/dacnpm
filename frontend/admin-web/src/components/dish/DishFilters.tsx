'use client';

import React from 'react';
import { Search, ChevronDown, RotateCw, ArrowUpDown } from 'lucide-react';
import { DishFiltersState, DishStatus } from '@/types/dish';

interface DishFiltersProps {
  filters: DishFiltersState;
  categories: Array<{ id: number; name: string }>;
  onFilterChange: (filters: Partial<DishFiltersState>) => void;
  onRefresh?: () => void;
}

export function DishFilters({
  filters,
  categories,
  onFilterChange,
  onRefresh,
}: DishFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
      {/* Cụm tìm kiếm và chọn danh mục */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-2xl">
        {/* Ô tìm kiếm */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Tìm kiếm theo tên món, mã #MA..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs"
          />
        </div>

        {/* Dropdown chọn danh mục */}
        <div className="relative min-w-[180px]">
          <select
            value={filters.categoryFilter}
            onChange={(e) =>
              onFilterChange({
                categoryFilter: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value),
              })
            }
            className="w-full appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs cursor-pointer"
          >
            <option value="ALL">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>
      </div>

      {/* Cụm lọc trạng thái & sắp xếp */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
        {/* Dropdown Trạng thái */}
        <div className="relative">
          <select
            value={filters.statusFilter}
            onChange={(e) =>
              onFilterChange({
                statusFilter: e.target.value as 'ALL' | DishStatus,
              })
            }
            className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs cursor-pointer"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="AVAILABLE">Đang phục vụ</option>
            <option value="OUT_OF_STOCK">Tạm hết món</option>
            <option value="HIDDEN">Đã ẩn (Kho)</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Dropdown Sắp xếp */}
        <div className="relative">
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as DishFiltersState['sortBy'],
              })
            }
            className="appearance-none pl-8 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] focus:outline-none focus:border-[#8E2813] transition-colors shadow-2xs cursor-pointer"
          >
            <option value="NEWEST">Sắp xếp: Mới nhất</option>
            <option value="PRICE_ASC">Giá tăng dần</option>
            <option value="PRICE_DESC">Giá giảm dần</option>
            <option value="NAME_ASC">Tên A-Z</option>
          </select>
          <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Nút Làm Mới */}
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            title="Làm mới danh sách món ăn"
            className="p-2 bg-white border border-[#EAE3D6] text-[#7C7267] hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-xl transition-colors shadow-2xs cursor-pointer shrink-0"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
