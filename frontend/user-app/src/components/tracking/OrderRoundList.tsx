'use client';

import React, { useState } from 'react';
import { Utensils } from 'lucide-react';
import { TrackedOrderRound, TrackedDishItem, DishPreparationStatus } from '@/types/tracking';

interface OrderRoundListProps {
  rounds: TrackedOrderRound[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(amount);
}

function getStatusBadgeStyle(status: DishPreparationStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'WAITING_ACCEPT':
      return { bg: 'bg-[#FEFCE8]', text: 'text-[#CA8A04]', border: 'border-[#FEF08A]' };
    case 'COOKING':
      return { bg: 'bg-[#FFF4ED]', text: 'text-[#D9531E]', border: 'border-[#FBDBC9]' };
    case 'READY':
      return { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#BBF7D0]' };
    case 'SERVED':
      return { bg: 'bg-[#F5F5F5]', text: 'text-[#525252]', border: 'border-[#E5E5E5]' };
    case 'CANCELLED':
      return { bg: 'bg-[#FEF2F2]', text: 'text-[#B91C1C]', border: 'border-[#FECACA]' };
    default:
      return { bg: 'bg-[#FAF0E9]', text: 'text-[#8B2323]', border: 'border-[#FADCCB]' };
  }
}

function DishRowItem({ dish }: { dish: TrackedDishItem }) {
  const [imageError, setImageError] = useState(false);
  const badge = getStatusBadgeStyle(dish.status);

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EDE6DC] shadow-xs flex flex-col gap-2">
      <div className="flex gap-3 items-start">
        {/* Ảnh món ăn */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 bg-[#F7F2EA] border border-[#F0EBE1] flex items-center justify-center">
          {dish.image && !imageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <Utensils className="w-6 h-6 text-[#8B2323]/40" />
          )}
        </div>

        {/* Thông tin món & Trạng thái chế biến */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-[#231F20] leading-snug">
              {dish.name}
            </h4>
            <span className="text-xs font-black text-[#8B2323] shrink-0">
              x{dish.quantity}
            </span>
          </div>

          {/* Tùy chọn / Ghi chú đặc biệt */}
          {dish.optionsText && (
            <p className="text-[11px] text-[#7A6E62] mt-0.5 line-clamp-1">
              {dish.optionsText}
            </p>
          )}

          {/* Huy hiệu trạng thái món ăn */}
          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
            >
              {dish.statusText}
            </span>

            <span className="text-xs font-bold text-[#231F20]">
              {formatCurrency(dish.totalPrice)}đ
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

export function OrderRoundList({ rounds }: OrderRoundListProps) {
  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-[#8C7F72]">
        Chưa có món ăn nào trong phiên gọi món.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {rounds.map((round) => (
        <div key={round.orderId} className="flex flex-col gap-2">
          {/* Tiêu đề Đợt gọi + Mã phiếu */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8B2323]" />
              <span className="text-xs font-extrabold text-[#231F20]">
                {round.roundLabel}
              </span>
            </div>
            <span className="text-[11px] font-extrabold text-[#8B2323] bg-[#FDF2EC] border border-[#F6D8C8] px-2 py-0.5 rounded-md">
              Phiếu {round.orderCode}
            </span>
          </div>

          {/* Danh sách các món ăn trong đợt này */}
          <div className="flex flex-col gap-2">
            {round.dishes.map((dish) => (
              <DishRowItem key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
