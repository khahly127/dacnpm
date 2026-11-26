'use client';

import React from 'react';

interface TableStatusCardProps {
  tableName: string;
  combinedCodesText: string;
}

export function TableStatusCard({
  tableName,
  combinedCodesText,
}: TableStatusCardProps) {
  return (
    <div className="w-full bg-[#FAF4EC] rounded-2xl p-4 border border-[#EDE5D8] shadow-2xs">
      {/* Tên bàn */}
      <h2 className="text-base font-extrabold text-[#231F20] tracking-tight">
        {tableName}
      </h2>

      {/* Mã phiếu gộp theo đợt gọi */}
      <p className="text-xs text-[#5C5046] mt-1 font-medium">
        {combinedCodesText}
      </p>
    </div>
  );
}
