'use client';

import React from 'react';
import { DashboardTimeRange } from '@/types/dashboard';
import { Calendar } from 'lucide-react';

interface DashboardTimeFilterProps {
  selected: DashboardTimeRange;
  onChange: (range: DashboardTimeRange) => void;
}

export const TIME_RANGE_OPTIONS: { id: DashboardTimeRange; label: string }[] = [
  { id: 'TODAY', label: 'Hôm nay' },
  { id: '7_DAYS', label: '7 ngày' },
  { id: 'THIS_MONTH', label: 'Tháng này' },
  { id: 'THIS_YEAR', label: 'Năm nay' },
  { id: 'ALL', label: 'Tất cả' },
];

export function DashboardTimeFilter({ selected, onChange }: DashboardTimeFilterProps) {
  return (
    <div className="inline-flex items-center gap-1 p-1 bg-[#F5EFE6] border border-[#EAE3D6] rounded-xl shadow-2xs">
      <div className="pl-2 pr-1 text-[#8A8175] hidden sm:flex items-center">
        <Calendar className="w-3.5 h-3.5" />
      </div>
      {TIME_RANGE_OPTIONS.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              isSelected
                ? 'bg-[#8E2813] text-white shadow-xs'
                : 'text-[#6E6457] hover:text-[#26201E] hover:bg-[#EAE3D6]/50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
