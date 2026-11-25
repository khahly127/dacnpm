'use strict';

import React from 'react';
import { Armchair, QrCode, Edit2, Trash2, CreditCard } from 'lucide-react';
import { TableItem } from '../../types/table';

interface TableCardProps {
  table: TableItem;
  onViewQr: (table: TableItem) => void;
  onEdit: (table: TableItem) => void;
  onDelete: (table: TableItem) => void;
  onPay?: (table: TableItem) => void;
}

export function TableCard({ table, onViewQr, onEdit, onDelete, onPay }: TableCardProps) {
  const isOccupied = table.status === 'occupied';
  const isAvailable = table.status === 'available';
  const isReserved = table.status === 'reserved';

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-[#EAE3D6] transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs hover:border-[#D8CFBF]">
      {/* Top Section: Tên bàn & Trạng thái */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                isOccupied
                  ? 'bg-[#FEECEC] text-[#D9383A] border-[#FCD2D2]'
                  : isReserved
                  ? 'bg-[#FEF3E7] text-[#D97706] border-[#FDE5CA]'
                  : 'bg-[#FAF7F2] text-[#8A8175] border-[#EAE3D6]'
              }`}
            >
              <Armchair className="w-5 h-5" />
            </div>

            <h3 className="text-base font-black text-[#2D241E] tracking-tight">
              {table.name}
            </h3>
          </div>

          <div>
            {isOccupied && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEECEC] text-[#D9383A]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A] animate-pulse" />
                Có khách
              </span>
            )}
            {isAvailable && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#6E6457]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                Bàn trống
              </span>
            )}
            {isReserved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3E7] text-[#D97706]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                Đặt trước
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer: Xem QR + Thanh toán + Edit + Delete */}
      <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-[#F5EFE6]">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onViewQr(table)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#EAE3D6] bg-white text-xs font-semibold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#8A8175]" />
            <span>QR</span>
          </button>

          {isOccupied && onPay && (
            <button
              type="button"
              onClick={() => onPay(table)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Mở thanh toán tổng hợp bàn"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Thanh toán</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#8A8175]">
          <button
            type="button"
            title="Chỉnh sửa bàn"
            onClick={() => onEdit(table)}
            className="p-1.5 hover:text-[#8B2323] hover:bg-[#FAF7F2] rounded-md transition-all cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="Xóa bàn"
            onClick={() => onDelete(table)}
            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
