'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { OrderItem, OrderStatus, OrderStats, OrderFiltersState, CreateOrderInput } from '@/types/order';
import { orderService } from '@/services/orderService';

export function useOrder() {
  const [orderList, setOrderList] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Bộ lọc
  const [filters, setFilters] = useState<OrderFiltersState>({
    searchQuery: '',
    statusTab: 'ALL',
    tableFilter: 'ALL',
  });

  // Modal xem chi tiết
  const [viewingOrder, setViewingOrder] = useState<OrderItem | null>(null);

  // Modal tạo đơn tại bàn
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Tải danh sách đơn hàng
  const loadData = useCallback(() => {
    setLoading(true);
    orderService
      .getOrderList()
      .then((orders) => {
        setOrderList(orders);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    orderService
      .getOrderList()
      .then((orders) => {
        if (!ignore) {
          setOrderList(orders);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Tính toán 4 thẻ thống kê ở đầu màn hình
  const stats: OrderStats = useMemo(() => {
    const totalToday = orderList.length;
    const pending = orderList.filter((o) => o.status === 'PENDING').length;
    const cooking = orderList.filter((o) => o.status === 'COOKING').length;
    const completed = orderList.filter((o) => o.status === 'COMPLETED' || o.status === 'SERVED').length;

    return {
      totalToday,
      growthRate: totalToday > 0 ? '+100%' : '0%',
      pending,
      cooking,
      completed,
      onTimeRate: '100%',
    };
  }, [orderList]);

  // Bộ đếm cho các Tab lọc
  const tabCounts = useMemo(() => {
    return {
      ALL: orderList.length,
      PENDING: orderList.filter((o) => o.status === 'PENDING').length,
      COOKING: orderList.filter((o) => o.status === 'COOKING').length,
      COMPLETED: orderList.filter((o) => o.status === 'COMPLETED' || o.status === 'SERVED').length,
      CANCELLED: orderList.filter((o) => o.status === 'CANCELLED').length,
    };
  }, [orderList]);

  // Lọc dữ liệu theo tab & tìm kiếm
  const filteredOrders = useMemo(() => {
    return orderList.filter((order) => {
      // 1. Lọc theo tab trạng thái
      if (filters.statusTab === 'PENDING' && order.status !== 'PENDING') return false;
      if (filters.statusTab === 'COOKING' && order.status !== 'COOKING') return false;
      if (
        filters.statusTab === 'COMPLETED' &&
        order.status !== 'COMPLETED' &&
        order.status !== 'SERVED'
      )
        return false;
      if (filters.statusTab === 'CANCELLED' && order.status !== 'CANCELLED') return false;

      // 2. Lọc theo từ khóa tìm kiếm
      const q = filters.searchQuery.toLowerCase().trim();
      if (q) {
        const matchCode = order.code.toLowerCase().includes(q);
        const matchTable = order.tableName.toLowerCase().includes(q);
        const matchEmployee = order.employeeName.toLowerCase().includes(q);
        const matchItems = order.itemsSummary.toLowerCase().includes(q);
        if (!matchCode && !matchTable && !matchEmployee && !matchItems) {
          return false;
        }
      }

      return true;
    });
  }, [orderList, filters]);

  // Phân trang với safeCurrentPage
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedOrders = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safeCurrentPage, pageSize]);

  // Tự động về trang 1 khi lọc
  const updateFilters = useCallback(
    (action: Partial<OrderFiltersState> | ((prev: OrderFiltersState) => OrderFiltersState)) => {
      setFilters((prev) => {
        const next = typeof action === 'function' ? action(prev) : { ...prev, ...action };
        return next;
      });
      setCurrentPage(1);
    },
    []
  );

  // Thao tác nhanh trạng thái đơn hàng
  const handleUpdateStatus = useCallback(async (id: string, newStatus: OrderStatus, newText: string) => {
    setOrderList((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: newStatus, statusText: newText } : order
      )
    );
    await orderService.updateOrderStatus(id, newStatus);
  }, []);

  const acceptOrder = useCallback(
    (id: string) => handleUpdateStatus(id, 'COOKING', 'Đang nấu'),
    [handleUpdateStatus]
  );

  const serveOrder = useCallback(
    (id: string) => handleUpdateStatus(id, 'SERVED', 'Đã lên món'),
    [handleUpdateStatus]
  );

  const completeOrder = useCallback(
    (id: string) => handleUpdateStatus(id, 'COMPLETED', 'Đã phục vụ'),
    [handleUpdateStatus]
  );

  // In hóa đơn
  const printReceipt = useCallback((order: OrderItem) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn - ${order.code}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; font-size: 13px; line-height: 1.5; color: #26201E; }
            h2 { margin: 0; color: #8E2813; }
            .header { text-align: center; border-bottom: 1px dashed #ccc; padding-bottom: 12px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 6px; }
            .total { font-weight: bold; font-size: 15px; border-top: 1px solid #000; padding-top: 8px; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>CASA COZY BISTRO</h2>
            <p>HÓA ĐƠN THANH TOÁN BÀN: ${order.tableName}</p>
            <p>Mã đơn: ${order.code} | Giờ: ${order.time}</p>
          </div>
          <div>
            ${order.items.map((i) => `
              <div class="row">
                <span>${i.quantity}x ${i.dishName}</span>
                <span>${new Intl.NumberFormat('vi-VN').format(i.price * i.quantity)} đ</span>
              </div>
            `).join('')}
          </div>
          <div class="row total">
            <span>TỔNG TIỀN:</span>
            <span>${order.formattedTotal}</span>
          </div>
          <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #888;">
            Xin cảm ơn quý khách và hẹn gặp lại!
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }, []);

  // Xuất file Excel / CSV
  const exportExcel = useCallback(() => {
    if (orderList.length === 0) return;
    const header = 'Mã đơn,Bàn,Nhân viên,Món ăn,Tổng tiền,Thời gian,Trạng thái\n';
    const rows = orderList
      .map(
        (o) =>
          `"${o.code}","${o.tableName}","${o.employeeName}","${o.itemsSummary}",${o.totalAmount},"${o.time}","${o.statusText}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CasaCozy_DonHang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [orderList]);

  // Tạo đơn hàng mới
  const submitCreateOrder = useCallback(async (input: CreateOrderInput) => {
    const res = await orderService.createOrder(input);
    if (res.success) {
      loadData();
    }
    return res;
  }, [loadData]);

  return {
    orderList: paginatedOrders,
    rawOrders: orderList,
    stats,
    tabCounts,
    totalItems,
    totalPages,
    currentPage: safeCurrentPage,
    setCurrentPage,
    loading,
    filters,
    setFilters: updateFilters,
    refreshOrders: loadData,
    exportExcel,

    // Thao tác đơn hàng
    acceptOrder,
    serveOrder,
    completeOrder,
    printReceipt,

    // Modal Xem chi tiết
    viewingOrder,
    openViewModal: setViewingOrder,
    closeViewModal: () => setViewingOrder(null),

    // Modal Tạo đơn tại bàn
    isCreateOpen,
    openCreateModal: () => setIsCreateOpen(true),
    closeCreateModal: () => setIsCreateOpen(false),
    submitCreateOrder,
  };
}
