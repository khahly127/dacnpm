'use client';

import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { CategoryItem } from '@/types/category';
import { Pagination } from '@/components/common/Pagination';

interface CategoryTableProps {
  categories: CategoryItem[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onViewCategory: (category: CategoryItem) => void;
  onEditCategory: (category: CategoryItem) => void;
  onDeleteCategory: (category: CategoryItem) => void;
}

export function CategoryTable({
  categories,
  currentPage,
  totalPages,
  totalItems,
  pageSize = 6,
  onPageChange,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="py-4 px-6 w-[20%] whitespace-nowrap">MÃ</th>
              <th className="py-4 px-6 w-[45%] whitespace-nowrap">TÊN DANH MỤC</th>
              <th className="py-4 px-6 w-[20%] text-center whitespace-nowrap">MÓN ĂN</th>
              <th className="py-4 px-6 text-right w-[15%] whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#8A8175]">
                  Không tìm thấy danh mục món ăn nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              categories.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Cột 1: Mã */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8] whitespace-nowrap">
                        {item.code}
                      </span>
                    </td>

                    {/* Cột 2: Tên danh mục */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="font-bold text-[#26201E] text-sm leading-snug">
                        {item.name}
                      </div>
                    </td>

                    {/* Cột 3: Món ăn (Số lượng) */}
                    <td className="py-4 px-6 text-center whitespace-nowrap">
                      <span className="inline-block px-3 py-1 rounded-full bg-[#FAF7F2] text-[#3C342F] font-bold text-xs border border-[#EAE3D6] whitespace-nowrap">
                        {String(item.dishCount).padStart(2, '0')} món
                      </span>
                    </td>

                    {/* Cột 4: Thao tác (Xem, Sửa, Xóa) */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 text-[#8A8175]">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() => onViewCategory(item)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => onEditCategory(item)}
                          className="p-1.5 hover:text-[#8E2813] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Xóa"
                          onClick={() => onDeleteCategory(item)}
                          className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
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
        itemName="danh mục ẩm thực"
        onPageChange={onPageChange}
      />
    </div>
  );
}
