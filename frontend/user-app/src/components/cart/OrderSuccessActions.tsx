'use client';

import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';

interface OrderSuccessActionsProps {
  onViewOrdered: () => void;
}

export function OrderSuccessActions({
  onViewOrdered,
}: OrderSuccessActionsProps) {
  return (
    <div className="pt-2 pb-6 w-full">
      {/* Nút duy nhất: Theo dõi trạng thái phục vụ → */}
      <button
        type="button"
        onClick={onViewOrdered}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#8B2323] hover:bg-[#781E1E] active:scale-[0.99] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(139,35,35,0.25)] transition-all cursor-pointer whitespace-nowrap select-none"
      >
        <Clock className="w-4 h-4 stroke-[2.2]" />
        <span>Theo dõi trạng thái phục vụ</span>
        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </div>
  );
}
