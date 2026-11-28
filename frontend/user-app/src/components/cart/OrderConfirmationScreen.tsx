'use client';

import React from 'react';
import { useCart } from '@/hooks/useCart';
import { ConfirmationHeader } from './ConfirmationHeader';
import { ConfirmationItemList } from './ConfirmationItemList';
import { ConfirmationBillSummary } from './ConfirmationBillSummary';
import { ConfirmationActions } from './ConfirmationActions';

interface OrderConfirmationScreenProps {
  onBackToCart: () => void;
  onConfirmOrder: () => void;
  isSubmitting?: boolean;
}

export function OrderConfirmationScreen({
  onBackToCart,
  onConfirmOrder,
  isSubmitting = false,
}: OrderConfirmationScreenProps) {
  const { cartItems } = useCart();

  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-3.5 animate-fade-in">
      {/* Tiêu đề xác nhận đặt món nằm trong nội dung ở giữa */}
      <ConfirmationHeader onBack={onBackToCart} />

      {/* Danh sách các món ăn đã gọi & ghi chú bếp */}
      <ConfirmationItemList items={cartItems} />

      {/* Chi tiết thanh toán */}
      <ConfirmationBillSummary />

      {/* Nút hành động chính: Xác nhận đặt món (Full width) */}
      <ConfirmationActions
        onConfirm={onConfirmOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
