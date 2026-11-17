import React from 'react';
import { UtensilsCrossed, ArrowRight, Bell, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onStartOrdering: () => void;
  onCallStaff: () => void;
  isCallingStaff?: boolean;
}

export function ActionButtons({
  onStartOrdering,
  onCallStaff,
  isCallingStaff = false,
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

      {/* Secondary Action: Gọi nhân viên */}
      <button
        type="button"
        onClick={onCallStaff}
        disabled={isCallingStaff}
        className="w-full bg-[#F5EFE6] hover:bg-[#ECE4D8] active:scale-[0.99] text-[#4A3B32] border border-[#E5DCD0] font-medium text-[14px] sm:text-[15px] py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-60 shadow-sm"
      >
        {isCallingStaff ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-[#8B2323]" />
            <span>Đang gọi nhân viên...</span>
          </>
        ) : (
          <>
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B2323]" />
            <span>Gọi nhân viên</span>
          </>
        )}
      </button>
    </div>
  );
}
