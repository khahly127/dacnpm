'use client';

import React from 'react';
import { X, Printer, Receipt, User, CheckCircle2 } from 'lucide-react';
import { OrderItem } from '@/types/order';

interface OrderDetailModalProps {
  isOpen: boolean;
  order: OrderItem | null;
  onClose: () => void;
  onPrint?: (order: OrderItem) => void;
}

export function OrderDetailModal({
  isOpen,
  order,
  onClose,
  onPrint,
}: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8E2813] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#26201E]">
                  Chi Tiết Đơn Hàng {order.code}
                </h2>
              </div>
              <p className="text-xs text-[#8A8175]">
                {order.tableName} • Giờ tạo: {order.time} ({order.relativeTime})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#8A8175] hover:text-[#26201E] hover:bg-[#EFE9DF] rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Thông tin phục vụ */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-[#FAF7F2] p-3.5 rounded-xl border border-[#EAE3D6]">
            <div>
              <span className="text-[#8A8175]">Nhân viên phụ trách:</span>
              <div className="font-bold text-[#26201E] mt-0.5 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#8A8175]" />
                <span>{order.employeeName}</span>
              </div>
            </div>
            <div>
              <span className="text-[#8A8175]">Trạng thái đơn:</span>
              <div className="font-bold text-[#059669] mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{order.statusText}</span>
              </div>
            </div>
          </div>

          {/* Ghi chú bếp / phục vụ */}
          {order.note && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <span className="font-bold">Ghi chú bếp: </span>
              <span>{order.note}</span>
            </div>
          )}

          {/* Bảng chi tiết từng món ăn trong đơn */}
          <div>
            <div className="text-xs font-bold text-[#3C342F] mb-2 uppercase tracking-wider">
              Danh sách món đã gọi ({order.items.length} món)
            </div>
            <div className="rounded-xl border border-[#EAE3D6] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[11px] font-bold text-[#8A8175]">
                    <th className="py-2.5 px-3">TÊN MÓN</th>
                    <th className="py-2.5 px-2 text-center w-14 whitespace-nowrap">SL</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">ĐƠN GIÁ</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap">THÀNH TIỀN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EFE6]">
                  {order.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FCFAF7]">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#26201E]">{item.dishName}</div>
                        {item.note && (
                          <div className="text-[10px] text-[#8A8175] italic">{item.note}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-center font-bold text-[#8E2813] whitespace-nowrap">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#524B46] whitespace-nowrap font-medium">
                        {new Intl.NumberFormat('vi-VN').format(item.price)} VNĐ
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#26201E] whitespace-nowrap">
                        {new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VNĐ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="pt-2 border-t border-[#F0EAE1] flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A8175] uppercase">Tổng thanh toán:</span>
            <span className="text-lg font-black text-[#8E2813]">{order.formattedTotal}</span>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-between">
          {onPrint ? (
            <button
              type="button"
              onClick={() => onPrint(order)}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-[#EAE3D6] bg-white hover:bg-[#FAF7F2] text-[#3C342F] text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#8A8175]" />
              <span>In Hóa Đơn</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
