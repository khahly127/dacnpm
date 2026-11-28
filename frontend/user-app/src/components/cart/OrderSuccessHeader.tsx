'use client';

import React from 'react';
import { Check, Utensils } from 'lucide-react';
import { OrderSuccessData } from '@/types/order';

interface OrderSuccessHeaderProps {
  data: OrderSuccessData;
}

export function OrderSuccessHeader({ data }: OrderSuccessHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center pt-3 pb-1 text-center">
      {/* Icon checkmark với vòng tròn lan tỏa màu cam nâu */}
      <div className="relative flex items-center justify-center">
        {/* Vòng ngoài cùng */}
        <div className="w-20 h-20 rounded-full bg-[#E88938]/15 flex items-center justify-center animate-pulse">
          {/* Vòng giữa */}
          <div className="w-15 h-15 rounded-full bg-[#E88938]/25 flex items-center justify-center">
            {/* Vòng tròn chính tâm */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#C25E00] to-[#E88938] text-white flex items-center justify-center shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
          </div>
        </div>
      </div>

      {/* Tiêu đề chính */}
      <h2 className="text-xl sm:text-2xl font-black text-[#231F20] tracking-tight mt-3">
        Đã gửi order đến nhà hàng!
      </h2>

      {/* Đoạn mô tả nhẹ nhàng */}
      <p className="text-xs text-[#7A6E62] mt-1.5 max-w-[310px] leading-relaxed">
        Nhà bếp Casa Cozy đã nhận được đơn của bạn và đang chuẩn bị chế biến với tất cả sự nâng niu.
      </p>

      {/* Badge bàn & thời gian gửi */}
      <div className="flex items-center justify-center mt-3">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3EA] border border-[#F2E5D4] text-xs font-semibold text-[#5C5046] shadow-2xs">
          <Utensils className="w-3.5 h-3.5 text-[#8B2323]" />
          <span>
            {data.tableName} • {data.time}
          </span>
        </div>
      </div>
    </div>
  );
}
