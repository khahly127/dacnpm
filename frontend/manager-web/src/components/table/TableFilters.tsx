'use strict';

import React from 'react';
import { Search, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import { TableFilterTab, TableDisplayLayout } from '../../types/table';

interface TableFiltersProps {
  filterTab: TableFilterTab;
  onFilterTabChange: (tab: TableFilterTab) => void;
  displayLayout: TableDisplayLayout;
  onDisplayLayoutChange: (layout: TableDisplayLayout) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tabCounts: {
    all: number;
    occupied: number;
    available: number;
    reserved: number;
  };
  onOpenCreateModal: () => void;
}

export function TableFilters({
  filterTab,
  onFilterTabChange,
  displayLayout,
  onDisplayLayoutChange,
  searchQuery,
  onSearchChange,
  tabCounts,
  onOpenCreateModal,
}: TableFiltersProps) {
  // Toggle button between Grid (Lưới) and Table (Bảng)
  const layoutToggle = (
    <div className="flex items-center bg-[#F5EFE6] p-1 rounded-xl border border-[#EAE3D6] shrink-0">
      <button
        type="button"
        title="Chế độ xem dạng lưới (Cards)"
        onClick={() => onDisplayLayoutChange('grid')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          displayLayout === 'grid'
            ? 'bg-white text-[#8B2323] shadow-xs'
            : 'text-[#6E6457] hover:text-[#2D241E]'
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Lưới</span>
      </button>
      <button
        type="button"
        title="Chế độ xem dạng bảng (Table)"
        onClick={() => onDisplayLayoutChange('table')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          displayLayout === 'table'
            ? 'bg-white text-[#8B2323] shadow-xs'
            : 'text-[#6E6457] hover:text-[#2D241E]'
        }`}
      >
        <LayoutList className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Bảng</span>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
      {/* Status filter tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <button
          type="button"
          onClick={() => onFilterTabChange('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'all'
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'bg-white text-[#6E6457] border border-[#EAE3D6] hover:bg-[#FAF7F2]'
          }`}
        >
          Tất cả ({tabCounts.all})
        </button>
        <button
          type="button"
          onClick={() => onFilterTabChange('occupied')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'occupied'
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'bg-white text-[#6E6457] border border-[#EAE3D6] hover:bg-[#FAF7F2]'
          }`}
        >
          Đang có khách ({tabCounts.occupied})
        </button>
        <button
          type="button"
          onClick={() => onFilterTabChange('available')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'available'
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'bg-white text-[#6E6457] border border-[#EAE3D6] hover:bg-[#FAF7F2]'
          }`}
        >
          Bàn trống ({tabCounts.available})
        </button>
        <button
          type="button"
          onClick={() => onFilterTabChange('reserved')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            filterTab === 'reserved'
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'bg-white text-[#6E6457] border border-[#EAE3D6] hover:bg-[#FAF7F2]'
          }`}
        >
          Đặt trước ({tabCounts.reserved})
        </button>
      </div>

      {/* Search + Layout Toggle + Add button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:w-56">
          <Search className="w-4 h-4 text-[#8A8175] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm mã bàn, tên bàn..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs text-[#2D241E] placeholder-[#8A8175] focus:outline-none focus:border-[#8B2323] transition-all"
          />
        </div>

        {/* Nút chuyển đổi Lưới / Bảng */}
        {layoutToggle}

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#8B2323] text-white text-xs font-bold rounded-xl hover:bg-[#731B1B] shadow-xs shrink-0 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Bàn Mới</span>
        </button>
      </div>
    </div>
  );
}
