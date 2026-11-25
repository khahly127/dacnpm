'use strict';

import React from 'react';
import { TableItem } from '../../types/table';
import { TableCard } from './TableCard';
import { Armchair } from 'lucide-react';

interface TableGridViewProps {
  tables: TableItem[];
  onViewQr: (table: TableItem) => void;
  onEdit: (table: TableItem) => void;
  onDelete: (table: TableItem) => void;
  onPay?: (table: TableItem) => void;
}

export function TableGridView({ tables, onViewQr, onEdit, onDelete, onPay }: TableGridViewProps) {
  if (tables.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8A8175] mx-auto mb-3">
          <Armchair className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#2D241E]">Không tìm thấy bàn nào</h3>
        <p className="text-xs text-[#8A8175] mt-1">
          Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang bộ lọc trạng thái khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          onViewQr={onViewQr}
          onEdit={onEdit}
          onDelete={onDelete}
          onPay={onPay}
        />
      ))}
    </div>
  );
}
