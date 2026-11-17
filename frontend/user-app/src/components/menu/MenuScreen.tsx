'use client';

import React, { useState } from 'react';
import { Loader2, UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { useTableSession } from '@/hooks/useTableSession';
import { useCallStaff } from '@/hooks/useCallStaff';
import { Dish } from '@/types/menu';
import { MenuHeader } from './MenuHeader';
import { MenuSearchBar } from './MenuSearchBar';
import { MenuCategoryTabs } from './MenuCategoryTabs';
import { DishCard } from './DishCard';
import { DishDetailModal } from './DishDetailModal';
import { BottomNavigation, NavTab } from './BottomNavigation';
import { CallStaffModal } from '@/components/welcome/CallStaffModal';

export function MenuScreen() {
  const { tableName } = useTableSession();
  const { callStaffStatus, closeFeedbackModal } = useCallStaff();
  const {
    categories,
    filteredDishes,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    totalDishesCount,
    isLoading,
    error,
    refetch,
  } = useMenu();

  const [activeTab, setActiveTab] = useState<NavTab>('menu');
  const [selectedDishForDetail, setSelectedDishForDetail] = useState<Dish | null>(null);

  return (
    <div className="min-h-screen w-full bg-[#EAE3D9] flex justify-center items-stretch">
      {/* Mobile-contained Column */}
      <main className="w-full max-w-[420px] min-h-screen bg-[#FAF7F2] border-x border-[#E2D9CC] shadow-sm flex flex-col justify-between relative">
        {/* Top Header */}
        <div className="w-full shrink-0">
          <MenuHeader />
          <MenuSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onFilterClick={() => {}}
          />
          <MenuCategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
            totalDishesCount={totalDishesCount}
          />
        </div>

        {/* Scrollable Dish List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 pb-6 flex flex-col gap-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#7A6E62]">
              <Loader2 className="w-8 h-8 animate-spin text-[#8B2323] mb-3" />
              <p className="text-xs font-semibold">Đang tải thực đơn Casa Cozy...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF2EC] border border-[#F6D8C8] flex items-center justify-center text-[#8B2323] mb-3 shadow-sm">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h4 className="text-sm font-bold text-[#231F20] mb-1">
                Không thể tải thực đơn
              </h4>
              <p className="text-xs text-[#7A6E62] mb-4 max-w-[280px] leading-relaxed">
                {error}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#8B2323] hover:bg-[#721c1c] text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Thử kết nối lại
              </button>
            </div>
          ) : filteredDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F5EFE6] flex items-center justify-center text-[#8B2323] mb-3">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-[#231F20]">
                Không tìm thấy món ăn nào
              </h4>
              <p className="text-xs text-[#7A6E62] mt-1">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác.
              </p>
            </div>
          ) : (
            filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onOpenDetail={(d) => setSelectedDishForDetail(d)}
              />
            ))
          )}
        </div>

        {/* Fixed Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </main>

      {/* Dish Detail Bottom Sheet Modal */}
      <DishDetailModal
        dish={selectedDishForDetail}
        isOpen={Boolean(selectedDishForDetail)}
        onClose={() => setSelectedDishForDetail(null)}
      />

      {/* Staff Call Feedback Modal */}
      <CallStaffModal
        isOpen={callStaffStatus.open}
        onClose={closeFeedbackModal}
        tableName={tableName}
        message={callStaffStatus.message}
        success={callStaffStatus.success}
      />
    </div>
  );
}
