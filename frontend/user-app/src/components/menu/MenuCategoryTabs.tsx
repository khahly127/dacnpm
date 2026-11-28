'use client';

import React from 'react';
import {
  Utensils,
  Wine,
  CookingPot,
  Soup,
  IceCream,
  Coffee,
  Beer,
} from 'lucide-react';
import { CategoryItem } from '@/types/menu';

interface MenuCategoryTabsProps {
  categories: CategoryItem[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
  totalDishesCount: number;
}

function getCategoryIcon(name: string, isSelected: boolean) {
  const iconClass = `w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-[#8B2323]'}`;
  const lower = name.toLowerCase();

  if (lower.includes('khai vị')) return <Wine className={iconClass} />;
  if (lower.includes('chính')) return <CookingPot className={iconClass} />;
  if (lower.includes('lẩu')) return <Soup className={iconClass} />;
  if (lower.includes('tráng miệng')) return <IceCream className={iconClass} />;
  if (lower.includes('uống')) return <Coffee className={iconClass} />;
  if (lower.includes('nhậu')) return <Beer className={iconClass} />;
  return <Utensils className={iconClass} />;
}

export function MenuCategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
  totalDishesCount,
}: MenuCategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2.5 px-4">
      <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
        {/* Tab "Tất cả" */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
            selectedCategoryId === null
              ? 'bg-[#8B2323] text-white shadow-xs'
              : 'bg-white/90 text-[#4A3B32] border border-[#EAE3D6] hover:bg-white'
          }`}
        >
          <Utensils className="w-3.5 h-3.5 shrink-0" />
          <span>Tất cả</span>
          <span
            className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
              selectedCategoryId === null
                ? 'bg-white/20 text-white'
                : 'bg-[#F2ECE4] text-[#7A6E62]'
            }`}
          >
            {totalDishesCount}
          </span>
        </button>

        {/* Dynamic Categories from DB */}
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer select-none active:scale-95 ${
                isSelected
                  ? 'bg-[#8B2323] text-white shadow-xs'
                  : 'bg-white/90 text-[#4A3B32] border border-[#EAE3D6] hover:bg-white'
              }`}
            >
              {getCategoryIcon(cat.name, isSelected)}
              <span>{cat.name}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F2ECE4] text-[#7A6E62]'
                }`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
