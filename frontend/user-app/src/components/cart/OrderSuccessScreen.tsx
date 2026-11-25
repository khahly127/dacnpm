'use client';

import React from 'react';
import { OrderSuccessData } from '@/types/order';
import { OrderSuccessHeader } from './OrderSuccessHeader';
import { OrderServiceTimeline } from './OrderServiceTimeline';
import { OrderSuccessItemList } from './OrderSuccessItemList';
import { OrderSuccessActions } from './OrderSuccessActions';

interface OrderSuccessScreenProps {
  data: OrderSuccessData;
  onViewOrdered: () => void;
  onBackToMenu?: () => void;
}

export function OrderSuccessScreen({
  data,
  onViewOrdered,
}: OrderSuccessScreenProps) {
  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-3.5 animate-fade-in">
      {/* 1. Header: Biểu tượng thành công, tiêu đề, bàn & thời gian */}
      <OrderSuccessHeader data={data} />

      {/* 2. Card tiến độ phục vụ: Chờ tiếp nhận -> Đang chế biến -> Lên bàn */}
      <OrderServiceTimeline time={data.time} />

      {/* 3. Card danh sách món vừa đặt kèm tổng tiền */}
      <OrderSuccessItemList items={data.items} grandTotal={data.grandTotal} />

      {/* 4. Nút hành động duy nhất: Theo dõi trạng thái phục vụ */}
      <OrderSuccessActions onViewOrdered={onViewOrdered} />
    </div>
  );
}
