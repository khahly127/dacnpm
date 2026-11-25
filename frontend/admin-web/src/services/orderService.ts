import { OrderItem, OrderStatus, CreateOrderInput } from '@/types/order';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BackendOrderDetail {
  ma_ct?: number;
  ma_mon: number;
  so_luong: number;
  don_gia: number;
  ghi_chu?: string;
  monan?: {
    ma_mon: number;
    ten_mon: string;
    hinh_anh?: string | null;
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

const mapBackendStatus = (statusRaw?: string): { status: OrderStatus; statusText: string } => {
  if (!statusRaw) return { status: 'PENDING', statusText: 'Chờ xác nhận' };
  const s = statusRaw.toLowerCase();
  if (s.includes('cho') || s.includes('xac nhan') || s.includes('tiep nhan') || s.includes('pending')) {
    return { status: 'PENDING', statusText: 'Chờ xác nhận' };
  }
  if (s.includes('chuan bi') || s.includes('cooking') || s.includes('dang nau') || s.includes('nau') || s.includes('che bien')) {
    return { status: 'COOKING', statusText: 'Đang chuẩn bị' };
  }
  if (s.includes('len mon') || s.includes('served') || s.includes('dang phuc vu')) {
    return { status: 'SERVED', statusText: 'Đang phục vụ' };
  }
  if (s.includes('hoan tat') || s.includes('phuc vu') || s.includes('completed')) {
    return { status: 'COMPLETED', statusText: 'Đã phục vụ' };
  }
  if (s.includes('huy') || s.includes('cancel')) {
    return { status: 'CANCELLED', statusText: 'Đã hủy' };
  }
  return { status: 'PENDING', statusText: 'Chờ xác nhận' };
};

const mapStatusToBackend = (status: OrderStatus): string => {
  switch (status) {
    case 'PENDING':
      return 'Cho xac nhan';
    case 'COOKING':
      return 'Dang chuan bi';
    case 'SERVED':
      return 'Dang phuc vu';
    case 'COMPLETED':
      return 'Hoan tat';
    case 'CANCELLED':
      return 'Da huy';
    default:
      return 'Cho xac nhan';
  }
};

export const orderService = {
  /**
   * Lấy danh sách toàn bộ đơn hàng thực tế từ Database
   */
  async getOrderList(): Promise<OrderItem[]> {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_BASE_URL}/orders/staff`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && Array.isArray(resJson.data)) {
          const dbOrders = resJson.data as BackendOrder[];

          const mappedDbOrders: OrderItem[] = dbOrders.map((item) => {
            const { status, statusText } = mapBackendStatus(item.trang_thai);
            const total = item.tong_tien || 0;
            const formattedTotal = `${new Intl.NumberFormat('vi-VN').format(total)} VNĐ`;
            const code = `#DH${String(item.ma_don).padStart(3, '0')}`;
            const tableName = item.ban?.ten_ban || `Bàn ${String(item.ma_ban).padStart(2, '0')}`;
            const employeeName = item.nhanvien?.ho_ten || 'Chưa phân công';

            const items: OrderItem['items'] = (item.chitietdonhang || []).map((ct, idx) => ({
              id: ct.ma_ct || idx + 1,
              dishId: ct.ma_mon,
              dishName: ct.monan?.ten_mon || `Món ăn #${ct.ma_mon}`,
              quantity: ct.so_luong || 1,
              price: ct.don_gia || 0,
              formattedPrice: `${new Intl.NumberFormat('vi-VN').format(ct.don_gia || 0)} VNĐ`,
              note: ct.ghi_chu,
            }));

            const itemsSummary = items.length > 0
              ? items.map((i) => `${i.quantity}x ${i.dishName}`).join(', ')
              : 'Đơn gọi món tại bàn';

            const rawDate = item.thoi_gian_tao;
            const normalizedDateStr = rawDate
              ? rawDate.includes('Z') || rawDate.includes('+')
                ? rawDate
                : `${rawDate}Z`
              : null;
            const date = new Date(normalizedDateStr || Date.now());
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const time = `${hours}:${minutes}`;

            return {
              id: String(item.ma_don),
              code,
              isVip: false,
              tableId: item.ma_ban,
              tableName,
              employeeId: `NV-${String(item.ma_nv || 1).padStart(2, '0')}`,
              employeeName,
              items,
              itemsSummary,
              note: items[0]?.note || 'Gọi món theo thực đơn',
              totalAmount: total,
              formattedTotal,
              time,
              relativeTime: 'Vừa cập nhật',
              createdAt: normalizedDateStr || new Date().toISOString(),
              status,
              statusText,
            };
          });

          return mappedDbOrders;
        }
      }

      return [];
    } catch (err) {
      console.error('Lỗi khi tải đơn hàng:', err);
      return [];
    }
  },

  /**
   * Cập nhật trạng thái đơn hàng (Ví dụ: Chờ xác nhận -> Đang chế biến -> Đang phục vụ -> Hoàn tất)
   */
  async updateOrderStatus(id: string, status: OrderStatus): Promise<{ success: boolean; message?: string }> {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ trang_thai: mapStatusToBackend(status) }),
      });

      const resJson = await response.json();
      return { success: response.ok && resJson.success, message: resJson.message };
    } catch {
      return { success: false, message: 'Không thể kết nối đến máy chủ.' };
    }
  },

  /**
   * Tạo đơn hàng mới tại bàn
   */
  async createOrder(input: CreateOrderInput): Promise<{ success: boolean; message?: string }> {
    try {
      const token = authService.getToken();

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ma_ban: input.tableId,
          items: input.items.map((i) => ({
            ma_mon: i.dishId,
            so_luong: i.quantity,
            ghi_chu: i.note,
          })),
        }),
      });

      const resJson = await response.json();
      return { success: response.ok && resJson.success, message: resJson.message };
    } catch {
      return { success: false, message: 'Lỗi kết nối máy chủ.' };
    }
  },
};
