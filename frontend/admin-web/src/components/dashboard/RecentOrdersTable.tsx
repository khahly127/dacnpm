'use client';

import React from 'react';
import Link from 'next/link';
import { RecentOrder } from '@/types/dashboard';
import { Search, Clock } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  totalOrdersCount?: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RecentOrdersTable({
  orders,
  totalOrdersCount,
  searchQuery,
  onSearchChange,
}: RecentOrdersTableProps) {
  const getStatusBadgeClasses = (status: RecentOrder['status']) => {
    switch (status) {
      case 'WAITING_KITCHEN':
        return {
          container: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          dot: 'bg-[#E11D48]',
        };
      case 'COOKING':
        return {
          container: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
          dot: 'bg-[#D97706]',
        };
      case 'SERVED':
        return {
          container: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          dot: 'bg-[#2563EB]',
        };
      default:
        return {
          container: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
          dot: 'bg-[#059669]',
        };
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-xs">
      {/* Header: Bên trái là Tiêu đề + Phụ đề, bên phải là Ô tìm kiếm Pill + Link xem toàn bộ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F5EFE6] gap-3">
        <div>
          <h2 className="text-base font-bold text-[#26201E] leading-tight">
            Đơn Hàng Gần Đây
          </h2>
          <p className="text-xs text-[#8A8175] mt-1 font-normal">
            Danh sách đơn hàng mới nhất đang được xử lý trong ca trực.
          </p>
        </div>

        {/* Cụm chức năng bên phải: Ô tìm kiếm Pill bo tròn sang trọng & Link xem toàn bộ */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="relative w-52 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#A89E92]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm mã đơn, bàn..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF7F2] border border-[#EAE3D6] rounded-full text-xs text-[#26201E] placeholder-[#A89E92] focus:outline-none focus:border-[#8E2813] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          <Link
            href="/order"
            className="text-xs font-semibold text-[#8E2813] hover:underline whitespace-nowrap"
          >
            Xem toàn bộ đơn hàng {typeof totalOrdersCount === 'number' ? `(${totalOrdersCount} đơn) ` : ''}→
          </Link>
        </div>
      </div>

      {/* Dữ liệu bảng: căn chỉnh độ rộng cột cố định hợp lý, đồng bộ phong cách với trang Quản lý đơn */}
      <div className="overflow-x-auto mt-4 rounded-xl border border-[#EAE3D6] overflow-hidden">
        <table className="w-full text-left text-xs min-w-[880px]">
          <thead>
            <tr className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[11px] font-bold text-[#8A8175] uppercase tracking-wider">
              <th className="py-3.5 px-4 w-[110px] whitespace-nowrap">MÃ ĐƠN</th>
              <th className="py-3.5 px-4 w-[90px] whitespace-nowrap">BÀN</th>
              <th className="py-3.5 px-4 w-[150px] whitespace-nowrap">NHÂN VIÊN</th>
              <th className="py-3.5 px-4 w-[130px] whitespace-nowrap">THỜI GIAN</th>
              <th className="py-3.5 px-4">MÓN ĂN PHỤC VỤ</th>
              <th className="py-3.5 px-4 w-[130px] text-right whitespace-nowrap">TỔNG TIỀN</th>
              <th className="py-3.5 px-4 w-[140px] text-center whitespace-nowrap">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] bg-white">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-[#8A8175]">
                  Chưa có đơn hàng nào phát sinh trong khoảng thời gian này.
                </td>
              </tr>
            ) : (
              orders.map((ord) => {
                const badge = getStatusBadgeClasses(ord.status);
                return (
                  <tr key={ord.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Mã đơn */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-black text-[#8E2813] text-xs tracking-tight">
                        {ord.code}
                      </span>
                    </td>

                    {/* Bàn */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#26201E] text-xs">
                        {ord.tableName}
                      </span>
                    </td>

                    {/* Nhân viên */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-[#26201E] text-xs">
                        {ord.waiterName}
                      </div>
                      <div className="text-[11px] text-[#8A8175] font-normal">
                        {ord.waiterId}
                      </div>
                    </td>

                    {/* Thời gian: Dòng 1 là Ngày, Dòng 2 là Giờ */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-[#26201E] text-xs">
                        {ord.date || 'Hôm nay'}
                      </div>
                      <div className="text-[11px] text-[#8A8175] flex items-center gap-1 mt-0.5 font-medium">
                        <Clock className="w-3 h-3 text-[#A89E92]" />
                        <span>{ord.time}</span>
                      </div>
                    </td>

                    {/* Món ăn phục vụ & Ghi chú */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-semibold text-[#26201E] leading-snug">
                        {ord.itemsSummary}
                      </div>
                      {ord.note && (
                        <div className="text-[11px] text-[#8E2813] font-medium mt-0.5">
                          {ord.note}
                        </div>
                      )}
                    </td>

                    {/* Tổng tiền */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="font-black text-[#8E2813] text-xs">
                        {ord.totalAmount}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.container}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        <span>{ord.statusText}</span>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
