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
  onToggleStatus?: (id: string) => void;
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
  onToggleStatus,
  onViewCategory,
  onEditCategory,
  onDeleteCategory,
}: CategoryTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xs overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#F0EAE1] text-[11px] font-black text-[#8A8175] uppercase tracking-wider bg-[#FAF7F2]">
              <th className="py-3.5 px-5 w-28 whitespace-nowrap">MÃ</th>
              <th className="py-3.5 px-5 w-48 whitespace-nowrap">TÊN DANH MỤC</th>
              <th className="py-3.5 px-5 min-w-[320px]">MÔ TẢ THỰC ĐƠN & PHỤC VỤ</th>
              <th className="py-3.5 px-5 w-28 text-center whitespace-nowrap">MÓN ĂN</th>
              <th className="py-3.5 px-5 w-44 whitespace-nowrap">TRẠNG THÁI</th>
              <th className="py-3.5 px-5 text-right w-28 whitespace-nowrap">THAO TÁC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EFE6] text-xs">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#8A8175]">
                  Không tìm thấy danh mục món ăn nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              categories.map((item) => {
                const isVisible = item.status === 'VISIBLE';

                return (
                  <tr key={item.id} className="hover:bg-[#FCFAF7] transition-colors">
                    {/* Cột 1: Mã - Đảm bảo nằm gọn trên 1 hàng không bị rớt dòng */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-[11px] border border-[#F6D8C8] whitespace-nowrap">
                        {item.code}
                      </span>
                    </td>

                    {/* Cột 2: Tên danh mục - Đã bỏ phần tiếng Anh, chỉ giữ lại tên danh mục tiếng Việt */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="font-bold text-[#26201E] leading-snug">
                        {item.name}
                      </div>
                    </td>

                    {/* Cột 3: Mô tả thực đơn & phục vụ */}
                    <td className="py-4 px-5 text-[#524B46] leading-relaxed">
                      {item.description}
                    </td>

                    {/* Cột 4: Món ăn (Số lượng) */}
                    <td className="py-4 px-5 text-center whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#3C342F] font-bold text-xs border border-[#EAE3D6] whitespace-nowrap">
                        {String(item.dishCount).padStart(2, '0')} món
                      </span>
                    </td>

                    {/* Cột 5: Trạng thái QR - Chuyển sang dạng toggle switch giống bên Quản lý Nhân viên */}
                    <td className="py-4 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onToggleStatus && onToggleStatus(item.id)}
                          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            isVisible ? 'bg-[#10B981]' : 'bg-[#D1D5DB]'
                          }`}
                          title="Gạt công tắc để thay đổi trạng thái hiển thị trên menu QR"
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                              isVisible ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span
                          className={`text-[11px] font-bold ${
                            isVisible ? 'text-[#059669]' : 'text-[#6B7280]'
                          }`}
                        >
                          {isVisible ? 'Đang hiển thị' : 'Đang ẩn'}
                        </span>
                      </div>
                    </td>

                    {/* Cột 6: Thao tác (Xem, Sửa, Xóa) */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 text-[#8A8175]">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() => onViewCategory(item)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => onEditCategory(item)}
                          className="p-1.5 hover:text-[#26201E] hover:bg-[#FAF7F2] rounded-lg transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          title="Xóa"
                          onClick={() => onDeleteCategory(item)}
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
        itemName="danh mục ẩm thực"
        onPageChange={onPageChange}
      />
    </div>
  );
}
