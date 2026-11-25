'use client';

import React from 'react';
import { Eye, Ban, Check, CheckCheck, Clock, CreditCard } from 'lucide-react';
import { OrderItem } from '@/types/order';
import { Pagination } from '@/components/common/Pagination';

interface OrderTableProps {
  orders: OrderItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onAcceptOrder?: (id: string) => void;
  onServeOrder?: (id: string) => void;
  onCompleteOrder?: (id: string) => void;
  onPayTable?: (tableId: number, tableName?: string) => void;
  onCancelOrder?: (order: OrderItem) => void;
  onPrintReceipt?: (order: OrderItem) => void;
  onViewOrder?: (order: OrderItem) => void;
}

function formatOrderDateTime(createdAt?: string, fallbackTime?: string) {
  if (!createdAt) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return {
      date: `${day}/${month}/${year}`,
      time: fallbackTime || '00:00',
    };
  }

  const normalized = createdAt.includes('Z') || createdAt.includes('+')
    ? createdAt
    : `${createdAt}Z`;
  const d = new Date(normalized);
  if (isNaN(d.getTime())) {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return {
      date: `${day}/${month}/${year}`,
      time: fallbackTime || '00:00',
    };
  }

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return {
    date: `${day}/${month}/${year}`,
    time: `${hours}:${minutes}`,
  };
}

export function OrderTable({
  orders,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onAcceptOrder,
  onServeOrder,
  onCompleteOrder,
  onPayTable,
  onCancelOrder,
  onPrintReceipt,
  onViewOrder,
}: OrderTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="w-[11%] py-3.5 px-4 whitespace-nowrap">MÃ ĐƠN</th>
              <th className="w-[9%] py-3.5 px-4 whitespace-nowrap">BÀN</th>
              <th className="w-[16%] py-3.5 px-4 whitespace-nowrap">NHÂN VIÊN</th>
              <th className="w-[15%] py-3.5 px-4 whitespace-nowrap">TỔNG TIỀN</th>
              <th className="w-[14%] py-3.5 px-4 whitespace-nowrap">THỜI GIAN</th>
              <th className="w-[16%] py-3.5 px-4 whitespace-nowrap">TRẠNG THÁI</th>
              <th className="w-[19%] py-3.5 px-4 text-right whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#8A8175]">
                  Không tìm thấy đơn hàng nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const isPending = order.status === 'PENDING';
                const isCooking = order.status === 'COOKING';
                const isServed = order.status === 'SERVED';
                const isCompleted = order.status === 'COMPLETED';

                return (
                  <tr key={order.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Cột 1: Mã Đơn */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-black text-[#8E2813] text-xs tracking-tight">
                        {order.code}
                      </span>
                    </td>

                    {/* Cột 2: Bàn */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#26201E] text-xs">
                        {order.tableName}
                      </span>
                    </td>

                    {/* Cột 3: Nhân viên phụ trách */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-[#3C342F] text-xs">
                        {order.employeeName}
                      </span>
                    </td>

                    {/* Cột 4: Tổng tiền */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-black text-[#8E2813] text-xs">
                        {order.formattedTotal}
                      </span>
                    </td>

                    {/* Cột 5: Thời gian */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {(() => {
                        const { date, time } = formatOrderDateTime(order.createdAt, order.time);
                        return (
                          <div>
                            {/* Dòng 1: Ngày */}
                            <div className="font-bold text-[#26201E] text-xs">
                              {date}
                            </div>
                            {/* Dòng 2: Giờ */}
                            <div className="text-[11px] text-[#8A8175] flex items-center gap-1 mt-0.5 font-medium">
                              <Clock className="w-3 h-3 text-[#A89E92]" />
                              <span>{time}</span>
                            </div>
                          </div>
                        );
                      })()}
                    </td>

                    {/* Cột 7: Trạng thái */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isPending
                            ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'
                            : isCooking
                            ? 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                            : isServed
                            ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                            : isCompleted
                            ? 'bg-[#F5EFE6] text-[#69635A] border-[#EAE3D6]'
                            : 'bg-[#F3F4F6] text-[#9CA3AF] border-[#E5E7EB]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPending
                              ? 'bg-[#DC2626]'
                              : isCooking
                              ? 'bg-[#D97706]'
                              : isServed
                              ? 'bg-[#10B981]'
                              : isCompleted
                              ? 'bg-[#8A8175]'
                              : 'bg-[#9CA3AF]'
                          }`}
                        />
                        <span>{order.statusText}</span>
                      </span>
                    </td>

                    {/* Cột 8: Thao tác */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Nút chính tương ứng trạng thái */}
                        {isPending && onAcceptOrder && (
                          <button
                            type="button"
                            onClick={() => onAcceptOrder(order.id)}
                            className="px-2.5 py-1 bg-[#8E2813] hover:bg-[#73200F] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            Xác nhận
                          </button>
                        )}

                        {isCooking && onServeOrder && (
                          <button
                            type="button"
                            onClick={() => onServeOrder(order.id)}
                            className="px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" />
                            <span>Ra món</span>
                          </button>
                        )}

                        {isServed && onCompleteOrder && (
                          <button
                            type="button"
                            onClick={() => onCompleteOrder(order.id)}
                            className="px-2.5 py-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title="Xác nhận món ăn đã được bưng lên bàn cho thực khách"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Hoàn tất món</span>
                          </button>
                        )}

                        {isCompleted && onPayTable && (
                          <button
                            type="button"
                            onClick={() => onPayTable(order.tableId, order.tableName)}
                            className="px-2.5 py-1 bg-[#8E2813] hover:bg-[#73200F] text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                            title={`Mở thanh toán cho ${order.tableName}`}
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Thanh toán bàn</span>
                          </button>
                        )}

                        {/* Hủy / Từ chối đơn hàng (khi đơn chưa hoàn tất hoặc chưa hủy) */}
                        {onCancelOrder && !isCompleted && order.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            title="Hủy / Từ chối đợt gọi này (Bếp hết món, khách đổi ý...)"
                            onClick={() => onCancelOrder(order)}
                            className="p-1.5 text-[#8A8175] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Xem chi tiết đơn hàng */}
                        {onViewOrder && (
                          <button
                            type="button"
                            title="Xem chi tiết đơn"
                            onClick={() => onViewOrder(order)}
                            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang chuẩn đặt ở đáy bảng */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemName="đơn hàng"
        onPageChange={onPageChange}
      />
    </div>
  );
}
