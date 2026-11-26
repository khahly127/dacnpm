'use strict';

import React from 'react';
import { TableItem } from '../../types/table';
import { QrCode, Edit2, Trash2, Star, Armchair, CreditCard } from 'lucide-react';

interface TableTableViewProps {
  tables: TableItem[];
  onViewQr: (table: TableItem) => void;
  onEdit: (table: TableItem) => void;
  onDelete: (table: TableItem) => void;
  onPay?: (table: TableItem) => void;
}

export function TableTableView({ tables, onViewQr, onEdit, onDelete, onPay }: TableTableViewProps) {
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
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="w-[22%] py-4 px-6 whitespace-nowrap">MÃ BÀN</th>
              <th className="w-[36%] py-4 px-6 whitespace-nowrap">TÊN BÀN</th>
              <th className="w-[24%] py-4 px-6 whitespace-nowrap">TRẠNG THÁI</th>
              <th className="w-[18%] py-4 px-6 text-right whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {tables.map((table) => {
              const isOccupied = table.status === 'occupied';
              const isAvailable = table.status === 'available';
              const isReserved = table.status === 'reserved';

              return (
                <tr
                  key={table.id}
                  className="hover:bg-[#FAF7F2]/70 transition-colors group"
                >
                  {/* Mã bàn */}
                  <td className="py-4 px-6 font-mono font-bold text-[#8B2323]">
                    #{table.code}
                  </td>

                  {/* Tên bàn */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#2D241E] text-sm">{table.name}</span>
                      {table.isVip && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF3E7] text-[#D97706] text-[10px] font-black">
                          <Star className="w-3 h-3 fill-current" />
                          VIP
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="py-4 px-6">
                    {isOccupied && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEECEC] text-[#D9383A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D9383A] animate-pulse" />
                        Có khách
                      </span>
                    )}
                    {isAvailable && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F5EFE6] text-[#6E6457]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Bàn trống
                      </span>
                    )}
                    {isReserved && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3E7] text-[#D97706]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                        Đặt trước
                      </span>
                    )}
                  </td>

                  {/* Thao tác */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
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
                      <button
                        type="button"
                        onClick={() => onViewQr(table)}
                        title="Xem mã QR"
                        className="p-2 rounded-lg border border-[#EAE3D6] bg-white text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
                      >
                        <QrCode className="w-4 h-4 text-[#8A8175]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(table)}
                        title="Chỉnh sửa bàn"
                        className="p-2 rounded-lg text-[#8A8175] hover:text-[#8B2323] hover:bg-[#FAF7F2] transition-all cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(table)}
                        title="Xóa bàn"
                        className="p-2 rounded-lg text-[#8A8175] hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
