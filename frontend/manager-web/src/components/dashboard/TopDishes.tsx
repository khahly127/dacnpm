'use client';

import React from 'react';
import { BestSellingDish } from '@/types/dashboard';

interface TopDishesProps {
  dishes: BestSellingDish[];
}

export function TopDishes({ dishes }: TopDishesProps) {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[#8E2813] text-white';
      case 2:
        return 'bg-[#C85A32] text-white';
      case 3:
        return 'bg-[#D97736] text-white';
      case 4:
        return 'bg-[#7C7267] text-white';
      default:
        return 'bg-[#8E2813] text-white';
    }
  };

  const getBarColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[#8E2813]';
      case 2:
        return 'bg-[#C85A32]';
      case 3:
        return 'bg-[#D97736]';
      case 4:
        return 'bg-[#F2B39E]';
      default:
        return 'bg-[#8E2813]';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#EAE3D6] shadow-xs flex flex-col h-full">
      {/* Tiêu đề - Chiều cao cố định đồng bộ đường kẻ ngang với Sơ đồ bàn ăn */}
      <div className="pb-4 border-b border-[#F5EFE6] space-y-1.5 min-h-[64px] flex flex-col justify-between">
        <h2 className="text-base font-bold text-[#26201E] whitespace-nowrap leading-tight">
          Top 5 Món Bán Chạy
        </h2>
        <p className="text-xs text-[#8A8175] font-normal whitespace-nowrap">
          Xếp hạng doanh thu & số lượng phần món ăn dẫn đầu.
        </p>
      </div>

      {/* Danh sách 5 món: Món số 1 bắt đầu ngang hàng với Hàng 1 của Sơ đồ bàn ăn */}
      <div className="flex-1 flex flex-col justify-between pt-4 pb-1">
        {dishes.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-xs text-[#8A8175] py-10 text-center">
            Chưa có món ăn nào phát sinh trong khoảng thời gian này.
          </div>
        ) : (
          dishes.map((dish) => (
            <div key={dish.rank} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${getRankBadge(
                      dish.rank
                    )}`}
                  >
                    {dish.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#26201E] whitespace-nowrap">
                      {dish.name}
                    </div>
                    <div className="text-[11px] text-[#8A8175] font-normal whitespace-nowrap">
                      {dish.soldCount} phần đã bán • {dish.pricePerPortion}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-[#26201E] whitespace-nowrap">
                    {dish.totalRevenue}
                  </span>
                </div>
              </div>

              {/* Thanh tiến độ */}
              <div className="w-full h-1.5 bg-[#F0EBE1] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(dish.rank)}`}
                  style={{ width: `${dish.percentage}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
