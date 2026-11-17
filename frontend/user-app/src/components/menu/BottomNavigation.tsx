'use client';

import React from 'react';
import { Utensils, ShoppingBag, ReceiptText } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export type NavTab = 'menu' | 'cart' | 'ordered';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  const { totalCount } = useCart();

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-t border-[#EAE3D6] py-2 px-6 flex items-center justify-around sticky bottom-0 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] select-none">
      {/* Tab 1: Thực đơn */}
      <button
        type="button"
        onClick={() => onTabChange('menu')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'menu' ? 'text-[#8B2323]' : 'text-[#7A6E62] hover:text-[#231F20]'
        }`}
      >
        <Utensils className="w-5 h-5" />
        <span className="text-[11px] font-bold">Thực đơn</span>
      </button>

      {/* Tab 2: Giỏ hàng (Có badge số lượng) */}
      <button
        type="button"
        onClick={() => onTabChange('cart')}
        className={`relative flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'cart' ? 'text-[#8B2323]' : 'text-[#7A6E62] hover:text-[#231F20]'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#E65100] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-scale-up">
              {totalCount > 99 ? '99+' : totalCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-semibold">Giỏ hàng</span>
      </button>

      {/* Tab 3: Món đã gọi */}
      <button
        type="button"
        onClick={() => onTabChange('ordered')}
        className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
          activeTab === 'ordered' ? 'text-[#8B2323]' : 'text-[#7A6E62] hover:text-[#231F20]'
        }`}
      >
        <ReceiptText className="w-5 h-5" />
        <span className="text-[11px] font-semibold">Món đã gọi</span>
      </button>
    </nav>
  );
}
