'use client';

import React from 'react';
import { RotateCcw } from 'lucide-react';
import { EnhancedCartItem } from '@/types/cart';
import { CartItemRow } from './CartItemRow';
import { useCart } from '@/hooks/useCart';

interface CartItemListProps {
  items: EnhancedCartItem[];
  onAddMore?: () => void;
}

export function CartItemList({ items }: CartItemListProps) {
  const { distinctItemsCount, clearCart } = useCart();

  const handleResetCart = () => {
    if (window.confirm('Bạn có chắc muốn làm mới và xóa toàn bộ món trong giỏ hàng?')) {
      clearCart();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs mb-3.5">
      {/* Tiêu đề Card: Món đã chọn • X món | Làm mới */}
      <div className="flex items-center justify-between pb-2 border-b border-[#F0EBE1]">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-[#231F20]">
            Món đã chọn
          </h2>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F5EFE6] text-[#6E6457]">
            {distinctItemsCount} món
          </span>
        </div>

        {/* Nút Làm mới giỏ */}
        <button
          type="button"
          onClick={handleResetCart}
          className="flex items-center gap-1 text-xs text-[#7A6E62] hover:text-[#8B2323] transition-colors cursor-pointer font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Danh sách các món ăn */}
      <div className="divide-y divide-[#F0EBE1]">
        {items.map((item) => (
          <CartItemRow key={item.cartItemId} item={item} />
        ))}
      </div>
    </div>
  );
}
