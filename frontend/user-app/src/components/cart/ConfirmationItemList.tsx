'use client';

import React from 'react';
import { ChefHat, Utensils } from 'lucide-react';
import { EnhancedCartItem } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

interface ConfirmationItemListProps {
  items: EnhancedCartItem[];
}

export function ConfirmationItemList({ items }: ConfirmationItemListProps) {
  const { distinctItemsCount, totalQuantity, tableNote } = useCart();

  return (
    <div className="w-full flex flex-col gap-2.5">
      {/* Tiêu đề section: Vạch đỏ + Danh sách món gọi + Badge số lượng */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#8B2323] rounded-full" />
          <h3 className="text-sm sm:text-base font-bold text-[#231F20]">
            Danh sách món gọi
          </h3>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5EFE6] text-[#7A6E62] border border-[#EAE3D6]">
          {distinctItemsCount} món • {totalQuantity} phần
        </span>
      </div>

      {/* Card danh sách các món ăn */}
      <div className="w-full bg-white rounded-2xl p-3.5 sm:p-4 border border-[#EDE6DC] shadow-xs divide-y divide-[#F2ECE4]">
        {items.map((item) => {
          const { dish, quantity, selectedOptions, note, unitPrice, totalPrice } = item;

          return (
            <div key={item.cartItemId} className="py-3 first:pt-0 last:pb-0 flex gap-3 items-start">
              {/* Ảnh món ăn */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-[#F7F2EA] border border-[#EAE3D6] relative">
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
                    <Utensils className="w-6 h-6" />
                  </div>
                )}
              </div>

              {/* Thông tin món */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                {/* Dòng 1: Tên món & Giá tiền */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-[#231F20] leading-snug line-clamp-1">
                    {dish.name}
                  </h4>
                  <span className="text-xs sm:text-sm font-extrabold text-[#8B2323] shrink-0">
                    {totalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Dòng 2: Các pills tùy chọn (Độ cay, Topping...) giống hệt bên Giỏ hàng */}
                {selectedOptions && selectedOptions.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOptions.map((opt) => (
                      <span
                        key={opt.optionId}
                        className="inline-block px-1.5 py-0.5 rounded-md bg-[#FAF7F2] border border-[#EDE6DC] text-[10px] text-[#7A6E62] font-medium"
                      >
                        {opt.optionName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Dòng 3: Ghi chú riêng cho món nếu có */}
                {note && (
                  <p className="text-[10px] text-[#8C7F72] italic mt-1 flex items-center gap-1 line-clamp-1">
                    <span>✍ Ghi chú:</span>
                    <span>{note}</span>
                  </p>
                )}

                {/* Dòng 4: Số lượng món */}
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F7F2EA]/80">
                  <span className="text-[11px] text-[#7A6E62] font-medium">
                    Số lượng:{' '}
                    <span className="font-bold text-[#231F20]">{quantity}</span>
                  </span>

                  {quantity > 1 && (
                    <span className="text-[10px] text-[#8C7F72] font-medium">
                      ({unitPrice.toLocaleString('vi-VN')}đ × {quantity})
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Khung Ghi chú gửi bếp nếu có */}
        {tableNote && tableNote.trim() && (
          <div className="pt-3 mt-1">
            <div className="w-full bg-[#FDF7F0] border border-[#F3E8DB] rounded-xl p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#8C745E] tracking-wider uppercase">
                <ChefHat className="w-3.5 h-3.5 text-[#8B2323]" />
                <span>Ghi chú gửi bếp</span>
              </div>
              <p className="text-xs text-[#5C5046] italic leading-relaxed">
                {tableNote}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
