'use client';

import React from 'react';
import { Search, ChevronDown, ArrowUpDown } from 'lucide-react';
import { UserFiltersState, UserRole, UserStatus } from '@/types/user';

interface UserFiltersProps {
  filters: UserFiltersState;
  onFilterChange: (newFilters: Partial<UserFiltersState>) => void;
}

export function UserFilters({ filters, onFilterChange }: UserFiltersProps) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-[#EAE3D6] shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-3">
      {/* Ô tìm kiếm */}
      <div className="relative w-full lg:flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A89E92]" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
          placeholder="Tìm theo tên nhân viên, mã #NV, username, số điện thoại..."
          className="w-full pl-10 pr-4 py-2 bg-[#FAF7F2] border border-[#EAE3D6] rounded-xl text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-all"
        />
      </div>

      {/* 3 Dropdown bộ lọc */}
      <div className="flex items-center gap-2.5 w-full lg:w-auto flex-wrap sm:flex-nowrap">
        {/* Dropdown 1: Vai trò */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filters.roleFilter}
            onChange={(e) => onFilterChange({ roleFilter: e.target.value as 'ALL' | UserRole })}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] hover:bg-[#FAF7F2] transition-colors cursor-pointer focus:outline-none"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="MANAGER">Quản lý</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Dropdown 2: Trạng thái */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filters.statusFilter}
            onChange={(e) => onFilterChange({ statusFilter: e.target.value as 'ALL' | UserStatus })}
            className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] hover:bg-[#FAF7F2] transition-colors cursor-pointer focus:outline-none"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Hoạt động</option>
            <option value="LOCKED">Tạm khóa</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>

        {/* Dropdown 3: Sắp xếp */}
        <div className="relative flex-1 sm:flex-none">
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as 'NEWEST' | 'OLDEST' | 'NAME_ASC' })}
            className="w-full sm:w-auto appearance-none pl-8 pr-8 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-semibold text-[#3C342F] hover:bg-[#FAF7F2] transition-colors cursor-pointer focus:outline-none"
          >
            <option value="NEWEST">Sắp xếp: Ngày tham gia mới nhất</option>
            <option value="NAME_ASC">Sắp xếp: Tên A-Z</option>
          </select>
          <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8175] pointer-events-none" />
        </div>
      </div>
    </div>
  );
}