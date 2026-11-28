import { TableItem, TableStats, CreateTableInput, UpdateTableInput, TableStatus, TableArea } from '../types/table';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function formatDuration(dateString?: string): string {
  if (!dateString) return 'Vừa vào bàn';
  try {
    const created = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.max(1, Math.round((now.getTime() - created.getTime()) / (1000 * 60)));
    if (diffMinutes < 60) {
      return `${diffMinutes} phút`;
    }
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours} giờ ${minutes > 0 ? `${minutes} phút` : ''}`;
  } catch {
    return '30 phút';
  }
}

function mapStatusToFrontend(rawStatus?: string): TableStatus {
  if (!rawStatus) return 'available';
  const s = rawStatus.toLowerCase();
  if (s.includes('phuc vu') || s.includes('khach') || s.includes('occupied')) return 'occupied';
  if (s.includes('dat') || s.includes('reserve')) return 'reserved';
  return 'available';
}

function mapStatusToBackend(status?: TableStatus): string {
  if (status === 'occupied') return 'Dang phuc vu';
  if (status === 'reserved') return 'Dat truoc';
  return 'Trong';
}

interface BackendTable {
  ma_ban: number;
  ten_ban: string;
  trang_thai: string;
  khu_vuc?: string;
  so_ghe?: number;
  maqr?: {
    qr_id?: number;
    image_url?: string;
  } | Array<{
    qr_id?: number;
    image_url?: string;
  }>;
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
  };
}

function mapBackendToTableItem(item: BackendTable): TableItem {
  const isVip = Boolean(item.ten_ban && item.ten_ban.toLowerCase().includes('vip'));
  const status = mapStatusToFrontend(item.trang_thai);

  // Extract QR base64 image if present
  let qrImage: string | undefined = undefined;
  if (item.maqr) {
    if (Array.isArray(item.maqr) && item.maqr.length > 0) {
      qrImage = item.maqr[0].image_url;
    } else if (typeof item.maqr === 'object' && 'image_url' in item.maqr) {
      qrImage = item.maqr.image_url;
    }
  }

  // Determine area
  let area: TableArea = 'Sảnh Chính Tầng 1';
  if (item.khu_vuc) {
    if (item.khu_vuc.includes('Ban Công')) area = 'Khu Ban Công';
    else if (item.khu_vuc.includes('VIP')) area = 'Phòng VIP Lầu 2';
  } else if (isVip) {
    area = 'Phòng VIP Lầu 2';
  }

  const paddedNum = String(item.ma_ban).padStart(2, '0');

  const tableItem: TableItem = {
    id: String(item.ma_ban),
    code: isVip ? `BAN-VIP-${paddedNum}` : `BAN-${paddedNum}`,
    name: item.ten_ban || `Bàn ${item.ma_ban}`,
    area,
    seats: item.so_ghe || (isVip ? 8 : 4),
    isVip,
    status,
    qrEnabled: true,
    qrUrl: `casacozy.vn/b/${paddedNum}`,
    qrImage,
  };

  if (status === 'occupied') {
    if (item.don_hang_hien_tai) {
      const active = item.don_hang_hien_tai;
      const orderCount = active.so_don || 1;
      const orderCodeText = orderCount > 1 && active.danh_sach_ma_don?.length
        ? `${orderCount} đợt: ${active.danh_sach_ma_don.map((m: number) => `#DH${String(m).padStart(3, '0')}`).join(', ')}`
        : `#DH${String(active.ma_don).padStart(3, '0')}`;

      tableItem.occupiedInfo = {
        orderCode: orderCodeText,
        dishCount: active.so_mon || 1,
        duration: formatDuration(active.thoi_gian_bat_dau || active.thoi_gian_tao),
        guestCount: tableItem.seats,
      };
    } else {
      tableItem.occupiedInfo = {
        orderCode: 'Đang phục vụ',
        dishCount: 0,
        duration: 'Vừa vào bàn',
        guestCount: tableItem.seats,
      };
    }
  } else if (status === 'available') {
    tableItem.availableInfo = {
      statusText: 'Sẵn sàng đón khách',
      lastCleaned: 'Đã dọn dẹp',
    };
  } else if (status === 'reserved') {
    tableItem.reservedInfo = {
      reservedTime: '19:30',
      guestName: 'Khách đặt trước',
      note: 'Chuẩn bị bàn theo yêu cầu',
      guestCount: tableItem.seats,
    };
  }

  return tableItem;
}

export const tableService = {
  calculateStats(tables: TableItem[]): TableStats {
    const total = tables.length;
    const occupied = tables.filter((t) => t.status === 'occupied').length;
    const available = tables.filter((t) => t.status === 'available').length;
    const reserved = tables.filter((t) => t.status === 'reserved').length;
    const qrActive = tables.filter((t) => t.qrEnabled).length;
    const capacityPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const areas = new Set(tables.map((t) => t.area));

    return {
      total,
      occupied,
      available,
      reserved,
      qrActive,
      capacityPercentage,
      areaCount: Math.max(1, areas.size),
    };
  },

  /**
   * Lấy danh sách bàn ăn thực tế từ Database thông qua API Backend
   */
  async getTables(): Promise<TableItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authService.getToken() ? { Authorization: `Bearer ${authService.getToken()}` } : {}),
        },
      });

      if (!response.ok) {
        console.error('Không thể tải bàn từ backend:', response.status);
        return [];
      }

      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        return result.data.map(mapBackendToTableItem);
      }
      return [];
    } catch (err) {
      console.error('Lỗi khi gọi API getTables:', err);
      return [];
    }
  },

  /**
   * Tạo bàn ăn mới trong Database
   */
  async createTable(input: CreateTableInput): Promise<TableItem> {
    const token = authService.getToken();
    const backendStatus = mapStatusToBackend(input.status);

    const response = await fetch(`${API_BASE_URL}/tables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ten_ban: input.name.trim(),
        trang_thai: backendStatus,
      }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể tạo bàn ăn mới');
    }

    return mapBackendToTableItem(result.data);
  },

  /**
   * Cập nhật thông tin bàn ăn trong Database
   */
  async updateTable(id: string, input: UpdateTableInput): Promise<TableItem | null> {
    const token = authService.getToken();
    const payload: Record<string, unknown> = {};

    if (input.name) payload.ten_ban = input.name.trim();
    if (input.status) payload.trang_thai = mapStatusToBackend(input.status);

    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể cập nhật bàn ăn');
    }

    return mapBackendToTableItem(result.data);
  },

  /**
   * Xóa bàn ăn khỏi Database
   */
  async deleteTable(id: string): Promise<boolean> {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tables/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Không thể xóa bàn ăn');
    }

    return true;
  },

  async toggleQrStatus(id: string, currentState?: boolean): Promise<boolean> {
    return currentState !== undefined ? !currentState : true;
  },

  /**
   * Thanh toán gộp theo bàn và giải phóng bàn về Bàn trống
   */
  async checkoutTable(tableId: string | number, paymentMethod: string = 'TIEN_MAT'): Promise<{ success: boolean; message: string; data?: any }> {
    const token = authService.getToken();
    const response = await fetch(`${API_BASE_URL}/tables/${tableId}/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ paymentMethod }),
    });

    const result = await response.json();
    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Thanh toán bàn không thành công');
    }

    return result;
  },
};
