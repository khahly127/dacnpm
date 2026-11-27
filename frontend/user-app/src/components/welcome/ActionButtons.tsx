import React from 'react';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

interface ActionButtonsProps {
  onStartOrdering: () => void;
}

export function ActionButtons({
  onStartOrdering,
}: ActionButtonsProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Primary Action: Bắt đầu gọi món */}
      <button
        type="button"
        onClick={onStartOrdering}
        className="w-full bg-[#8B2323] hover:bg-[#781E1E] active:scale-[0.99] text-white font-semibold text-[15px] sm:text-base py-3.5 sm:py-4 px-6 rounded-2xl shadow-[0_4px_14px_rgba(139,35,35,0.22)] flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer group"
      >
        <UtensilsCrossed className="w-5 h-5 transition-transform group-hover:rotate-12" />
        <span>Bắt đầu gọi món</span>
        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
