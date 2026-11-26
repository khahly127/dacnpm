'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { ConfirmationHeader } from './ConfirmationHeader';
import { ConfirmationItemList } from './ConfirmationItemList';
import { ConfirmationBillSummary } from './ConfirmationBillSummary';
import { ConfirmationActions } from './ConfirmationActions';

interface OrderConfirmationScreenProps {
  onBackToCart: () => void;
  onConfirmOrder: () => void;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function OrderConfirmationScreen({
  onBackToCart,
  onConfirmOrder,
  isSubmitting = false,
  errorMessage,
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

      {errorMessage && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Nút hành động chính: Xác nhận đặt món (Full width) */}
      <ConfirmationActions
        onConfirm={onConfirmOrder}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
