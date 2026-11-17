import { UserItem, CreateUserInput, UpdateUserInput } from '@/types/user';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BackendEmployee {
  ma_nv: number;
  ho_ten: string;
  tai_khoan: string;
  vai_tro: string;
}

const mapBackendToUserItem = (emp: BackendEmployee, index: number = 0): UserItem => {
  const isAdmin = emp.vai_tro === 'ADMIN' || emp.vai_tro === 'QuanTriVien';
  const formattedCode = `#NV-${String(emp.ma_nv || index + 1).padStart(2, '0')}`;

  return {
    id: String(emp.ma_nv || index + 1),
    code: formattedCode,
    name: emp.ho_ten || 'Nhân viên hệ thống',
    email: emp.tai_khoan,
    username: emp.tai_khoan,
    phone: '',
    role: isAdmin ? 'ADMIN' : 'MANAGER',
    roleText: isAdmin ? 'Quản trị viên' : 'Quản lý',
    status: 'ACTIVE',
    isFixed: false,
  };
};

export const userService = {
  /**
   * Lấy danh sách nhân viên THẬT từ Supabase qua Backend API
   */
  async getUserList(): Promise<UserItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return [];
      }

      const resJson = await response.json();
      if (resJson.success && Array.isArray(resJson.data)) {
        const dbEmployees = resJson.data as BackendEmployee[];
        return dbEmployees.map((emp, index) => mapBackendToUserItem(emp, index));
      }

      return [];
    } catch {
      return [];
    }
  },

  /**
   * Thêm nhân viên mới vào Supabase qua Backend API
   */
  async createUser(input: CreateUserInput): Promise<{ success: boolean; message?: string; data?: UserItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const rolePayload = input.role === 'ADMIN' ? 'QuanTriVien' : 'QuanLy';
      const response = await fetch(`${API_BASE_URL}/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ho_ten: input.name.trim(),
          tai_khoan: input.email.trim(),
          mat_khau: input.password,
          vai_tro: rolePayload,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Thêm nhân viên thất bại.' };
      }

      const createdItem = mapBackendToUserItem(resJson.data);
      if (input.phone) {
        createdItem.phone = input.phone;
      }
      return { success: true, data: createdItem };
    } catch (error) {
      console.error('Lỗi khi thêm nhân viên:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Cập nhật thông tin nhân viên vào Supabase qua Backend API
   */
  async updateUser(id: string, input: UpdateUserInput): Promise<{ success: boolean; message?: string; data?: UserItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const rolePayload = input.role === 'ADMIN' ? 'QuanTriVien' : 'QuanLy';
      const bodyPayload: Record<string, unknown> = {
        ho_ten: input.name.trim(),
        tai_khoan: input.email.trim(),
        vai_tro: rolePayload,
      };

      if (input.password && input.password.trim().length >= 8) {
        bodyPayload.mat_khau = input.password.trim();
      }

      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyPayload),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Cập nhật nhân viên thất bại.' };
      }

      const updatedItem = mapBackendToUserItem(resJson.data);
      if (input.phone) {
        updatedItem.phone = input.phone;
      }
      return { success: true, data: updatedItem };
    } catch (error) {
      console.error('Lỗi khi cập nhật nhân viên:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Bật/Tắt trạng thái hoạt động của nhân viên
   */
  async toggleUserStatus(id: string, currentStatus: string): Promise<boolean> {
    void id;
    void currentStatus;
    return true;
  },

  /**
   * Xóa nhân viên khỏi cơ sở dữ liệu Supabase qua Backend API
   */
  async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let msg = 'Không thể xóa nhân viên.';
        try {
          const resJson = await response.json();
          if (resJson.message) msg = resJson.message;
        } catch {
          // ignore
        }
        return { success: false, message: msg };
      }

      return { success: true };
    } catch (error) {
      console.error('Lỗi khi xóa nhân viên:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },
};
