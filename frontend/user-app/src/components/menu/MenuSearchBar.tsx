'use client';

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface MenuSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick?: () => void;
}

export function MenuSearchBar({
  value,
  onChange,
  onFilterClick,
}: MenuSearchBarProps) {
  return (
    <div className="w-full flex items-center gap-2.5 px-4 pt-3 pb-1">
      {/* Search Input Box */}
      <div className="flex-1 relative flex items-center bg-white rounded-full border border-[#EDE6DC] shadow-2xs px-3.5 py-2.5 focus-within:border-[#8B2323] focus-within:ring-2 focus-within:ring-[#8B2323]/10 transition-all">
        <Search className="w-4 h-4 text-[#A89F91] mr-2.5 shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Tìm món ngon, súp, bò nướng, đồ uống..."
          className="w-full bg-transparent border-none outline-none text-xs sm:text-sm text-[#231F20] placeholder:text-[#A89F91]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Icon Button */}
      <button
        type="button"
        onClick={onFilterClick}
        className="w-10 h-10 rounded-full bg-white border border-[#EDE6DC] shadow-2xs flex items-center justify-center text-[#5C5248] hover:text-[#8B2323] hover:border-[#8B2323]/30 active:scale-95 transition-all cursor-pointer shrink-0"
        aria-label="Bộ lọc"
      >
        <SlidersHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
