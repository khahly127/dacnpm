'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  itemName?: string; // Tên đối tượng: "nhân viên", "đơn hàng", "món ăn", "bàn"...
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Thu gọn danh sách trang theo định dạng:
 * << < [Trang hiện tại] [Trang kế tiếp] ... [Trang kế cuối] [Trang cuối] > >>
 * Ví dụ khi ở trang 3 trong tổng 7 trang:
 * << < 3 4 ... 6 7 > >>
 */
function getPaginationRange(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 1) return [1];

  // Nếu tổng số trang nhỏ (<= 4), hiển thị đầy đủ không cần ...
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // 1. Nhóm trang hiện tại: 2 trang bắt đầu từ trang hiện tại (hoặc lùi 1 trang nếu đang ở trang cuối)
  const currentGroup =
    currentPage >= totalPages
      ? [totalPages - 1, totalPages]
      : [currentPage, currentPage + 1];

  // 2. Nhóm trang cuối: luôn là 2 trang cuối
  const endGroup = [totalPages - 1, totalPages];

  const maxCurrent = currentGroup[currentGroup.length - 1];
  const minEnd = endGroup[0];

  const range: (number | string)[] = [...currentGroup];

  if (minEnd > maxCurrent + 1) {
    // Có khoảng cách (ví dụ 4 và 6 -> cách nhau 5) -> chèn dấu ba chấm 'dots'
    range.push('dots');
    range.push(...endGroup);
  } else if (minEnd === maxCurrent + 1) {
    // Liền kề nhau (ví dụ 5 và 6) -> nối liền không cần dấu ba chấm
    range.push(...endGroup);
  } else {
    // Bị chạm/trùng nhau ở cuối danh sách (ví dụ [5, 6] và [6, 7]) -> chỉ lấy phần tử chưa có
    for (const p of endGroup) {
      if (!range.includes(p)) {
        range.push(p);
      }
    }
  }

  return range;
}

/**
 * Component Phân trang dùng chung cho toàn bộ hệ thống
 * Có đầy đủ 4 nút điều hướng: Về đầu (<<), Trang trước (<), Trang sau (>), Đến cuối (>>)
 */
export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  itemName = 'mục',
  onPageChange,
  className = '',
}: PaginationProps) {
  // Luôn đảm bảo safePage nằm trong khoảng [1, totalPages] để tránh lỗi hiển thị ngược (ví dụ 51 - 2)
  const safePage = Math.min(Math.max(1, currentPage), Math.max(1, totalPages));
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);

  const pageRange = getPaginationRange(safePage, totalPages);

  return (
    <div
      className={`border-t border-[#F0EAE1] px-5 py-3.5 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A8175] select-none ${className}`}
    >
      {/* Thông tin số lượng hiển thị */}
      <div>
        Hiển thị{' '}
        <strong className="text-[#26201E] font-bold">
          {startItem} – {endItem}
        </strong>{' '}
        trong tổng số{' '}
        <strong className="text-[#26201E] font-bold">{totalItems}</strong>{' '}
        {itemName}
      </div>

      {/* Điều hướng chuyển trang: << < [số trang] > >> */}
      <div className="flex items-center gap-1.5">
        {/* Nút 1: Nhảy thẳng về trang đầu tiên (<<) */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#69635A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Về trang đầu tiên"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Nút 2: Lùi 1 trang (<) */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#69635A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Trang trước"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Các số trang: Ví dụ 3 4 ... 6 7 */}
        {pageRange.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <span
                key={`dots-${idx}`}
                className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#A89E92] select-none tracking-wider"
              >
                ...
              </span>
            );
          }

          const page = item as number;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#8E2813] text-white shadow-2xs'
                  : 'border border-[#EAE3D6] text-[#69635A] hover:bg-[#FAF7F2]'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Nút 3: Tiến 1 trang (>) */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#69635A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Trang sau"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Nút 4: Nhảy thẳng đến trang cuối cùng (>>) */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-[#EAE3D6] hover:bg-[#FAF7F2] text-[#69635A] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Đến trang cuối cùng"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
