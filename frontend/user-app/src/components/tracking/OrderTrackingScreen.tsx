'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, RefreshCw, Clock, Utensils } from 'lucide-react';
import { useTableSession } from '@/hooks/useTableSession';
import { API_BASE_URL } from '@/lib/utils';
import { TableTrackingSession } from '@/types/tracking';
import { trackingService } from '@/services/trackingService';
import { TableStatusCard } from './TableStatusCard';
import { ServiceProgressCard } from './ServiceProgressCard';
import { OrderRoundList } from './OrderRoundList';
import { TrackingBillSummary } from './TrackingBillSummary';

interface OrderTrackingScreenProps {
  onBack: () => void;
  onGoToMenu?: () => void;
  focusedOrderId?: number;
}

export function OrderTrackingScreen({
  onBack,
  onGoToMenu,
  focusedOrderId,
}: OrderTrackingScreenProps) {
  const { tableName, tableNumber } = useTableSession();
  const [session, setSession] = useState<TableTrackingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTrackingData = useCallback(async () => {
    try {
      const rawNum = parseInt(String(tableNumber).replace(/\D/g, ''), 10);
      const ma_ban = isNaN(rawNum) || rawNum <= 0 ? 5 : rawNum;

      const res = await fetch(`${API_BASE_URL}/orders/table/${ma_ban}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          let rawOrders = json.data;

          // Nếu người dùng chọn xem riêng 1 đơn cụ thể
          if (focusedOrderId) {
            const single = rawOrders.filter((o: { ma_don: number }) => o.ma_don === focusedOrderId);
            if (single.length > 0) {
              rawOrders = single;
            }
          }

          const parsedSession = trackingService.buildTableTrackingSession(
            rawOrders,
            tableName,
            tableNumber
          );
          setSession(parsedSession);
        }
      }
    } catch (err) {
      console.error('Lỗi khi tải tiến độ phục vụ:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [tableNumber, tableName, focusedOrderId]);

  useEffect(() => {
    fetchTrackingData();
  }, [fetchTrackingData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTrackingData();
  };

  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-4">
      {/* 1. Header: Nút quay lại + Tiêu đề + Nút làm mới */}
      <div className="w-full flex items-center justify-between pb-3 pt-1 border-b border-[#EFE9DF]">
        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 -ml-1 rounded-full hover:bg-black/5 active:scale-90 text-[#231F20] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
        </button>

        <h1 className="text-sm sm:text-base font-extrabold text-[#231F20] tracking-tight">
          Theo dõi trạng thái đơn hàng
        </h1>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-8 h-8 rounded-full hover:bg-black/5 text-[#5C5046] flex items-center justify-center transition-colors cursor-pointer"
          title="Làm mới trạng thái"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#8B2323]' : ''}`} />
        </button>
      </div>

      {/* 2. Nội dung chính */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-[#7A6E62]">
          <RefreshCw className="w-8 h-8 animate-spin text-[#8B2323] mb-3" />
          <p className="text-xs font-semibold">Đang cập nhật tiến độ phục vụ...</p>
        </div>
      ) : !session || session.rounds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="w-16 h-16 rounded-3xl bg-[#F5EFE6] flex items-center justify-center text-[#8B2323] mb-4 shadow-inner">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-[#231F20]">
            Chưa có đơn hàng nào cần theo dõi
          </h3>
          <p className="text-xs text-[#7A6E62] mt-1.5 max-w-[260px] leading-relaxed">
            Các món ăn bạn vừa gọi sẽ hiển thị chi tiết tiến độ bếp tại đây.
          </p>
          <button
            type="button"
            onClick={onGoToMenu || onBack}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#8B2323] hover:bg-[#781E1E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Utensils className="w-4 h-4" />
            <span>Xem thực đơn gọi món</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 pb-6">
          {/* Card 1: Bàn số & Mã phiếu gộp */}
          <TableStatusCard
            tableName={session.tableName}
            combinedCodesText={session.combinedCodesText}
          />

          {/* Card 2: Tiến độ phục vụ & Stepper 3 bước */}
          <ServiceProgressCard
            progressPercent={session.progressPercent}
            readyDishesCount={session.readyDishesCount}
            totalDishesCount={session.totalDishesCount}
            timelineStep={session.timelineStep}
            isConfirmed={session.isConfirmed}
            firstOrderTime={session.rounds[0]?.time}
          />

          {/* Card 3: Danh sách các món ăn gom nhóm theo đợt gọi */}
          <OrderRoundList rounds={session.rounds} />

          {/* Card 4: Tạm tính toàn bàn & Lời nhắc thanh toán */}
          <TrackingBillSummary
            grandTotal={session.grandTotal}
            totalDishesCount={session.totalDishesCount}
            breakdownText={session.breakdownText}
            dishesTotal={session.dishesTotal}
            vatAmount={session.vatAmount}
          />
        </div>
      )}
    </div>
  );
}
