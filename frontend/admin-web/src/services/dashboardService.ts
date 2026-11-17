import { DashboardData, TableItem, RecentOrder, BestSellingDish, MetricCard, TableStatus, OrderStatus } from '@/types/dashboard';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BackendTable {
  ma_ban: number;
  ten_ban: string;
  trang_thai: string;
  don_hang_hien_tai?: {
    ma_don: number;
    so_mon: number;
    thoi_gian_tao: string;
    tong_tien: number;
    trang_thai: string;
  } | null;
}

interface BackendOrderDetail {
  ma_ct?: number;
  ma_mon: number;
  so_luong: number;
  don_gia: number;
  monan?: {
    ma_mon: number;
    ten_mon: string;
  };
}

interface BackendOrder {
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
  if (!rawStatus) return { status: 'WAITING_KITCHEN', statusText: 'Chờ bếp' };
  const s = rawStatus.toLowerCase();
  if (s.includes('chuan bi') || s.includes('cooking') || s.includes('nau') || s.includes('che bien')) {
    return { status: 'COOKING', statusText: 'Đang nấu' };
  }
  if (s.includes('phuc vu') || s.includes('len mon') || s.includes('ra mon') || s.includes('hoan tat')) {
    return { status: 'SERVED', statusText: 'Đã lên món' };
  }
  if (s.includes('huy') || s.includes('cancel')) {
    return { status: 'CANCELLED', statusText: 'Đã hủy' };
  }
  return { status: 'WAITING_KITCHEN', statusText: 'Chờ bếp' };
}

export const dashboardService = {
  /**
   * Tổng hợp dữ liệu Bảng điều khiển THẬT từ Database qua Backend APIs
   */
  async getDashboardData(): Promise<DashboardData> {
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

      // 1. Map Sơ đồ bàn ăn thực tế
      const tables: TableItem[] = rawTables.map((t) => {
        const hasActiveOrder = Boolean(t.don_hang_hien_tai);
        const { status, statusText } = mapTableStatus(t.trang_thai, hasActiveOrder);

        let capacityText = 'Bàn trống';
        let detailNote = 'Bàn sạch sẽ';
        let subAmount: string | undefined = undefined;

        if (status === 'SERVING') {
          capacityText = t.don_hang_hien_tai ? `${t.don_hang_hien_tai.so_mon} món` : 'Đang phục vụ';
          detailNote = t.don_hang_hien_tai ? `Đơn #DH${String(t.don_hang_hien_tai.ma_don).padStart(3, '0')}` : 'Có khách';
          if (t.don_hang_hien_tai?.tong_tien) {
            subAmount = `Tạm tính: ${new Intl.NumberFormat('vi-VN').format(t.don_hang_hien_tai.tong_tien)} VNĐ`;
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
          hasAlert: hasActiveOrder && t.don_hang_hien_tai?.trang_thai?.toLowerCase().includes('cho'),
        };
      });

      // 2. Tính toán Chỉ số KPI thực tế
      const validOrders = rawOrders.filter((o) => !o.trang_thai?.toLowerCase().includes('huy'));
      const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.tong_tien) || 0), 0);
      const totalOrdersCount = validOrders.length;
      const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

      const totalTables = tables.length;
      const activeTables = tables.filter((t) => t.status === 'SERVING').length;
      const occupancyRate = totalTables > 0 ? Math.round((activeTables / totalTables) * 100) : 0;

      const metrics: MetricCard[] = [
        {
          id: 'rev',
          title: 'Tổng Doanh Thu Trong Ngày',
          value: `${new Intl.NumberFormat('vi-VN').format(totalRevenue)} VNĐ`,
          numberValue: new Intl.NumberFormat('vi-VN').format(totalRevenue),
          unit: 'VNĐ',
          comparisonText: totalOrdersCount > 0 ? `${totalOrdersCount} đơn hàng ghi nhận` : 'Chưa có phát sinh',
          isPositive: true,
          type: 'revenue',
        },
        {
          id: 'orders',
          title: 'Lượt Phục Vụ & Hóa Đơn',
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

      // 3. Đơn hàng gần đây thực tế
      const recentOrders: RecentOrder[] = rawOrders.slice(0, 10).map((ord) => {
        const { status, statusText } = mapOrderStatus(ord.trang_thai);
        const date = new Date(ord.thoi_gian_tao || Date.now());
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
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
          timeAgo: 'Hôm nay',
          itemsSummary,
          totalAmount: `${new Intl.NumberFormat('vi-VN').format(ord.tong_tien || 0)} VNĐ`,
          status,
          statusText,
        };
      });

      // 4. Tổng hợp Top Món Bán Chạy thực tế từ chi tiết đơn hàng
      const dishSalesMap = new Map<number, { name: string; count: number; totalRev: number; price: number }>();
      for (const ord of rawOrders) {
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
      };
    } catch {
      return {
        metrics: [],
        tables: [],
        topDishes: [],
        recentOrders: [],
      };
    }
  },

  async refreshShift(): Promise<DashboardData> {
    return this.getDashboardData();
  },
};
