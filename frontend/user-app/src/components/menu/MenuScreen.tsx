'use client';

import React, { useState } from 'react';
import { Loader2, UtensilsCrossed, AlertTriangle, RefreshCw } from 'lucide-react';
import { useMenu } from '@/hooks/useMenu';
import { useTableSession } from '@/hooks/useTableSession';
import { useCallStaff } from '@/hooks/useCallStaff';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/orderService';
import { Dish } from '@/types/menu';
import { MenuHeader } from './MenuHeader';
import { MenuSearchBar } from './MenuSearchBar';
import { MenuCategoryTabs } from './MenuCategoryTabs';
import { DishCard } from './DishCard';
import { DishDetailModal } from './DishDetailModal';
import { BottomNavigation, NavTab } from './BottomNavigation';
import { CallStaffModal } from '@/components/welcome/CallStaffModal';
import { CartScreen } from '@/components/cart/CartScreen';
import { OrderedDishesScreen } from '@/components/cart/OrderedDishesScreen';
import { OrderConfirmationScreen } from '@/components/cart/OrderConfirmationScreen';
import { OrderSuccessScreen } from '@/components/cart/OrderSuccessScreen';
import { OrderSuccessData } from '@/types/order';

export function MenuScreen() {
  const { tableName, tableNumber } = useTableSession();
  const { callStaffStatus, closeFeedbackModal } = useCallStaff();
  const { cartItems, tableNote, clearCart, grandTotal } = useCart();
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

  // Trạng thái màn hình Xác Nhận Đặt Món & Đặt Món Thành Công
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [successOrderData, setSuccessOrderData] = useState<OrderSuccessData | null>(null);
  const [initialTrackingOrderId, setInitialTrackingOrderId] = useState<number | undefined>(undefined);

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0 || isSubmittingOrder) return;

    setIsSubmittingOrder(true);
    try {
      const result = await orderService.submitOrder(
        tableNumber,
        cartItems,
        tableNote
      );

      if (result.success) {
        // Lưu thông tin đơn vừa đặt để hiển thị trên màn hình Xác Nhận Đặt Món Thành Công
        setSuccessOrderData({
          orderId: result.orderId,
          orderCode: result.orderCode || '#DH102',
          tableName: tableName,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          }),
          items: [...cartItems],
          grandTotal: grandTotal,
        });

        clearCart();
        setIsConfirmingOrder(false);
      }
    } catch (err) {
      console.error('Lỗi khi gửi đơn đặt món:', err);
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen w-full bg-[#EAE3D9] flex justify-center items-stretch overflow-hidden">
      {/* Mobile-contained Column - Chiều cao cố định chuẩn mobile viewport, không bị dãn khi thêm món */}
      <main className="w-full max-w-[420px] h-full max-h-full bg-[#FAF7F2] border-x border-[#E2D9CC] shadow-sm flex flex-col justify-between overflow-hidden relative">
        {/* Top Header - Luôn cố định phía trên: Bàn số 05 • Casa Cozy & Gọi NV */}
        <div className="w-full shrink-0 z-20 bg-[#FAF7F2]">
          <MenuHeader />
        </div>

        {/* Scrollable Middle Content Area - Chỉ duy nhất vùng ở giữa cuộn nội dung */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar flex flex-col relative">
          {activeTab === 'menu' && (
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Thanh tìm kiếm và danh mục cố định phía trên danh sách món */}
              <div className="w-full shrink-0 bg-[#FAF7F2] z-10">
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

              {/* Scrollable Dish List: Chỉ lăn chuột cuộn riêng danh sách món ăn */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 py-2 pb-6 flex flex-col gap-3">
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
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#8B2323] hover:bg-[#781E1E] text-white text-xs font-bold rounded-xl shadow active:scale-95 transition"
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
            </div>
          )}

          {activeTab === 'cart' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              {successOrderData ? (
                <OrderSuccessScreen
                  data={successOrderData}
                  onViewOrdered={() => {
                    const trackingId = successOrderData?.orderId;
                    setSuccessOrderData(null);
                    setInitialTrackingOrderId(trackingId);
                    setActiveTab('ordered');
                  }}
                  onBackToMenu={() => {
                    setSuccessOrderData(null);
                    setInitialTrackingOrderId(undefined);
                    setActiveTab('menu');
                  }}
                />
              ) : isConfirmingOrder && cartItems.length > 0 ? (
                <OrderConfirmationScreen
                  onBackToCart={() => setIsConfirmingOrder(false)}
                  onConfirmOrder={handleConfirmOrder}
                  isSubmitting={isSubmittingOrder}
                />
              ) : (
                <CartScreen
                  onBackToMenu={() => setActiveTab('menu')}
                  onProceedToConfirm={() => setIsConfirmingOrder(true)}
                />
              )}
            </div>
          )}

          {activeTab === 'ordered' && (
            <div className="flex-1 min-h-0 overflow-y-auto">
              <OrderedDishesScreen
                initialOrderId={initialTrackingOrderId}
                onBackToMenu={() => {
                  setInitialTrackingOrderId(undefined);
                  setActiveTab('menu');
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Navigation - Luôn cố định phía dưới: Thực đơn, Giỏ hàng, Món đã gọi */}
        <div className="w-full shrink-0 z-20 bg-white">
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={(tab) => {
              if (successOrderData) setSuccessOrderData(null);
              if (tab !== 'ordered') setInitialTrackingOrderId(undefined);
              setActiveTab(tab);
            }}
          />
        </div>
      </main>

      {/* Dish Detail Bottom Sheet Modal */}
      {selectedDishForDetail && (
        <DishDetailModal
          key={selectedDishForDetail.id}
          dish={selectedDishForDetail}
          isOpen={Boolean(selectedDishForDetail)}
          onClose={() => setSelectedDishForDetail(null)}
        />
      )}

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
