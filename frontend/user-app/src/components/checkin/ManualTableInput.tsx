'use client';

import React from 'react';
import { Armchair, ArrowRight, AlertCircle } from 'lucide-react';

interface ManualTableInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val?: string) => void;
  error: string | null;
}

export function ManualTableInput({
  value,
  onChange,
  onSubmit,
  error,
}: ManualTableInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="w-full mt-4">
      {/* 1. Đường kẻ phân cách tinh tế */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-[#EAE3D6] w-full" />
        <span className="bg-[#FAF7F2] px-3 text-[11px] font-bold text-[#8A7E72] uppercase tracking-wider absolute">
          Hoặc nhập số bàn thủ công
        </span>
      </div>

      {/* 2. Form nhập số bàn 1 dòng duy nhất (Hướng 1: áp dụng cho 1 - 100 bàn) */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-center gap-2">
          {/* Ô nhập số bàn */}
          <div className="relative flex-1 flex items-center bg-white rounded-xl border border-[#EAE3D6] shadow-2xs px-3.5 py-2.5 focus-within:border-[#8E2813] focus-within:ring-2 focus-within:ring-[#8E2813]/10 transition-all">
            <Armchair className="w-4 h-4 text-[#8A7E72] mr-2.5 shrink-0" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Số bàn (Ví dụ: 05, 12, 88...)"
              maxLength={4}
              className="w-full bg-transparent border-none outline-none text-xs sm:text-sm font-semibold text-[#231F20] placeholder:text-[#A89E92]"
            />
          </div>

          {/* Nút bấm Vào bàn */}
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#8E2813] hover:bg-[#73200F] active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>Vào bàn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thông báo lỗi nếu số bàn vượt quá 100 hoặc không hợp lệ */}
        {error && (
          <div className="flex items-center gap-1.5 text-left mt-2 px-1 text-[11px] font-medium text-[#DC2626]">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
