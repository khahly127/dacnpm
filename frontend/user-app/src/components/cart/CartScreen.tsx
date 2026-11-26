'use client';

import React from 'react';
import { ArrowRight, ShoppingBag, Utensils } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { CartHeader } from './CartHeader';
import { CartItemList } from './CartItemList';
import { CartTableNote } from './CartTableNote';
import { CartBillSummary } from './CartBillSummary';

interface CartScreenProps {
  onBackToMenu: () => void;
  onProceedToConfirm: () => void;
}

export function CartScreen({
  onBackToMenu,
  onProceedToConfirm,
}: CartScreenProps) {
  const { cartItems, distinctItemsCount } = useCart();

  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-3">
      {/* Tiêu đề giỏ hàng nằm trong nội dung ở giữa */}
      <CartHeader onClose={onBackToMenu} />

      {distinctItemsCount === 0 ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F5EFE6] flex items-center justify-center text-[#8B2323] mb-4 shadow-inner">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#231F20]">
            Giỏ hàng của bạn đang trống
          </h3>
          <p className="text-xs text-[#7A6E62] mt-1.5 max-w-[260px] leading-relaxed">
            Hãy khám phá thực đơn phong phú của Casa Cozy Bistro và chọn những món ăn hấp dẫn nhé!
          </p>
          <button
            type="button"
            onClick={onBackToMenu}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#8B2323] hover:bg-[#781E1E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Khám phá thực đơn ngay</span>
          </button>
        </div>
      ) : (
        <>
          {/* Card 1: Món đã chọn */}
          <CartItemList items={cartItems} />

          {/* Card 2: Ghi chú cho cả bàn */}
          <CartTableNote />

          {/* Card 3: Chi tiết tạm tính */}
          <CartBillSummary />

          {/* Nút đặt món: Chuyển sang Màn hình xác nhận đặt món */}
          <div className="pt-1 pb-4">
            <button
              type="button"
              onClick={onProceedToConfirm}
              className="w-full bg-[#8B2323] hover:bg-[#781E1E] active:scale-[0.99] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-[0_4px_16px_rgba(139,35,35,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Đặt món</span>
              <ArrowRight className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
