'use client';

import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Utensils } from 'lucide-react';
import { DishItem } from '@/types/dish';
import { Pagination } from '@/components/common/Pagination';

function DishImageThumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  const isValid = Boolean(
    src &&
    typeof src === 'string' &&
    (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/'))
  );

  if (!isValid || hasError) {
    return (
      <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] shrink-0 flex items-center justify-center">
        <Utensils className="w-4 h-4 text-[#A89E92] opacity-50" />
      </div>
    );
  }

  return (
    <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE3D6] shrink-0 relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src!}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}

interface DishTableProps {
  dishes: DishItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onToggleStatus?: (id: string) => void;
  onViewDish: (dish: DishItem) => void;
  onEditDish: (dish: DishItem) => void;
  onDeleteDish: (dish: DishItem) => void;
}

export function DishTable({
  dishes,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
  onToggleStatus,
  onViewDish,
  onEditDish,
  onDeleteDish,
}: DishTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed min-w-[960px]">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="w-[11%] py-3.5 px-4 whitespace-nowrap">MÃ MÓN</th>
              <th className="w-[8%] py-3.5 px-3 whitespace-nowrap">HÌNH ẢNH</th>
              <th className="w-[23%] py-3.5 px-4 whitespace-nowrap">TÊN MÓN ĂN</th>
              <th className="w-[19%] py-3.5 px-4 whitespace-nowrap">DANH MỤC</th>
              <th className="w-[14%] py-3.5 px-4 whitespace-nowrap">GIÁ</th>
              <th className="w-[15%] py-3.5 px-4 whitespace-nowrap">TRẠNG THÁI</th>
              <th className="w-[10%] py-3.5 px-4 text-right whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {dishes.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#8A8175]">
                  Không tìm thấy món ăn nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              dishes.map((dish) => {
                const isAvailable = dish.status === 'AVAILABLE';

                return (
                  <tr key={dish.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Cột 1: Mã Món */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8] whitespace-nowrap">
                        {dish.code}
                      </span>
                    </td>

                    {/* Cột 2: Hình ảnh món ăn */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <DishImageThumbnail src={dish.image} alt={dish.name} />
                    </td>

                    {/* Cột 3: Tên món ăn (Bỏ text phụ bên dưới) */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#26201E] text-xs leading-snug">
                        {dish.name}
                      </span>
                    </td>

                    {/* Cột 4: Danh mục */}
                    <td className="py-4 px-4 whitespace-nowrap text-[#524B46] font-medium">
                      {dish.categoryName}
                    </td>

                    {/* Cột 5: Giá (đổi từ GIÁ NIÊM YẾT sang GIÁ) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#26201E] text-xs">
                        {dish.formattedPrice}
                      </span>
                    </td>

                    {/* Cột 6: Trạng thái (Dạng toggle-switch giống nhân viên & danh mục) */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleStatus && onToggleStatus(dish.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isAvailable ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'
                          }`}
                          title="Gạt công tắc để thay đổi trạng thái phục vụ món ăn"
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              isAvailable ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[11px] font-bold ${
                            isAvailable ? 'text-[#059669]' : 'text-[#6B7280]'
                          }`}
                        >
                          {isAvailable
                            ? 'Đang phục vụ'
                            : dish.status === 'OUT_OF_STOCK'
                            ? 'Tạm hết'
                            : 'Đang ẩn'}
                        </span>
                      </div>
                    </td>

                    {/* Cột 7: Thao tác (Xem, Sửa, Xóa) */}
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 text-[#8A8175]">
                        <button
                          type="button"
                          title="Xem chi tiết món ăn"
                          onClick={() => onViewDish(dish)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Chỉnh sửa món ăn"
                          onClick={() => onEditDish(dish)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Xóa món ăn"
                          onClick={() => onDeleteDish(dish)}
                          className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang đặt trọn vẹn ở dưới cùng bên trong bảng */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        itemName="món ăn"
        onPageChange={onPageChange}
      />
    </div>
  );
}
