'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCards } from '@/components/dashboard/StatCards';
import { TableMap } from '@/components/dashboard/TableMap';
import { TopDishes } from '@/components/dashboard/TopDishes';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { DashboardTimeFilter } from '@/components/dashboard/DashboardTimeFilter';
import { TablePaymentModal } from '@/components/table/TablePaymentModal';
import { RefreshIcon } from '@/components/common/Icons';
import { useDashboard } from '@/hooks/useDashboard';
import { authService } from '@/services/authService';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('auth_state_changed', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('auth_state_changed', callback);
  };
}

export default function ManagerDashboardPage() {
  const router = useRouter();

  // 1. Kiểm tra Token bằng useSyncExternalStore chuẩn React 19
  const token = useSyncExternalStore(
    subscribe,
    () => authService.getToken(),
    () => null
  );

  // 2. Nếu đã ở trên Client mà không có token -> Chuyển hướng sang /login
  useEffect(() => {
    const currentToken = authService.getToken();
    if (!currentToken) {
      router.replace('/login');
    }
  }, [router]);

  const {
    data,
    loading,
    isRefreshing,
    timeRange,
    setTimeRange,
    tableFilter,
    setTableFilter,
    tableCounts,
    filteredTables,
    orderSearchQuery,
    setOrderSearchQuery,
    filteredOrders,
    handleRefreshShift,
  } = useDashboard();

  const [paymentTable, setPaymentTable] = useState<{ id: number | string; name?: string } | null>(null);

  // A. Trường hợp chưa có token: Hiển thị thông báo chuyển hướng sang /login
  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF7F2] text-[#8E2813] font-semibold text-sm">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  // B. Trường hợp đã có token nhưng đang tải dữ liệu Dashboard ban đầu
  if (loading || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FAF7F2] text-[#8E2813] font-semibold text-sm">
        Đang tải dữ liệu ca trực Casa Cozy Bistro...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FAF7F2]">
      {/* 1. Sidebar cố định bên trái - Không bị cuộn khi xem trang */}
      <Sidebar />

      {/* 2. Cột nội dung bên phải: Header cố định phía trên, chỉ main cuộn */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
          {/* Header tiêu đề Bảng Điều Khiển & Bộ lọc thời gian + Nút làm mới ca trực */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-[#26201E] tracking-tight">
                Bảng Điều Khiển
              </h1>
              <p className="text-xs text-[#7C7267] mt-1 font-normal">
                Giám sát trạng thái bàn ăn, tiến độ chế biến và luồng đơn hàng trực tiếp tại nhà hàng Casa Cozy Bistro.
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-2.5 self-start md:self-auto">
              <DashboardTimeFilter selected={timeRange} onChange={setTimeRange} />

              <button
                type="button"
                onClick={handleRefreshShift}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#EAE3D6] rounded-xl text-xs font-bold text-[#342A27] hover:bg-[#FAF7F2] shadow-2xs transition-colors cursor-pointer"
              >
                <RefreshIcon className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm Mới Ca Trực'}</span>
              </button>
            </div>
          </div>

          {/* 3. Khối 4 Thẻ chỉ số tổng quan */}
          <StatCards metrics={data.metrics} />

          {/* 4. Khối giữa: Sơ đồ bàn rộng hơn (1fr) + Top 5 món gọn gàng (~370px) */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_370px] gap-6 items-stretch">
            <div className="min-w-0">
              <TableMap
                tables={filteredTables}
                filter={tableFilter}
                onFilterChange={setTableFilter}
                counts={tableCounts}
                onPayTable={(id, name) => setPaymentTable({ id, name })}
              />
            </div>
            <div className="min-w-0">
              <TopDishes dishes={data.topDishes} />
            </div>
          </div>

          {/* 5. Khối dưới: Danh sách đơn hàng gần đây */}
          <RecentOrdersTable
            orders={filteredOrders}
            totalOrdersCount={data?.totalOrdersCount ?? data?.recentOrders.length}
            searchQuery={orderSearchQuery}
            onSearchChange={setOrderSearchQuery}
          />
        </main>
      </div>

      {/* Modal Thanh toán Bàn từ Sơ đồ bàn ăn trực tiếp */}
      <TablePaymentModal
        isOpen={Boolean(paymentTable)}
        tableId={paymentTable?.id || null}
        tableName={paymentTable?.name}
        onClose={() => setPaymentTable(null)}
        onSuccess={() => {
          setPaymentTable(null);
          handleRefreshShift();
        }}
      />
    </div>
  );
}
