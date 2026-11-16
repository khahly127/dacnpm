'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OrderHeader } from '@/components/order/OrderHeader';
import { OrderStatCards } from '@/components/order/OrderStatCards';
import { OrderFilters } from '@/components/order/OrderFilters';
import { OrderTable } from '@/components/order/OrderTable';
import { OrderDetailModal } from '@/components/order/OrderDetailModal';
import { CreateOrderModal } from '@/components/order/CreateOrderModal';
import { useOrder } from '@/hooks/useOrder';
import { authService } from '@/services/authService';
import { CreateOrderInput } from '@/types/order';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function OrderPage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Kiểm tra đăng nhập
  const token = useSyncExternalStore(
    subscribe,
    () => authService.getToken(),
    () => null
  );

  useEffect(() => {
    if (!authService.getToken()) {
      router.replace('/login');
    }
  }, [router]);

  const {
    orderList,
    stats,
    tabCounts,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters,
    refreshOrders,
    exportExcel,

    // Thao tác đơn hàng
    acceptOrder,
    serveOrder,
    completeOrder,
    printReceipt,

    // Modal Xem chi tiết
    viewingOrder,
    openViewModal,
    closeViewModal,

    // Modal Tạo đơn tại bàn
    isCreateOpen,
    openCreateModal,
    closeCreateModal,
    submitCreateOrder,
  } = useOrder();

  const handleAcceptOrder = async (id: string) => {
    await acceptOrder(id);
    setToastMessage({
      type: 'success',
      text: 'Đã tiếp nhận đơn hàng, bếp bắt đầu chế biến!',
    });
  };

  const handleServeOrder = async (id: string) => {
    await serveOrder(id);
    setToastMessage({
      type: 'success',
      text: 'Đã báo ra món cho thực khách tại bàn!',
    });
  };

  const handleCompleteOrder = async (id: string) => {
    await completeOrder(id);
    setToastMessage({
      type: 'success',
      text: 'Đã hoàn tất đơn hàng thành công!',
    });
  };

  const handleCreateSubmit = async (input: CreateOrderInput) => {
    const res = await submitCreateOrder(input);
    if (res.success) {
      setToastMessage({
        type: 'success',
        text: 'Tạo đơn hàng tại bàn thành công!',
      });
    }
    return res;
  };

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF7F2] text-[#8E2813] font-semibold text-sm">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF7F2]">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Cột nội dung bên phải */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-5">
          {/* Toast thông báo nổi góc trên */}
          {toastMessage && (
            <div
              className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-200 ${
                toastMessage.type === 'success'
                  ? 'bg-white border-[#10B981] text-[#065F46]'
                  : 'bg-white border-[#C23924] text-[#C23924]'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#C23924] shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          )}

          {/* Tiêu đề & Nút thao tác (Xuất Excel & Tạo đơn tại bàn) */}
          <OrderHeader
            onAddOrder={openCreateModal}
            onExportExcel={exportExcel}
          />

          {/* 4 Thẻ chỉ số đơn hàng */}
          <OrderStatCards stats={stats} />

          {/* Thanh Tabs & Ô tìm kiếm */}
          <OrderFilters
            filters={filters}
            tabCounts={tabCounts}
            onFilterChange={setFilters}
            onRefresh={refreshOrders}
          />

          {/* Bảng danh sách đơn hàng */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-[#EAE3D6] p-12 text-center text-sm font-semibold text-[#8E2813]">
              Đang tải danh sách đơn hàng từ hệ thống...
            </div>
          ) : (
            <OrderTable
              orders={orderList}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={10}
              onPageChange={setCurrentPage}
              onAcceptOrder={handleAcceptOrder}
              onServeOrder={handleServeOrder}
              onCompleteOrder={handleCompleteOrder}
              onPrintReceipt={printReceipt}
              onViewOrder={openViewModal}
            />
          )}
        </main>
      </div>

      {/* Modal 1: Xem chi tiết đơn hàng */}
      <OrderDetailModal
        isOpen={Boolean(viewingOrder)}
        order={viewingOrder}
        onClose={closeViewModal}
        onPrint={printReceipt}
      />

      {/* Modal 2: Tạo đơn hàng tại bàn */}
      <CreateOrderModal
        isOpen={isCreateOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateSubmit}
      />
    </div>
  );
}
