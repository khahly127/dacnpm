'use client';

import React, { useState } from 'react';
import { Plus, Minus, Utensils, Ban } from 'lucide-react';
import { Dish } from '@/types/menu';
import { useCart } from '@/hooks/useCart';

interface DishCardProps {
  dish: Dish;
  onOpenDetail?: (dish: Dish) => void;
  onAddedToCart?: () => void;
}

export function DishCard({ dish, onOpenDetail, onAddedToCart }: DishCardProps) {
  const { getItemQuantity, addToCart, removeFromCart } = useCart();
  const quantity = getItemQuantity(dish.id);
  const [imageError, setImageError] = useState(false);

  const handleCardClick = () => {
    if (onOpenDetail) {
      onOpenDetail(dish);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EDE6DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex gap-3 sm:gap-3.5 items-center transition-all hover:border-[#E2D8CB]">
      {/* Dish Image - Clickable */}
      <div
        onClick={handleCardClick}
        className="relative w-22 h-22 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#F7F2EA] border border-[#EAE3D6] cursor-pointer group"
      >
        {dish.image && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dish.image}
            alt={dish.name}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              !dish.isAvailable ? 'grayscale-[60%] opacity-70' : ''
            }`}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#8B2323]/40">
            <Utensils className="w-8 h-8" />
          </div>
        )}

        {/* Tạm hết món Overlay Badge */}
        {!dish.isAvailable && (
          <div className="absolute inset-0 bg-black/45 flex items-center justify-center p-1">
            <span className="bg-black/75 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full text-center whitespace-nowrap">
              Tạm hết món
            </span>
          </div>
        )}
      </div>

      {/* Dish Information */}
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        {/* Title & Description - Clickable */}
        <div onClick={handleCardClick} className="cursor-pointer group">
          <h3 className="text-sm sm:text-[15px] font-bold text-[#231F20] leading-snug line-clamp-1 group-hover:text-[#8B2323] transition-colors">
            {dish.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-[#7A6E62] line-clamp-2 mt-1 leading-relaxed">
            {dish.description}
          </p>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex items-center justify-between mt-2.5">
          <span
            onClick={handleCardClick}
            className="text-sm sm:text-[15px] font-extrabold text-[#8B2323] tracking-tight cursor-pointer"
          >
            {dish.formattedPrice}
          </span>

          {/* Action Button */}
          {!dish.isAvailable ? (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2ECE4] text-[#A69C8E] text-[11px] font-medium cursor-not-allowed select-none">
              <Ban className="w-3 h-3" />
              <span>Hết hàng</span>
            </div>
          ) : quantity > 0 ? (
            /* Stepper: [-] [ quantity ] [+] */
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] shadow-2xs select-none">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCart(dish.id);
                }}
                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#8B2323] hover:bg-[#ECE4D8] active:scale-90 transition-all cursor-pointer shadow-xs"
                aria-label="Giảm"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-bold text-[#231F20] min-w-[14px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(dish);
                }}
                className="w-6 h-6 rounded-full bg-[#8B2323] text-white flex items-center justify-center hover:bg-[#781E1E] active:scale-90 transition-all cursor-pointer shadow-xs"
                aria-label="Tăng"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Add Button: Nút tròn dấu + */
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                addToCart(dish);
                if (onAddedToCart) {
                  onAddedToCart();
                }
              }}
              className="w-8 h-8 rounded-full bg-[#8B2323] hover:bg-[#781E1E] active:scale-90 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer"
              aria-label={`Thêm ${dish.name}`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
