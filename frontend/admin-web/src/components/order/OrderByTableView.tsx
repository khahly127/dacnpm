'use client';

import React, { useMemo } from 'react';
import {
  Armchair,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CheckCheck,
  Eye,
  UtensilsCrossed,
} from 'lucide-react';
import { OrderItem } from '@/types/order';

interface OrderByTableViewProps {
  orders: OrderItem[];
  onPayTable: (tableId: number, tableName?: string) => void;
  onCompleteOrder?: (id: string) => void;
  onViewOrder?: (order: OrderItem) => void;
}

interface TableOrderGroup {
  tableId: number;
  tableName: string;
  orders: OrderItem[];
  totalAmount: number;
  totalDishes: number;
  unservedOrders: OrderItem[];
  isReady: boolean;
  earliestTime?: string;
}

export function OrderByTableView({
  orders,
  onPayTable,
  onCompleteOrder,
  onViewOrder,
}: OrderByTableViewProps) {
  // Gom nhóm các đơn theo bàn ăn (loại trừ các đơn đã hủy)
  const tableGroups = useMemo(() => {
    const groupsMap = new Map<number, TableOrderGroup>();

    const activeOrders = orders.filter((o) => o.status !== 'CANCELLED');

    activeOrders.forEach((order) => {
      const tid = order.tableId;
      if (!groupsMap.has(tid)) {
        groupsMap.set(tid, {
          tableId: tid,
          tableName: order.tableName || `Bàn ${tid}`,
          orders: [],
          totalAmount: 0,
          totalDishes: 0,
          unservedOrders: [],
          isReady: false,
          earliestTime: order.time,
        });
      }

      const g = groupsMap.get(tid)!;
      g.orders.push(order);
      g.totalAmount += order.totalAmount || 0;

      const dishesInOrder = Array.isArray(order.items)
        ? order.items.reduce((s, it) => s + (it.quantity || 1), 0)
        : 0;
      g.totalDishes += dishesInOrder;

      if (order.status !== 'COMPLETED') {
        g.unservedOrders.push(order);
      }
    });

    const result = Array.from(groupsMap.values());
    result.forEach((g) => {
      // Sắp xếp các đợt gọi từ sớm nhất đến mới nhất
      g.orders.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeA - timeB;
      });
      g.isReady = g.orders.length > 0 && g.unservedOrders.length === 0;
      g.earliestTime = g.orders[0]?.time;
    });

    // Sắp xếp các bàn theo tableId tăng dần
    result.sort((a, b) => a.tableId - b.tableId);

    return result;
  }, [orders]);

  if (tableGroups.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-center text-[#8A8175] mx-auto mb-3">
          <Armchair className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-[#2D241E]">
          Hiện không có bàn nào đang gọi món
        </h3>
        <p className="text-xs text-[#8A8175] mt-1 max-w-sm mx-auto">
          Tất cả các bàn đang trống hoặc các đơn hàng đều đã hoàn tất thanh toán.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Danh sách các card bàn ăn */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {tableGroups.map((group) => {
          return (
            <div
              key={group.tableId}
              className={`bg-white rounded-2xl border transition-all shadow-2xs overflow-hidden flex flex-col justify-between ${
                group.isReady
                  ? 'border-[#BBF7D0] ring-1 ring-[#BBF7D0]'
                  : 'border-[#EAE3D6] hover:border-[#D8CFBF]'
              }`}
            >
              {/* Header Card Bàn */}
              <div className="p-4 border-b border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ${
                      group.isReady
                        ? 'bg-[#15803D] text-white'
                        : 'bg-[#8E2813] text-white'
                    }`}
                  >
                    <Armchair className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-[#26201E]">
                        {group.tableName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8]">
                        {group.orders.length} đợt gọi
                      </span>
                      <span className="text-xs text-[#8A8175] font-medium">
                        • {group.totalDishes} món
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#8A8175] mt-0.5">
                      <Clock className="w-3 h-3 text-[#A89E92]" />
                      <span>Bắt đầu từ: {group.earliestTime || '--:--'}</span>
                    </div>
                  </div>
                </div>

                {/* Badge điều kiện thanh toán */}
                <div>
                  {group.isReady ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sẵn sàng thanh toán
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Còn {group.unservedOrders.length} đợt chưa hoàn tất
                    </span>
                  )}
                </div>
              </div>

              {/* Danh sách các đợt gọi món bên trong bàn */}
              <div className="p-4 flex-1 space-y-2.5">
                <div className="text-[11px] font-bold text-[#8A8175] uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Chi tiết các đợt gọi ({group.orders.length})</span>
                  <span>Trạng thái</span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {group.orders.map((ord, idx) => {
                    const isCompleted = ord.status === 'COMPLETED';
                    const isServed = ord.status === 'SERVED';
                    const isCooking = ord.status === 'COOKING';
                    const isPending = ord.status === 'PENDING';

                    return (
                      <div
                        key={ord.id}
                        className="p-2.5 rounded-xl border border-[#F0EAE1] bg-[#FCFAF7] hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-bold text-[#8A8175] shrink-0 text-[11px]">
                            #{idx + 1}
                          </span>
                          <span className="font-mono font-bold text-[#8E2813] shrink-0">
                            {ord.code}
                          </span>
                          <span className="text-[#8A8175] truncate text-[11px]" title={ord.itemsSummary}>
                            ({ord.itemsSummary || `${ord.items.length} món`})
                          </span>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-black text-[#26201E]">
                            {ord.formattedTotal}
                          </span>

                          {/* Trạng thái đợt */}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                              ✓ Đã phục vụ
                            </span>
                          )}

                          {isServed && onCompleteOrder && (
                            <button
                              type="button"
                              onClick={() => onCompleteOrder(ord.id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-2xs transition-colors cursor-pointer"
                              title="Bấm để xác nhận món đã lên bàn"
                            >
                              <CheckCheck className="w-3 h-3" />
                              <span>Hoàn tất món</span>
                            </button>
                          )}

                          {isCooking && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]">
                              Đang chuẩn bị
                            </span>
                          )}

                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                              Chờ xác nhận
                            </span>
                          )}

                          {onViewOrder && (
                            <button
                              type="button"
                              onClick={() => onViewOrder(ord)}
                              title="Xem chi tiết đơn"
                              className="p-1 text-[#8A8175] hover:text-[#26201E] rounded-md transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Card: Tổng tiền & Nút Thanh toán bàn */}
              <div className="p-4 border-t border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#8A8175] block uppercase">
                    Tổng bill bàn ({group.orders.length} đợt)
                  </span>
                  <span className="text-xl font-black text-[#8E2813]">
                    {new Intl.NumberFormat('vi-VN').format(group.totalAmount)} VNĐ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onPayTable(group.tableId, group.tableName)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer ${
                    group.isReady
                      ? 'bg-[#8E2813] hover:bg-[#782210] active:scale-[0.99] text-white'
                      : 'bg-[#8E2813]/80 hover:bg-[#8E2813] text-white'
                  }`}
                  title={
                    group.isReady
                      ? `Thanh toán & Trả ${group.tableName}`
                      : `Bàn còn ${group.unservedOrders.length} đợt chưa phục vụ xong. Mở để kiểm tra chi tiết.`
                  }
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Thanh toán bàn</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
