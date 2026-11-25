'use client';

import React, { useState } from 'react';
import { Trash2, Plus, Minus, Utensils } from 'lucide-react';
import { EnhancedCartItem } from '@/types/cart';
import { useCart } from '@/hooks/useCart';

interface CartItemRowProps {
  item: EnhancedCartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { updateItemQuantity, removeCartItem } = useCart();
  const [imgError, setImgError] = useState(false);

  const { dish, quantity, selectedOptions, note, unitPrice, totalPrice } = item;

  return (
    <div className="w-full flex gap-3 py-3 items-start">
      {/* Ảnh món ăn */}
      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden shrink-0 bg-[#F7F2EA] border border-[#EAE3D6] relative">
        {dish.image && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B2323]/40">
            <Utensils className="w-7 h-7" />
          </div>
        )}
      </div>

      {/* Thông tin món & Tùy chọn */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-xs sm:text-sm font-bold text-[#231F20] leading-snug line-clamp-1">
            {dish.name}
          </h4>
          {/* Nút xóa món khỏi giỏ */}
          <button
            type="button"
            onClick={() => removeCartItem(item.cartItemId)}
            className="p-1 rounded-md text-[#9E9385] hover:text-[#8B2323] hover:bg-[#FDF2EC] transition-colors cursor-pointer shrink-0"
            aria-label="Xóa món"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Các pills tùy chọn (Độ chín, Sốt, Topping...) */}
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

        {/* Ghi chú bếp */}
        {note && (
          <p className="text-[10px] text-[#8C7F72] italic mt-1 flex items-center gap-1 line-clamp-1">
            <span>✍ Ghi chú:</span>
            <span>{note}</span>
          </p>
        )}

        {/* Dòng giá tiền & Stepper tăng giảm */}
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex items-baseline gap-1">
            <span className="text-xs sm:text-sm font-extrabold text-[#231F20]">
              {totalPrice.toLocaleString('vi-VN')}đ
            </span>
            {quantity > 1 && (
              <span className="text-[10px] text-[#8C7F72] font-medium">
                ({(unitPrice / 1000).toLocaleString('vi-VN')}k × {quantity})
              </span>
            )}
          </div>

          {/* Stepper pill */}
          <div className="flex items-center gap-1.5 p-0.5 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] shadow-2xs select-none">
            <button
              type="button"
              onClick={() => updateItemQuantity(item.cartItemId, quantity - 1)}
              className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[#8B2323] hover:bg-[#ECE4D8] active:scale-90 transition-all cursor-pointer shadow-xs"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-[#231F20] min-w-[14px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => updateItemQuantity(item.cartItemId, quantity + 1)}
              className="w-5 h-5 rounded-full bg-[#8B2323] text-white flex items-center justify-center hover:bg-[#781E1E] active:scale-90 transition-all cursor-pointer shadow-xs"
              aria-label="Tăng số lượng"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
