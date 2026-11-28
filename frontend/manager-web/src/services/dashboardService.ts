import { DashboardData, TableItem, RecentOrder, BestSellingDish, MetricCard, TableStatus, OrderStatus, DashboardTimeRange } from '@/types/dashboard';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface BackendTable {
  ma_ban: number;
  ten_ban: string;
  trang_thai: string;
  don_hang_hien_tai?: {
    ma_don: number;
    so_mon: number;
    thoi_gian_tao: string;
    thoi_gian_bat_dau?: string;
    tong_tien: number;
    trang_thai: string;
    so_don?: number;
    danh_sach_ma_don?: number[];
    has_pending?: boolean;
  } | null;
}

export interface BackendOrderDetail {
  ma_ct?: number;
  ma_mon: number;
  so_luong: number;
  don_gia: number;
  monan?: {
    ma_mon: number;
    ten_mon: string;
  };
}

export interface BackendOrder {
  ma_don: number;
  ma_ban: number;
  ma_nv?: number | null;
  tong_tien: number;
  trang_thai: string;
  thoi_gian_tao: string;
  ban?: { ma_ban: number; ten_ban: string };
  nhanvien?: { ma_nv: number; ho_ten: string };
  chitietdonhang?: BackendOrderDetail[];
}

function mapTableStatus(rawStatus?: string, hasActiveOrder?: boolean): { status: TableStatus; statusText: string } {
  if (hasActiveOrder) {
    return { status: 'SERVING', statusText: 'Đang phục vụ' };
  }
  if (!rawStatus) return { status: 'AVAILABLE', statusText: 'Sẵn sàng' };
  const s = rawStatus.toLowerCase();
  if (s.includes('phuc vu') || s.includes('khach')) {
    return { status: 'SERVING', statusText: 'Có phục vụ' };
  }
  if (s.includes('dat') || s.includes('reserve')) {
    return { status: 'RESERVED', statusText: 'Đặt trước' };
  }
  return { status: 'AVAILABLE', statusText: 'Sẵn sàng' };
}

function mapOrderStatus(rawStatus?: string): { status: OrderStatus; statusText: string } {
  if (!rawStatus) return { status: 'WAITING_KITCHEN', statusText: 'Chờ xác nhận' };
  const s = rawStatus.toLowerCase();
  if (s.includes('cho') || s.includes('xac nhan') || s.includes('tiep nhan') || s.includes('pending')) {
    return { status: 'WAITING_KITCHEN', statusText: 'Chờ xác nhận' };
  }
  if (s.includes('chuan bi') || s.includes('cooking') || s.includes('nau') || s.includes('che bien')) {
    return { status: 'COOKING', statusText: 'Đang chuẩn bị' };
  }
  if (s.includes('phuc vu') || s.includes('len mon') || s.includes('ra mon') || s.includes('hoan tat')) {
    return { status: 'SERVED', statusText: 'Đã lên món' };
  }
  if (s.includes('huy') || s.includes('cancel')) {
    return { status: 'CANCELLED', statusText: 'Đã hủy' };
  }
  return { status: 'WAITING_KITCHEN', statusText: 'Chờ xác nhận' };
}

export function isOrderInTimeRange(
  dateStr: string | undefined,
  timeRange: DashboardTimeRange
): boolean {
  if (timeRange === 'ALL') return true;
  if (!dateStr) return false;

  const normalized = dateStr.includes('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
  const orderDate = new Date(normalized);
  if (isNaN(orderDate.getTime())) return false;

  const now = new Date();

  if (timeRange === 'TODAY') {
    return (
      orderDate.getDate() === now.getDate() &&
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    );
  }

  if (timeRange === '7_DAYS') {
    const sevenDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    return orderDate >= sevenDaysAgo;
  }

  if (timeRange === 'THIS_MONTH') {
    return (
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    );
  }

  if (timeRange === 'THIS_YEAR') {
    return orderDate.getFullYear() === now.getFullYear();
  }

  return true;
}

export const dashboardService = {
  /**
   * Tải toàn bộ dữ liệu thô (Bàn ăn & Đơn hàng) từ API
   */
  async getDashboardRawData(): Promise<{ rawTables: BackendTable[]; rawOrders: BackendOrder[] }> {
    try {
      const token = authService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const [tablesRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tables`, { headers }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch(`${API_BASE_URL}/orders/staff`, { headers }).then((r) => (r.ok ? r.json() : null)).catch(() => null),
      ]);

      const rawTables: BackendTable[] = tablesRes?.success && Array.isArray(tablesRes.data) ? tablesRes.data : [];
      const rawOrders: BackendOrder[] = ordersRes?.success && Array.isArray(ordersRes.data) ? ordersRes.data : [];

      return { rawTables, rawOrders };
    } catch {
      return { rawTables: [], rawOrders: [] };
    }
  },

  /**
   * Tính toán dữ liệu Dashboard dựa trên khoảng thời gian được chọn (0ms delay via client computation)
   */
  computeDashboard(
    rawTables: BackendTable[],
    rawOrders: BackendOrder[],
    timeRange: DashboardTimeRange = 'TODAY'
  ): DashboardData {
    // 1. Map Sơ đồ bàn ăn thực tế (real-time, không phụ thuộc bộ lọc thời gian)
    const tables: TableItem[] = rawTables.map((t) => {
      const hasActiveOrder = Boolean(t.don_hang_hien_tai);
      const { status, statusText } = mapTableStatus(t.trang_thai, hasActiveOrder);

      let capacityText = 'Bàn trống';
      let detailNote = 'Bàn sạch sẽ';
      let subAmount: string | undefined = undefined;

      if (status === 'SERVING') {
        const active = t.don_hang_hien_tai;
        if (active) {
          const orderCount = active.so_don || 1;
          capacityText = orderCount > 1
            ? `${active.so_mon} món (${orderCount} đợt gọi)`
            : `${active.so_mon} món`;

          if (orderCount > 1 && active.danh_sach_ma_don?.length) {
            detailNote = active.danh_sach_ma_don.map((m) => `#DH${String(m).padStart(3, '0')}`).join(' • ');
          } else {
            detailNote = `Đơn #DH${String(active.ma_don).padStart(3, '0')}`;
          }

          if (active.tong_tien !== undefined) {
            subAmount = `Tạm tính: ${new Intl.NumberFormat('vi-VN').format(active.tong_tien)} VNĐ`;
          }
        } else {
          capacityText = 'Đang phục vụ';
          detailNote = 'Có khách';
        }
      } else if (status === 'RESERVED') {
        capacityText = 'Đã đặt trước';
        detailNote = 'Khách đặt trước';
      }

      return {
        id: String(t.ma_ban),
        code: t.ten_ban || `Bàn ${String(t.ma_ban).padStart(2, '0')}`,
        status,
        statusText,
        capacityText,
        detailNote,
        subAmount,
        hasAlert: hasActiveOrder && Boolean(
          t.don_hang_hien_tai?.has_pending ||
          t.don_hang_hien_tai?.trang_thai?.toLowerCase().includes('cho')
        ),
      };
    });

    // 2. Lọc danh sách đơn chuẩn xác theo ngày tạo
    const filteredOrders = rawOrders.filter((o) => isOrderInTimeRange(o.thoi_gian_tao, timeRange));

    // 3. Tính toán Chỉ số KPI thực tế theo khoảng thời gian
    const validOrders = filteredOrders.filter((o) => !o.trang_thai?.toLowerCase().includes('huy'));
    const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.tong_tien) || 0), 0);
    const totalOrdersCount = validOrders.length;
    const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    const totalTables = tables.length;
    const activeTables = tables.filter((t) => t.status === 'SERVING').length;
    const occupancyRate = totalTables > 0 ? Math.round((activeTables / totalTables) * 100) : 0;

    let revenueTitle = 'Tổng Doanh Thu Hôm Nay';
    let ordersTitle = 'Hóa Đơn Hôm Nay';
    let comparisonRevenue = `${totalOrdersCount} đơn hàng ghi nhận hôm nay`;

    if (timeRange === '7_DAYS') {
      revenueTitle = 'Tổng Doanh Thu 7 Ngày Qua';
      ordersTitle = 'Hóa Đơn 7 Ngày Qua';
      comparisonRevenue = `${totalOrdersCount} đơn hàng 7 ngày qua`;
    } else if (timeRange === 'THIS_MONTH') {
      revenueTitle = 'Tổng Doanh Thu Tháng Này';
      ordersTitle = 'Hóa Đơn Tháng Này';
      comparisonRevenue = `${totalOrdersCount} đơn hàng tháng này`;
    } else if (timeRange === 'THIS_YEAR') {
      revenueTitle = 'Tổng Doanh Thu Năm Nay';
      ordersTitle = 'Hóa Đơn Năm Nay';
      comparisonRevenue = `${totalOrdersCount} đơn hàng năm nay`;
    } else if (timeRange === 'ALL') {
      revenueTitle = 'Tổng Doanh Thu Toàn Bộ';
      ordersTitle = 'Tổng Lượt Hóa Đơn';
      comparisonRevenue = `${totalOrdersCount} đơn hàng ghi nhận`;
    }

    const metrics: MetricCard[] = [
      {
        id: 'rev',
        title: revenueTitle,
        value: `${new Intl.NumberFormat('vi-VN').format(totalRevenue)} VNĐ`,
        numberValue: new Intl.NumberFormat('vi-VN').format(totalRevenue),
        unit: 'VNĐ',
        comparisonText: totalOrdersCount > 0 ? comparisonRevenue : 'Chưa có phát sinh',
        isPositive: true,
        type: 'revenue',
      },
      {
        id: 'orders',
        title: ordersTitle,
        value: `${totalOrdersCount} hóa đơn`,
        numberValue: String(totalOrdersCount),
        unit: 'hóa đơn',
        comparisonText: `${activeTables} bàn đang phục vụ`,
        isPositive: true,
        type: 'orders',
      },
      {
        id: 'aov',
        title: 'Giá Trị Đơn Trung Bình (AOV)',
        value: `${new Intl.NumberFormat('vi-VN').format(aov)} VNĐ/đơn`,
        numberValue: new Intl.NumberFormat('vi-VN').format(aov),
        unit: 'VNĐ/đơn',
        comparisonText: 'Mức chi tiêu trung bình',
        isPositive: true,
        type: 'aov',
      },
      {
        id: 'occupancy',
        title: 'Bàn Đang Phục Vụ',
        value: `${activeTables} /${totalTables} bàn`,
        numberValue: String(activeTables),
        unit: `/${totalTables} bàn`,
        comparisonText: `Tỷ lệ lấp đầy: ${occupancyRate}%`,
        isPositive: true,
        type: 'occupancy',
        extraInfo: {
          totalTables,
          activeTables,
          occupancyRate,
        },
      },
    ];

    // 4. Đơn hàng gần đây thực tế (trong khoảng thời gian đã chọn)
    const recentOrders: RecentOrder[] = filteredOrders.slice(0, 10).map((ord) => {
      const { status, statusText } = mapOrderStatus(ord.trang_thai);
      const rawDate = ord.thoi_gian_tao;
      const normalizedDateStr = rawDate
        ? rawDate.includes('Z') || rawDate.includes('+')
          ? rawDate
          : `${rawDate}Z`
        : null;
      const dateObj = new Date(normalizedDateStr || Date.now());
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const dateFormatted = `${day}/${month}/${year}`;
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const time = `${hours}:${minutes}`;

      const items = Array.isArray(ord.chitietdonhang) ? ord.chitietdonhang : [];
      const itemsSummary = items.length > 0
        ? items.map((i) => `${i.so_luong || 1}x ${i.monan?.ten_mon || `Món #${i.ma_mon}`}`).join(', ')
        : 'Đơn gọi món tại bàn';

      return {
        id: String(ord.ma_don),
        code: `#DH${String(ord.ma_don).padStart(3, '0')}`,
        tableNumber: String(ord.ma_ban || '01').padStart(2, '0'),
        tableName: ord.ban?.ten_ban || `Bàn ${ord.ma_ban || ''}`,
        waiterId: ord.ma_nv ? `NV-${String(ord.ma_nv).padStart(2, '0')}` : 'NV-01',
        waiterName: ord.nhanvien?.ho_ten || 'Chưa phân công',
        time,
        date: dateFormatted,
        timeAgo: 'Hôm nay',
        itemsSummary,
        totalAmount: `${new Intl.NumberFormat('vi-VN').format(ord.tong_tien || 0)} VNĐ`,
        status,
        statusText,
      };
    });

    // 5. Tổng hợp Top Món Bán Chạy thực tế từ chi tiết các đơn trong khoảng thời gian đã chọn
    const dishSalesMap = new Map<number, { name: string; count: number; totalRev: number; price: number }>();
    for (const ord of filteredOrders) {
      if (ord.trang_thai?.toLowerCase().includes('huy')) continue;
      if (Array.isArray(ord.chitietdonhang)) {
        for (const ct of ord.chitietdonhang) {
          if (!ct.ma_mon) continue;
          const existing = dishSalesMap.get(ct.ma_mon) || {
            name: ct.monan?.ten_mon || `Món ăn #${ct.ma_mon}`,
            count: 0,
            totalRev: 0,
            price: ct.don_gia || 0,
          };
          const qty = ct.so_luong || 1;
          existing.count += qty;
          existing.totalRev += qty * (ct.don_gia || 0);
          dishSalesMap.set(ct.ma_mon, existing);
        }
      }
    }

    const sortedDishes = Array.from(dishSalesMap.values()).sort((a, b) => b.count - a.count);
    const maxCount = sortedDishes[0]?.count || 1;
    const topDishes: BestSellingDish[] = sortedDishes.slice(0, 5).map((d, idx) => ({
      rank: idx + 1,
      name: d.name,
      soldCount: d.count,
      pricePerPortion: `${new Intl.NumberFormat('vi-VN').format(d.price)} VNĐ`,
      totalRevenue: `${new Intl.NumberFormat('vi-VN').format(d.totalRev)} VNĐ`,
      percentage: Math.min(100, Math.round((d.count / maxCount) * 100)),
    }));

    return {
      metrics,
      tables,
      topDishes,
      recentOrders,
      totalOrdersCount,
      timeRange,
    };
  },

  /**
   * Phương thức tổng hợp đầy đủ tiện lợi
   */
  async getDashboardData(timeRange: DashboardTimeRange = 'TODAY'): Promise<DashboardData> {
    const raw = await this.getDashboardRawData();
    return this.computeDashboard(raw.rawTables, raw.rawOrders, timeRange);
  },

  async refreshShift(timeRange: DashboardTimeRange = 'TODAY'): Promise<DashboardData> {
    return this.getDashboardData(timeRange);
  },
};
