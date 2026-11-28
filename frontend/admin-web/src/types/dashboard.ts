export type TableStatus =
  | 'AVAILABLE'       // Sẵn sàng
  | 'SERVING'         // Có phục vụ / Đang lên món
  | 'WAITING_KITCHEN' // Chờ bếp
  | 'EATING'          // Đang dùng bữa
  | 'COOKING'         // Đang làm
  | 'SERVED'          // Đã ra món
  | 'RESERVED';       // Đặt trước

export interface TableItem {
  id: string;
  code: string;         // 'Bàn 01', 'Bàn 02',...
  status: TableStatus;
  statusText: string;   // Nhãn hiển thị: 'Sẵn sàng', 'Có phục vụ',...
  capacityText: string; // 'Trống (4 chỗ)', '2 món • 2 khách', '19h30 • 6 khách'
  detailNote: string;   // 'Bàn sạch sẽ', 'Thời gian: 25 phút', 'Khách quen VIP'
  subAmount?: string;   // '230.000 đ', 'Tạm tính: 561.600 đ'
  hasAlert?: boolean;   // Dấu sao đỏ / cảnh báo đặc biệt (như Bàn 05)
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  numberValue: string;
  unit?: string;
  comparisonText: string;
  isPositive: boolean;
  type: 'revenue' | 'orders' | 'aov' | 'occupancy';
  extraInfo?: {
    totalTables?: number;
    activeTables?: number;
    occupancyRate?: number;
  };
}

export interface BestSellingDish {
  rank: number;
  name: string;
  soldCount: number;
  pricePerPortion: string;
  totalRevenue: string;
  percentage: number;
}

export type OrderStatus = 'COOKING' | 'SERVED' | 'WAITING_KITCHEN' | 'CANCELLED';

export interface RecentOrder {
  id: string;
  code: string;          // #DH102
  tableNumber: string;   // '05', '02'
  tableName: string;     // 'Bàn 05'
  waiterId: string;      // 'NV-01'
  waiterName: string;    // 'Tuấn Anh'
  time: string;          // '19:42'
  date?: string;         // '19/11/2026'
  timeAgo: string;       // '10p trước'
  itemsSummary: string;  // '1x Bò Wagyu, 1x Mỳ Ý Trúc Đen, 2x Vang Đỏ & Trà'
  note?: string;         // 'Ghi chú: Steak Medium'
  totalAmount: string;   // '561.600 đ'
  status: OrderStatus;
  statusText: string;    // 'Đang nấu', 'Đã lên món', 'Chờ bếp'
}

export interface DashboardData {
  metrics: MetricCard[];
  tables: TableItem[];
  topDishes: BestSellingDish[];
  recentOrders: RecentOrder[];
  totalOrdersCount?: number;
  timeRange?: DashboardTimeRange;
}

export type DashboardTimeRange = 'TODAY' | '7_DAYS' | 'THIS_MONTH' | 'THIS_YEAR' | 'ALL';
