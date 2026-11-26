'use client';

import React, { useEffect, useState } from 'react';
import { Utensils, Clock, RefreshCw, ArrowLeft, ChevronRight, CookingPot, TrendingUp, ReceiptText, Info } from 'lucide-react';
import { useTableSession } from '@/hooks/useTableSession';
import { API_BASE_URL } from '@/lib/utils';
import { OrderTrackingScreen } from '@/components/tracking/OrderTrackingScreen';

interface OrderedItem {
  ma_ct?: number;
  ma_chi_tiet?: number;
  ma_mon?: number;
  ten_mon?: string;
  monan?: {
    ma_mon?: number;
    ten_mon: string;
    hinh_anh?: string;
  };
  so_luong: number;
  don_gia: number;
  ghi_chu?: string;
  trang_thai?: string;
}

interface TableOrder {
  ma_don: number;
  trang_thai: string;
  thoi_gian_tao: string;
  tong_tien: number;
  chitietdonhang?: OrderedItem[];
}

interface OrderedDishesScreenProps {
  onBackToMenu: () => void;
  initialOrderId?: number;
}

export function OrderedDishesScreen({ onBackToMenu, initialOrderId }: OrderedDishesScreenProps) {
  const { tableName, tableNumber } = useTableSession();
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Quản lý trạng thái mở Màn hình theo dõi trạng thái chi tiết (khung tiến độ như mockup)
  const [isViewingTracking, setIsViewingTracking] = useState(Boolean(initialOrderId));
  const [focusedOrderId, setFocusedOrderId] = useState<number | undefined>(initialOrderId);

  useEffect(() => {
    if (initialOrderId) {
      setFocusedOrderId(initialOrderId);
      setIsViewingTracking(true);
    }
  }, [initialOrderId]);

  useEffect(() => {
    let ignore = false;
    const rawNum = parseInt(String(tableNumber).replace(/\D/g, ''), 10);
    const ma_ban = isNaN(rawNum) || rawNum <= 0 ? 5 : rawNum;

    fetch(`${API_BASE_URL}/orders/table/${ma_ban}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.data) {
          setOrders(json.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [tableNumber, reloadKey]);

  const handleRefresh = () => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  const handleOpenTracking = (orderId?: number) => {
    setFocusedOrderId(orderId);
    setIsViewingTracking(true);
  };

  const handleCloseTracking = () => {
    setIsViewingTracking(false);
    setFocusedOrderId(undefined);
  };

  // Nếu đang mở màn hình theo dõi trạng thái đơn hàng chi tiết
  if (isViewingTracking) {
    return (
      <OrderTrackingScreen
        onBack={handleCloseTracking}
        onGoToMenu={onBackToMenu}
        focusedOrderId={focusedOrderId}
      />
    );
  }

  return (
    <div className="w-full px-4 py-2.5 flex flex-col gap-3">
      {/* Header nhỏ nằm trong nội dung ở giữa */}
      <div className="w-full flex items-center justify-between pb-3 pt-1 border-b border-[#EFE9DF] mb-1">
        <button
          type="button"
          onClick={onBackToMenu}
          className="w-8 h-8 -ml-1 rounded-full hover:bg-black/5 active:scale-90 text-[#231F20] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Quay lại thực đơn"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-sm sm:text-base font-bold text-[#231F20] tracking-tight">
          Món đã gọi • {tableName}
        </h1>

        <button
          type="button"
          onClick={handleRefresh}
          className="w-8 h-8 rounded-full hover:bg-black/5 text-[#5C5046] flex items-center justify-center transition-colors cursor-pointer"
          title="Làm mới trạng thái"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#8B2323]' : ''}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#7A6E62]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#8B2323] mb-3" />
            <p className="text-xs font-semibold">Đang cập nhật trạng thái món ăn...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-16 h-16 rounded-3xl bg-[#F5EFE6] flex items-center justify-center text-[#8B2323] mb-4 shadow-inner">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-[#231F20]">
              Chưa có món nào đang phục vụ
            </h3>
            <p className="text-xs text-[#7A6E62] mt-1.5 max-w-[260px] leading-relaxed">
              Các món bạn đặt sẽ xuất hiện tại đây cùng trạng thái chế biến theo thời gian thực.
            </p>
            <button
              type="button"
              onClick={onBackToMenu}
              className="mt-6 px-5 py-2.5 rounded-xl bg-[#8B2323] hover:bg-[#781E1E] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Utensils className="w-4 h-4" />
              <span>Xem thực đơn gọi món</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {/* Banner nổi bật xem tiến độ toàn bàn gộp nhiều đợt gọi (như mockup) */}
            <button
              type="button"
              onClick={() => handleOpenTracking(undefined)}
              className="w-full bg-[#FAF4EC] hover:bg-[#F5EFE4] border border-[#E8DEC0] rounded-2xl p-3.5 flex items-center justify-between transition-all shadow-2xs text-left cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B2323] text-white flex items-center justify-center shadow-xs shrink-0">
                  <CookingPot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-[#231F20] tracking-tight group-hover:text-[#8B2323] transition-colors">
                    Theo dõi tiến độ phục vụ toàn bàn
                  </h4>
                  <p className="text-[11px] text-[#7A6E62] mt-0.5">
                    Xem thời gian ước tính, trạng thái bếp và tiến độ ra món ({orders.length} đợt gọi)
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#8B2323] shrink-0 ml-1 transition-transform group-hover:translate-x-0.5" />
            </button>

            {/* Danh sách từng khung đơn hàng */}
            {orders.map((ord) => (
              <div
                key={ord.ma_don}
                onClick={() => handleOpenTracking(ord.ma_don)}
                className="bg-white rounded-2xl p-4 border border-[#EDE6DC] shadow-xs cursor-pointer hover:border-[#D5C7B7] hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-[#F0EBE1] mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-[#8B2323] bg-[#FDF2EC] border border-[#F6D8C8] px-2 py-0.5 rounded-md">
                      #DH{String(ord.ma_don).padStart(3, '0')}
                    </span>
                    <span className="text-[11px] text-[#8C7F72]">
                      {(() => {
                        if (!ord.thoi_gian_tao) return '';
                        const normalized = ord.thoi_gian_tao.includes('Z') || ord.thoi_gian_tao.includes('+')
                          ? ord.thoi_gian_tao
                          : `${ord.thoi_gian_tao}Z`;
                        return new Date(normalized).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                      })()}
                    </span>
                  </div>

                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    {ord.trang_thai}
                  </span>
                </div>

                {/* Items */}
                <div className="divide-y divide-[#F7F2EA]">
                  {(ord.chitietdonhang || []).map((dishItem, i) => {
                    const dishName = dishItem.monan?.ten_mon || dishItem.ten_mon || 'Món ăn';
                    return (
                      <div key={dishItem.ma_ct || i} className="py-2 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-[#231F20]">
                            {dishItem.so_luong}x {dishName}
                          </span>
                          {dishItem.ghi_chu && (
                            <p className="text-[10px] text-[#8C7F72] italic mt-0.5">
                              {dishItem.ghi_chu}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-[#5C5046]">
                          {(dishItem.don_gia * dishItem.so_luong).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Total */}
                <div className="pt-2.5 mt-2 border-t border-[#F0EBE1] flex items-center justify-between text-xs font-bold text-[#231F20]">
                  <span>Tổng đơn</span>
                  <span className="text-sm font-extrabold text-[#8B2323]">
                    {Number(ord.tong_tien).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Thanh điều hướng theo dõi tiến độ chi tiết */}
                <div className="mt-2.5 pt-2 border-t border-dashed border-[#EFE8DD] flex items-center justify-between text-[11px] text-[#8B2323] font-bold">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Xem tiến độ chế biến chi tiết</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8B2323]" />
                </div>
              </div>
            ))}

            {/* Khung Ghi chú / Lời nhắc thanh toán tinh gọn (Hướng 2) */}
            <div className="pt-1 pb-4 flex flex-col gap-2.5">
              <div className="bg-[#FAF4EC] rounded-2xl p-4 border border-[#EDE5D8] flex flex-col gap-2.5 shadow-2xs">
                {/* Dòng tạm tính tổng cả bàn */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#231F20]">
                    <ReceiptText className="w-4 h-4 text-[#8B2323]" />
                    <span>
                      Tạm tính cả bàn ({orders.length} đợt gọi)
                    </span>
                  </div>
                  <span className="text-sm font-black text-[#8B2323]">
                    {orders
                      .reduce((sum, ord) => sum + (Number(ord.tong_tien) || 0), 0)
                      .toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {/* Lời nhắc thanh toán & hỗ trợ bàn ăn */}
                <div className="pt-2 border-t border-[#EDE5D8] flex items-start gap-2 text-[11px] text-[#7A6E62] leading-relaxed">
                  <Info className="w-3.5 h-3.5 text-[#A89E91] shrink-0 mt-0.5" />
                  <span>
                    Khi dùng bữa xong, quý khách có thể nhấn nút <b className="text-[#8B2323]">Gọi NV</b> ở góc trên để yêu cầu thanh toán tại bàn hoặc thanh toán tại quầy thu ngân.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
