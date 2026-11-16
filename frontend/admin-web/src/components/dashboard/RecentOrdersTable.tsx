'use client';

import React from 'react';
import { RecentOrder } from '@/types/dashboard';
import { Search } from 'lucide-react';

interface RecentOrdersTableProps {
  orders: RecentOrder[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function RecentOrdersTable({
  orders,
  searchQuery,
  onSearchChange,
}: RecentOrdersTableProps) {
  const getStatusBadge = (status: RecentOrder['status']) => {
    switch (status) {
      case 'COOKING':
        return 'bg-[#FDF2EC] text-[#B84A24] border-[#F6D8C8]';
      case 'SERVED':
        return 'bg-[#FFF6EA] text-[#C06F17] border-[#F9E2C4]';
      case 'WAITING_KITCHEN':
        return 'bg-[#F6EFE7] text-[#846648] border-[#E8DACB]';
      default:
        return 'bg-[#F2EFE9] text-[#7C7267] border-[#E5E0D5]';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-xs">
      {/* Header: Bên trái là Tiêu đề + Phụ đề đồng bộ, bên phải là Ô tìm kiếm Pill + Link xem toàn bộ */}
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

          <a
            href="#"
            className="text-xs font-semibold text-[#8E2813] hover:underline whitespace-nowrap"
          >
            Xem toàn bộ đơn hàng (48 đơn) →
          </a>
        </div>
      </div>

      {/* Dữ liệu bảng: căn chỉnh độ rộng cột cố định hợp lý, món ăn phục vụ co giãn */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left text-xs min-w-[880px] table-fixed">
          <thead>
            <tr className="text-[#8A8175] border-b border-[#F5EFE6] text-[11px] font-semibold">
              <th className="w-[100px] py-3 px-3">Mã đơn</th>
              <th className="w-[110px] py-3 px-3">Bàn</th>
              <th className="w-[130px] py-3 px-3">Nhân viên</th>
              <th className="w-[120px] py-3 px-3">Thời gian</th>
              <th className="py-3 px-3">Món ăn phục vụ</th>
              <th className="w-[130px] py-3 px-3 text-right">Tổng tiền</th>
              <th className="w-[120px] py-3 px-3 text-center">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F9F6F0]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#FCFAF7] transition-colors">
                {/* Mã đơn */}
                <td className="py-3 px-3 font-bold text-[#26201E] whitespace-nowrap">
                  {ord.code}
                </td>

                {/* Bàn */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 bg-[#F5EFE6] px-2.5 py-1 rounded text-[11px] font-semibold text-[#4A413B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8E2813]" />
                    <span>{ord.tableName}</span>
                  </div>
                </td>

                {/* Nhân viên */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="text-xs font-bold text-[#26201E]">
                    {ord.waiterId}
                  </div>
                  <div className="text-[11px] text-[#8A8175] font-normal">
                    {ord.waiterName}
                  </div>
                </td>

                {/* Thời gian */}
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="text-xs font-bold text-[#26201E]">
                    {ord.time}
                  </div>
                  <div className="text-[10px] text-[#8A8175]">
                    ({ord.timeAgo})
                  </div>
                </td>

                {/* Món ăn phục vụ & Ghi chú (chiếm phần lớn không gian bảng) */}
                <td className="py-3 px-3 pr-6">
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
                <td className="py-3 px-3 text-right font-black text-[#26201E] whitespace-nowrap">
                  {ord.totalAmount}
                </td>

                {/* Trạng thái */}
                <td className="py-3 px-3 text-center whitespace-nowrap">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border ${getStatusBadge(
                      ord.status
                    )}`}
                  >
                    {ord.statusText}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
