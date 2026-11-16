'use strict';

import React from 'react';
import { Armchair, Star, Calendar, QrCode, Edit2, Trash2, Sparkles } from 'lucide-react';
import { TableItem } from '../../types/table';

interface TableCardProps {
  table: TableItem;
  onViewQr: (table: TableItem) => void;
  onEdit: (table: TableItem) => void;
  onDelete: (table: TableItem) => void;
}

export function TableCard({ table, onViewQr, onEdit, onDelete }: TableCardProps) {
  const isOccupied = table.status === 'occupied';
  const isAvailable = table.status === 'available';
  const isReserved = table.status === 'reserved';

  return (
    <div
      className={`bg-white rounded-2xl p-4.5 border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs ${
        table.isVip
          ? 'border-[#E6D4B9] bg-gradient-to-b from-[#FFFDF9] to-white'
          : 'border-[#EAE3D6]'
      }`}
    >
      <div>
        {/* Card Header: Table name + Badge + Area Icon */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-black text-[#2D241E] tracking-tight">
              {table.name}
            </h3>
            {isOccupied && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEECEC] text-[#D9383A]">
                Có khách
              </span>
            )}
            {isAvailable && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#6E6457]">
                Bàn trống
              </span>
            )}
            {isReserved && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3E7] text-[#D97706]">
                Đặt trước {table.reservedInfo?.reservedTime || ''}
              </span>
            )}
          </div>

          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
              table.isVip
                ? 'bg-[#FEF3E7] text-[#D97706] border-[#FDE5CA]'
                : isReserved
                ? 'bg-[#FEF3E7] text-[#D97706] border-[#FDE5CA]'
                : isAvailable
                ? 'bg-[#FAF7F2] text-[#8A8175] border-[#EAE3D6]'
                : 'bg-[#FEECEC] text-[#D9383A] border-[#FCD2D2]'
            }`}
          >
            {table.isVip ? (
              <Star className="w-3.5 h-3.5 fill-current" />
            ) : isReserved ? (
              <Calendar className="w-3.5 h-3.5" />
            ) : isAvailable ? (
              <Sparkles className="w-3.5 h-3.5" />
            ) : (
              <Armchair className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* Subtitle: Seats & Area info */}
        <p className="text-xs text-[#8A8175] mt-1 font-medium">
          {table.isVip
            ? `${table.seats} Ghế VIP`
            : isReserved && table.reservedInfo?.guestCount
            ? `${table.seats} Ghế • ${table.reservedInfo.guestCount} khách`
            : `${table.seats} Ghế tiêu chuẩn`}
        </p>

        {/* Content Box */}
        <div className="bg-[#FAF7F2] rounded-xl p-3 my-3 text-xs border border-[#F3EDE2] space-y-1.5">
          {isOccupied && table.vipInfo ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Đặt trước bởi:</span>
                <span className="font-bold text-[#8B2323]">
                  {table.vipInfo.bookedBy}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Thiết bị quét:</span>
                <span className="font-semibold text-[#2D241E]">
                  {table.vipInfo.devicesConnected}
                </span>
              </div>
            </>
          ) : isOccupied && table.occupiedInfo ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Đơn hiện tại:</span>
                <span className="font-bold text-[#8B2323]">
                  • {table.occupiedInfo.orderCode} ({table.occupiedInfo.dishCount} món)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Thời gian ngồi:</span>
                <span className="font-semibold text-[#2D241E]">
                  {table.occupiedInfo.duration}
                </span>
              </div>
            </>
          ) : isAvailable && table.availableInfo ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Trạng thái:</span>
                <span className="font-semibold text-[#10B981]">
                  {table.availableInfo.statusText}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Lần dọn gần nhất:</span>
                <span className="font-medium text-[#6E6457]">
                  {table.availableInfo.lastCleaned}
                </span>
              </div>
            </>
          ) : isReserved && table.reservedInfo ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Khách đặt:</span>
                <span className="font-semibold text-[#2D241E]">
                  {table.reservedInfo.guestName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A8175] font-medium">Ghi chú:</span>
                <span className="font-medium text-[#6E6457]">
                  {table.reservedInfo.note}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center text-[#8A8175] py-1">
              Chưa có thông tin phục vụ
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Xem QR + Edit + Delete */}
      <div className="flex items-center justify-between pt-1 border-t border-[#F5EFE6]">
        <button
          type="button"
          onClick={() => onViewQr(table)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EAE3D6] bg-white text-xs font-semibold text-[#5C5449] hover:bg-[#FAF7F2] transition-all cursor-pointer"
        >
          <QrCode className="w-3.5 h-3.5 text-[#8A8175]" />
          <span>Xem QR</span>
        </button>

        <div className="flex items-center gap-1 text-[#8A8175]">
          <button
            type="button"
            title="Chỉnh sửa bàn"
            onClick={() => onEdit(table)}
            className="p-1.5 hover:text-[#8B2323] hover:bg-[#FAF7F2] rounded-md transition-all cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Xóa bàn"
            onClick={() => onDelete(table)}
            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
