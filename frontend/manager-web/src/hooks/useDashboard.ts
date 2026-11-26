import { useState, useEffect, useMemo, useCallback } from 'react';
import { DashboardData, TableItem, RecentOrder, DashboardTimeRange } from '@/types/dashboard';
import { dashboardService, BackendTable, BackendOrder } from '@/services/dashboardService';
import { authService } from '@/services/authService';
import { NewOrderNotification, subscribeToNewOrders } from '@/lib/realtime';

export type TableFilterType = 'all' | 'occupied' | 'available' | 'reserved';

export function useDashboard() {
  const [rawData, setRawData] = useState<{ rawTables: BackendTable[]; rawOrders: BackendOrder[] } | null>(null);
  const [timeRange, setTimeRange] = useState<DashboardTimeRange>('TODAY');
  const [loading, setLoading] = useState<boolean>(true);
  const [tableFilter, setTableFilter] = useState<TableFilterType>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [newOrderNotification, setNewOrderNotification] = useState<NewOrderNotification | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardRawData();
        setRawData(res);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRefreshShift = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const refreshed = await dashboardService.getDashboardRawData();
      setRawData(refreshed);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    return subscribeToNewOrders(token, (order) => {
      setNewOrderNotification(order);
      handleRefreshShift().catch((error: unknown) => {
        console.error('Không thể cập nhật dashboard sau khi nhận đơn mới:', error);
      });
    });
  }, [handleRefreshShift]);

  // Tính toán dữ liệu Dashboard tức thì (0ms latency) khi chuyển đổi nút bộ lọc thời gian
  const data = useMemo<DashboardData | null>(() => {
    if (!rawData) return null;
    return dashboardService.computeDashboard(rawData.rawTables, rawData.rawOrders, timeRange);
  }, [rawData, timeRange]);

  // Lọc bàn theo tab (Tất cả, Có khách, Bàn trống, Đặt trước)
  const filteredTables = useMemo<TableItem[]>(() => {
    if (!data) return [];
    switch (tableFilter) {
      case 'occupied':
        return data.tables.filter((t) => t.status !== 'AVAILABLE' && t.status !== 'RESERVED');
      case 'available':
        return data.tables.filter((t) => t.status === 'AVAILABLE');
      case 'reserved':
        return data.tables.filter((t) => t.status === 'RESERVED');
      default:
        return data.tables;
    }
  }, [data, tableFilter]);

  // Đếm số lượng theo trạng thái bàn
  const tableCounts = useMemo(() => {
    if (!data) return { all: 0, occupied: 0, available: 0, reserved: 0 };
    return {
      all: data.tables.length,
      occupied: data.tables.filter((t) => t.status !== 'AVAILABLE' && t.status !== 'RESERVED').length,
      available: data.tables.filter((t) => t.status === 'AVAILABLE').length,
      reserved: data.tables.filter((t) => t.status === 'RESERVED').length,
    };
  }, [data]);

  // Tìm kiếm đơn hàng theo mã đơn, tên bàn hoặc nhân viên
  const filteredOrders = useMemo<RecentOrder[]>(() => {
    if (!data) return [];
    if (!orderSearchQuery.trim()) return data.recentOrders;
    const q = orderSearchQuery.toLowerCase();
    return data.recentOrders.filter(
      (ord) =>
        ord.code.toLowerCase().includes(q) ||
        ord.tableName.toLowerCase().includes(q) ||
        ord.waiterName.toLowerCase().includes(q)
    );
  }, [data, orderSearchQuery]);

  return {
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
    newOrderNotification,
    dismissNewOrderNotification: () => setNewOrderNotification(null),
  };
}
