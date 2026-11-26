'use client';

import React from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface ConfirmationActionsProps {
  onConfirm: () => void;
  isSubmitting?: boolean;
}

export function ConfirmationActions({
  onConfirm,
  isSubmitting = false,
}: ConfirmationActionsProps) {
  return (
    <div className="pt-2 pb-6 w-full">
      {/* Nút chính: Xác nhận đặt món → (Full-width, to rõ, nổi bật) */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="w-full py-3.5 px-6 rounded-2xl bg-[#8B2323] hover:bg-[#781E1E] active:scale-[0.99] text-white text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(139,35,35,0.25)] transition-all cursor-pointer select-none disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Đang gửi đơn...</span>
          </>
        ) : (
          <>
            <span>Xác nhận đặt món</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5] shrink-0" />
          </>
        )}
      </button>
    </div>
  );
}
