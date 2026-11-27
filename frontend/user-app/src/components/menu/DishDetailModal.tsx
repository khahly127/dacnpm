'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Flame,
  Utensils,
  Check,
  Edit3,
  Users,
} from 'lucide-react';
import { Dish } from '@/types/menu';
import { useDishDetail } from '@/hooks/useDishDetail';
import { dishDetailService } from '@/services/dishDetailService';

interface DishDetailModalProps {
  dish: Dish | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

export function DishDetailModal({
  dish,
  isOpen,
  onClose,
  onOpenCart,
}: DishDetailModalProps) {
  const [imageError, setImageError] = useState(false);

  const {
    quantity,
    increaseQuantity,
    decreaseQuantity,
    kitchenNote,
    setKitchenNote,
    optionGroups,
    quickTags,
    formattedTotalPrice,
    selectSingleOption,
    toggleMultipleOption,
    isOptionSelected,
    toggleQuickTag,
    handleConfirmAddToCart,
  } = useDishDetail(dish, () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      onClose();
    }
  });

  if (!isOpen || !dish) return null;

  const portionBadge = dishDetailService.getDishPortionBadge(dish);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Container constrained to mobile column */}
      <div className="w-full max-w-[420px] max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative animate-fade-in">
        {/* Top Drag Handle & Close Button (Căn chỉnh khoảng cách an toàn tránh bị bo góc che) */}
        <div className="relative pt-3.5 pb-2 px-5 shrink-0 bg-white flex items-center justify-center select-none">
          {/* Thanh kéo trung tâm */}
          <div className="w-10 h-1 bg-[#D6CEC4] rounded-full" />

          {/* Nút X đóng Modal dạng nút tròn nổi bật, cách xa mép bo góc */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2.5 right-4 w-7 h-7 rounded-full bg-[#F5EFE6] hover:bg-[#EAE0D2] active:scale-90 text-[#5C5046] hover:text-[#231F20] flex items-center justify-center transition-all cursor-pointer shadow-2xs z-10"
            aria-label="Đóng"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6 no-scrollbar">
          {/* Large Hero Image (Tỉ lệ 4:3 vừa vặn chống phóng to cắt hình) */}
          <div className="relative w-full aspect-[4/3] max-h-[280px] rounded-2xl overflow-hidden bg-[#FAF7F2] border border-[#EFE9DF] shrink-0 mb-4 shadow-2xs">
            {dish.image && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover object-center"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8B2323]/40">
                <Utensils className="w-12 h-12" />
              </div>
            )}
          </div>

          {/* Title & Price Section */}
          <div className="mb-4">
            {/* Tên món ăn */}
            <h2 className="text-lg sm:text-xl font-bold text-[#231F20] leading-tight">
              {dish.name}
            </h2>

            {/* Đoạn mô tả đặc sản hấp dẫn được đẩy lên ngay dưới tên món */}
            {dish.description && (
              <p className="text-xs text-[#6B5E52] mt-1.5 leading-relaxed">
                {dish.description}
              </p>
            )}

            {/* Hàng giá tiền nổi bật kèm Tag khẩu phần gọn gàng */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-1">
              <span className="text-xl font-black text-[#8B2323] tracking-tight">
                {dish.formattedPrice}
              </span>

              {portionBadge && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#7A6E62] bg-[#FAF4EC] px-3 py-1 rounded-full border border-[#EDE5D8]">
                  {portionBadge.includes('khách') || portionBadge.includes('người') ? (
                    <Users className="w-3.5 h-3.5 text-[#8B2323]" />
                  ) : (
                    <Utensils className="w-3.5 h-3.5 text-[#8B2323]" />
                  )}
                  <span>{portionBadge}</span>
                </span>
              )}
            </div>
          </div>

          {/* Option Groups */}
          {optionGroups.map((group) => {
            const isSingle = group.type === 'single';

            return (
              <div
                key={group.id}
                className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EDE6DC] mb-3.5"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#231F20]">
                    <Flame className="w-4 h-4 text-[#8B2323]" />
                    <span>{group.title}</span>
                  </div>
                  {group.badgeText && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        group.required
                          ? 'bg-[#FDF2EC] text-[#8B2323] border border-[#F6D8C8]'
                          : 'bg-[#F0EBE1] text-[#7A6E62]'
                      }`}
                    >
                      {group.badgeText}
                    </span>
                  )}
                </div>

                {group.subtitle && (
                  <p className="text-[11px] text-[#8A7D70] mb-2.5">
                    {group.subtitle}
                  </p>
                )}

                {/* Options List */}
                <div className="flex flex-col gap-2">
                  {group.options.map((opt) => {
                    const selected = isOptionSelected(group.id, opt.id);

                    return (
                      <div
                        key={opt.id}
                        onClick={() =>
                          isSingle
                            ? selectSingleOption(group.id, opt)
                            : toggleMultipleOption(group.id, opt)
                        }
                        className={`bg-white rounded-xl p-3 border transition-all cursor-pointer flex items-center justify-between ${
                          selected
                            ? 'border-[#8B2323] shadow-xs'
                            : 'border-[#EDE6DC] hover:border-[#D6CEC4]'
                        }`}
                      >
                        {/* Left: Radio/Checkbox + Name */}
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {isSingle ? (
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? 'border-[#8B2323]'
                                  : 'border-[#D6CEC4]'
                              }`}
                            >
                              {selected && (
                                <div className="w-2 h-2 rounded-full bg-[#8B2323]" />
                              )}
                            </div>
                          ) : (
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                selected
                                  ? 'bg-[#8B2323] text-white'
                                  : 'border-2 border-[#D6CEC4]'
                              }`}
                            >
                              {selected && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </div>
                          )}

                          <div className="flex flex-col min-w-0">
                            <span className="text-xs sm:text-sm font-bold text-[#231F20] leading-snug">
                              {opt.name}
                            </span>
                            {opt.subtitle && (
                              <span className="text-[11px] text-[#8A7D70] mt-0.5 leading-tight">
                                {opt.subtitle}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right: Price / Default label */}
                        <div className="shrink-0 text-right">
                          {opt.price > 0 ? (
                            <span className="text-xs font-bold text-[#8B2323]">
                              +{opt.price.toLocaleString('vi-VN')}đ
                            </span>
                          ) : opt.isDefault ? (
                            <span className="text-[11px] font-medium text-[#8A7D70]">
                              Mặc định
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-[#8A7D70]">
                              Miễn phí
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Section: Ghi chú cho bếp */}
          <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-[#EDE6DC] mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#231F20] mb-2">
              <Edit3 className="w-4 h-4 text-[#8B2323]" />
              <span>Ghi chú cho bếp</span>
            </div>

            {/* Quick Note Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {quickTags.map((tag) => {
                const isSelected = kitchenNote.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleQuickTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#8B2323] text-white shadow-xs'
                        : 'bg-white text-[#5C5248] border border-[#E5DDD0] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Kitchen Note Input */}
            <input
              type="text"
              value={kitchenNote}
              onChange={(e) => setKitchenNote(e.target.value)}
              placeholder="Ghi chú cho món ăn (Ví dụ: nướng kỹ hơn, sốt để riêng...)"
              className="w-full bg-white rounded-xl border border-[#EDE6DC] px-3.5 py-2.5 text-xs text-[#231F20] placeholder:text-[#A89F91] outline-none focus:border-[#8B2323] transition-colors"
            />
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="shrink-0 bg-white border-t border-[#EDE6DC] p-3.5 sm:p-4 flex items-center gap-3 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-[#F5EFE6] border border-[#EAE3D6] shadow-2xs select-none">
            <button
              type="button"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#8B2323] hover:bg-[#ECE4D8] active:scale-90 transition-all cursor-pointer shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Giảm số lượng"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-bold text-[#231F20] min-w-[16px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={increaseQuantity}
              className="w-7 h-7 rounded-full bg-[#8B2323] text-white flex items-center justify-center hover:bg-[#781E1E] active:scale-90 transition-all cursor-pointer shadow-xs"
              aria-label="Tăng số lượng"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleConfirmAddToCart}
            className="flex-1 bg-[#8B2323] hover:bg-[#781E1E] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-[0_4px_14px_rgba(139,35,35,0.22)] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Thêm vào giỏ hàng • {formattedTotalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
