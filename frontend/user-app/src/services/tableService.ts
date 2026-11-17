import { API_BASE_URL } from '@/lib/utils';
import { CallStaffRequest, CallStaffResponse, TableDetail } from '@/types/table';

export const tableService = {
  /**
   * Format table identifier into standard display (e.g. "5" -> "Bàn số 05")
   */
  formatTableDisplay(rawInput?: string | number | null): string {
    if (!rawInput) return 'Bàn số 05';

    const str = String(rawInput).trim();
    if (!str) return 'Bàn số 05';

    // If it's already "Bàn số XX" or "Bàn XX"
    if (str.toLowerCase().startsWith('bàn')) {
      const matchNumber = str.match(/\d+/);
      if (matchNumber) {
        const num = parseInt(matchNumber[0], 10);
        return `Bàn số ${num < 10 ? '0' + num : num}`;
      }
      return str;
    }

    // If it's just a number
    const num = parseInt(str, 10);
    if (!isNaN(num) && num > 0) {
      return `Bàn số ${num < 10 ? '0' + num : num}`;
    }

    return `Bàn số ${str}`;
  },

  /**
   * Fetch table info from backend
   */
  async getTableById(id: string | number): Promise<TableDetail | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/tables/${id}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data || null;
    } catch {
      return null;
    }
  },

  /**
   * Send a call-staff request to waiters
   */
  async callStaff(request: CallStaffRequest): Promise<CallStaffResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/tables/call-staff`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: data.message || `Đã gửi yêu cầu gọi nhân viên cho ${request.tableName}!`,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        success: false,
        message: 'Máy chủ phản hồi không thành công. Vui lòng thử lại sau!',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        success: false,
        message: 'Không thể kết nối đến máy chủ. Vui lòng gọi trực tiếp nhân viên!',
        timestamp: new Date().toISOString(),
      };
    }
  },
};
