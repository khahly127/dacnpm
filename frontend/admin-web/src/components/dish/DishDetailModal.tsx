'use client';

import React, { useState } from 'react';
import { X, Pencil, Utensils } from 'lucide-react';
import { DishItem } from '@/types/dish';

function DishDetailThumbnail({ src, alt }: { src?: string | null; alt: string }) {
  const [hasError, setHasError] = useState(false);

  const isValid = Boolean(
    src &&
    typeof src === 'string' &&
    (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/'))
  );

  if (!isValid || hasError) {
    return (
      <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#EAE3D6] shrink-0 flex items-center justify-center">
        <Utensils className="w-6 h-6 text-[#A89E92] opacity-50" />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#EAE3D6] shrink-0 relative shadow-2xs">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src!}
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

interface DishDetailModalProps {
  isOpen: boolean;
  dish: DishItem | null;
  onClose: () => void;
  onEdit?: (dish: DishItem) => void;
}

export function DishDetailModal({
  isOpen,
  dish,
  onClose,
  onEdit,
}: DishDetailModalProps) {
  if (!isOpen || !dish) return null;

  const isAvailable = dish.status === 'AVAILABLE';
  const isOutOfStock = dish.status === 'OUT_OF_STOCK';

  const detailRows = [
    {
      field: 'Mã món ăn',
      value: (
        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF2EC] text-[#8E2813] font-bold text-xs border border-[#F6D8C8]">
          {dish.code}
        </span>
      ),
    },
    {
      field: 'Tên món ăn',
      value: <span className="font-bold text-[#26201E]">{dish.name}</span>,
    },
    {
      field: 'Tên phụ / Mô tả ngắn',
      value: (
        <span className="text-[#3C342F] italic">
          {dish.subtitle || 'Không có mô tả phụ'}
        </span>
      ),
    },
    {
      field: 'Danh mục thực đơn',
      value: (
        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3C342F] font-semibold text-xs border border-[#EAE3D6]">
          {dish.categoryName}
        </span>
      ),
    },
    {
      field: 'Giá niêm yết',
      value: (
        <span className="font-bold text-[#8E2813] text-sm">
          {dish.formattedPrice}
        </span>
      ),
    },
    {
      field: 'Trạng thái kinh doanh',
      value: (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
            isAvailable
              ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
              : isOutOfStock
              ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]'
              : 'bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isAvailable
                ? 'bg-[#10B981]'
                : isOutOfStock
                ? 'bg-[#DC2626]'
                : 'bg-[#9CA3AF]'
            }`}
          />
          {dish.statusText}
        </span>
      ),
    },
    {
      field: 'Hình ảnh',
      value: dish.image ? (
        <DishDetailThumbnail src={dish.image} alt={dish.name} />
      ) : (
        <span className="text-xs text-[#8A8175] italic">Chưa có ảnh tải lên</span>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl border border-[#EAE3D6] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-[#F0EAE1] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8E2813] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#26201E]">{dish.name}</h2>
              <p className="text-xs text-[#8A8175]">Chi tiết món ăn thực đơn</p>
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

        {/* Bảng 2 cột: Trường dữ liệu & Giá trị */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border border-[#EAE3D6] overflow-hidden bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#FAF7F2] border-b border-[#EAE3D6] text-[11px] font-bold text-[#8A8175] uppercase tracking-wider">
                  <th className="py-2.5 px-4 w-44">Trường dữ liệu</th>
                  <th className="py-2.5 px-4">Giá trị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5EFE6]">
                {detailRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#FCFAF7] transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#6E6359] bg-[#FAF7F2]/40">
                      {row.field}
                    </td>
                    <td className="py-3 px-4 text-[#26201E]">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="px-6 py-4 border-t border-[#F0EAE1] bg-[#FAF7F2] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-[#EAE3D6] text-xs font-bold text-[#6E6359] hover:bg-[#EFE9DF] rounded-xl transition-colors cursor-pointer"
          >
            Đóng
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(dish);
              }}
              className="px-4 py-2 bg-[#8E2813] hover:bg-[#73200F] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Chỉnh sửa món này
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
