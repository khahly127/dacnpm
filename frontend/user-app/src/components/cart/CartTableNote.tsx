'use client';

import React from 'react';
import { Utensils } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function CartTableNote() {
  const { tableNote, setTableNote } = useCart();

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs mb-3.5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <Utensils className="w-4 h-4 text-[#8B2323]" />
        <h3 className="text-sm font-bold text-[#231F20]">
          Ghi chú cho cả bàn
        </h3>
      </div>

      {/* Textarea */}
      <textarea
        value={tableNote}
        onChange={(e) => setTableNote(e.target.value)}
        rows={3}
        placeholder="Ví dụ: phục vụ món khai vị trước, mang thêm đá lạnh, chuẩn bị chén dĩa trẻ em..."
        className="w-full bg-[#FAF7F2] border border-[#EDE6DC] rounded-xl p-3 text-xs sm:text-sm text-[#231F20] placeholder:text-[#A89F91] outline-none focus:border-[#8B2323] transition-colors resize-none leading-relaxed"
      />
    </div>
  );
}
