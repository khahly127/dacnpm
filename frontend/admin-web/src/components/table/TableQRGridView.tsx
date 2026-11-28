'use strict';

import React from 'react';
import { TableItem } from '../../types/table';
import { TableQRCard } from './TableQRCard';
import { QrCode } from 'lucide-react';

interface TableQRGridViewProps {
  tables: TableItem[];
  onToggleQr: (id: string) => void;
  onDownloadPng: (table: TableItem) => void;
  onPrintSingle: (table: TableItem) => void;
}

export function TableQRGridView({
  tables,
  onToggleQr,
  onDownloadPng,
  onPrintSingle,
}: TableQRGridViewProps) {
  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8A8175] mx-auto mb-3">
          <QrCode className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#2D241E]">Không tìm thấy mã QR bàn nào</h3>
        <p className="text-xs text-[#8A8175] mt-1">
          Vui lòng thử tìm kiếm với tên bàn hoặc mã bàn khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableQRCard
          key={table.id}
          table={table}
          onToggleQr={onToggleQr}
          onDownloadPng={onDownloadPng}
          onPrintSingle={onPrintSingle}
        />
      ))}
    </div>
  );
}
