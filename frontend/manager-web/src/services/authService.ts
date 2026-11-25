import { LoginFormData, LoginResponse, AuthUser, UserRole } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Cache để useSyncExternalStore không bị tạo object mới liên tục gây vòng lặp vô tận
let cachedRaw: string | null = null;
let cachedUser: AuthUser | null = null;

function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth_state_changed'));
  }
}

export const authService = {
  /**
   * Gọi API đăng nhập thật đến Backend (cổng 5000)
   */
  async login(data: LoginFormData): Promise<LoginResponse> {
    try {
      if (!data.identifier.trim() || !data.password.trim()) {
        return {
          success: false,
          message: 'Vui lòng nhập đầy đủ mã nhân viên/email và mật khẩu.',
        };
      }

      // 1. Gửi request POST sang Backend Express
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tai_khoan: data.identifier.trim(),
          mat_khau: data.password,
        }),
      });

      const result = await response.json();

      // 2. Nếu Backend trả về lỗi (400, 401, ...)
      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || 'Tài khoản hoặc mật khẩu không chính xác.',
        };
      }

      // 3. Chuẩn hóa dữ liệu User từ Backend (Supabase) về kiểu AuthUser của Frontend
      const backendUser = result.user;
      const mappedRole: UserRole =
        backendUser.vai_tro === 'ADMIN' || backendUser.vai_tro === 'QuanTriVien'
          ? 'ADMIN'
          : 'MANAGER';

      const user: AuthUser = {
        id: String(backendUser.ma_nv),
        name: backendUser.ho_ten || (mappedRole === 'MANAGER' ? 'Quản lý' : 'Quản trị viên'),
        email: backendUser.tai_khoan,
        employeeCode: `NV-${String(backendUser.ma_nv).padStart(2, '0')}`,
        role: mappedRole,
      };

      const token = result.token;

      // 4. Lưu phiên đăng nhập thật vào LocalStorage hoặc SessionStorage
      if (typeof window !== 'undefined') {
        if (data.rememberMe) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          sessionStorage.setItem('auth_token', token);
          sessionStorage.setItem('auth_user', JSON.stringify(user));
        }
        cachedRaw = null; // Reset cache để lấy dữ liệu mới
        notifyAuthChange();
      }

      return {
        success: true,
        token,
        user,
      };
    } catch (error) {
      console.error('Lỗi khi gọi API đăng nhập:', error);
      return {
        success: false,
        message:
          'Không thể kết nối đến máy chủ Backend (cổng 5000). Vui lòng đảm bảo Backend đã được khởi động.',
      };
    }
  },

  /**
   * Xóa sạch phiên đăng nhập khi người dùng nhấn Đăng xuất
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      sessionStorage.clear();
      cachedRaw = null;
      cachedUser = null;
      notifyAuthChange();
    }
  },

  /**
   * Lấy thông tin user hiện tại đang đăng nhập từ bộ nhớ trình duyệt (có cache reference)
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
    if (!userStr) {
      cachedRaw = null;
      cachedUser = null;
      return null;
    }
    // Nếu chuỗi trong storage không đổi -> trả về đúng reference cũ để tránh re-render vô tận
    if (userStr === cachedRaw && cachedUser) {
      return cachedUser;
    }
    try {
      cachedUser = JSON.parse(userStr) as AuthUser;
      cachedRaw = userStr;
      return cachedUser;
    } catch {
      cachedRaw = null;
      cachedUser = null;
      return null;
    }
  },

  /**
   * Lấy Token JWT thật của phiên làm việc
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  },

  /**
   * Cập nhật thông tin cá nhân (họ tên)
   */
  async updateProfile(name: string): Promise<{ success: boolean; message?: string; user?: AuthUser }> {
    try {
      const token = this.getToken();
      if (!token) return { success: false, message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ho_ten: name.trim() }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Cập nhật thông tin thất bại.' };
      }

      // Cập nhật lại local user
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser: AuthUser = {
          ...currentUser,
          name: name.trim(),
        };
        const hasLocalStorage = !!localStorage.getItem('auth_user');
        if (hasLocalStorage) {
          localStorage.setItem('auth_user', JSON.stringify(updatedUser));
        } else {
          sessionStorage.setItem('auth_user', JSON.stringify(updatedUser));
        }
        cachedRaw = null;
        cachedUser = null;
        notifyAuthChange();
      }

      return { success: true, message: 'Cập nhật thông tin thành công!' };
    } catch (error) {
      console.error('Lỗi khi cập nhật profile:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ Backend.' };
    }
  },

  /**
   * Đổi mật khẩu cá nhân
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = this.getToken();
      if (!token) return { success: false, message: 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.' };

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Đổi mật khẩu thất bại.' };
      }

      return { success: true, message: 'Đổi mật khẩu thành công!' };
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ Backend.' };
    }
  },
};
