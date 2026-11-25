'use client';

import React from 'react';
import { UtensilsCrossed, Utensils } from 'lucide-react';
import { EnhancedCartItem } from '@/types/cart';

interface OrderSuccessItemListProps {
  items: EnhancedCartItem[];
  grandTotal: number;
}

export function OrderSuccessItemList({
  items,
  grandTotal,
}: OrderSuccessItemListProps) {
  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs flex flex-col gap-3">
      {/* Header: Món vừa đặt & Badge Đã xác nhận */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F2EA]">
        <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#231F20]">
          <UtensilsCrossed className="w-4 h-4 text-[#8B2323]" />
          <span>Món vừa đặt ({items.length} món)</span>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6E62] border border-[#EAE3D6]">
          Đã xác nhận
        </span>
      </div>

      {/* Danh sách các món ăn vừa đặt */}
      <div className="divide-y divide-[#F5EFE6]">
        {items.map((item) => {
          const { dish, quantity, selectedOptions, totalPrice } = item;
          const optionsText = selectedOptions?.map((o) => o.optionName).join(', ');

          return (
            <div
              key={item.cartItemId}
              className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-3"
            >
              {/* Ảnh món ăn */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden shrink-0 bg-[#F7F2EA] border border-[#EAE3D6] relative">
                {dish.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#8B2323]/40">
                    <Utensils className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Thông tin món */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs sm:text-sm font-bold text-[#231F20] leading-snug line-clamp-1">
                    {dish.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-bold text-[#231F20] shrink-0">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Dòng chi tiết: Số lượng & tùy chọn */}
                <p className="text-[11px] text-[#7A6E62] mt-0.5 line-clamp-1">
                  SL: x{quantity}
                  {optionsText ? ` • ${optionsText}` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Khung tổng tiền dự kiến màu cam/hồng nhạt */}
      <div className="w-full bg-[#FDF4ED] border border-[#F8DEC0] rounded-xl p-3 flex items-center justify-between mt-1">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#231F20]">
            Tổng dự kiến (gồm VAT)
          </span>
          <span className="text-[10px] text-[#7A6E62] mt-0.5 font-medium">
            Thanh toán sau bữa ăn
          </span>
        </div>

        <span className="text-base sm:text-lg font-black text-[#8B2323] tracking-tight">
          {grandTotal.toLocaleString('vi-VN')}đ
        </span>
      </div>
    </div>
  );
}
