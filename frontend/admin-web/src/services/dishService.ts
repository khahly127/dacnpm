import { DishItem, DishStatus, CreateDishInput, UpdateDishInput } from '@/types/dish';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BackendDish {
  ma_mon: number;
  ma_nhom: number;
  ten_mon: string;
  gia: number;
  hinh_anh?: string | null;
  trang_thai: string;
  mo_ta?: string | null;
  nhommon?: { ma_nhom: number; ten_nhom: string };
}

const mapStatusToEnum = (statusRaw?: string): { status: DishStatus; statusText: string } => {
  if (!statusRaw) return { status: 'AVAILABLE', statusText: 'Đang phục vụ' };
  const s = statusRaw.toLowerCase();
  if (s.includes('hết')) return { status: 'OUT_OF_STOCK', statusText: 'Tạm hết món' };
  if (s.includes('ẩn') || s.includes('ngưng')) return { status: 'HIDDEN', statusText: 'Đã ẩn (Kho)' };
  return { status: 'AVAILABLE', statusText: 'Đang phục vụ' };
};

const mapEnumToBackendString = (status: DishStatus): string => {
  switch (status) {
    case 'OUT_OF_STOCK':
      return 'Hết món';
    case 'HIDDEN':
      return 'Đã ẩn';
    default:
      return 'Còn món';
  }
};

function resolveDishImage(image?: string | null, _tenMon?: string): string | null {
  if (!image) return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return null;
}

export const dishService = {
  /**
   * Lấy danh sách món ăn từ Backend API (cổng 5000)
   */
  async getDishList(): Promise<DishItem[]> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Chưa đăng nhập hoặc phiên làm việc hết hạn.');
    }

    const response = await fetch(`${API_BASE_URL}/menu/dishes`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Không thể kết nối đến máy chủ Backend (Mã lỗi ${response.status}).`);
    }

    const resJson = await response.json();
    if (!resJson.success || !Array.isArray(resJson.data)) {
      throw new Error(resJson.message || 'Dữ liệu thực đơn món ăn không hợp lệ.');
    }

    const dbDishes = resJson.data as BackendDish[];

    return dbDishes.map((item, index) => {
      const { status, statusText } = mapStatusToEnum(item.trang_thai);
      const formattedCode = `#MA-${String(item.ma_mon || index + 1).padStart(2, '0')}`;
      const formattedPrice = `${new Intl.NumberFormat('vi-VN').format(item.gia || 0)} VNĐ`;

      return {
        id: String(item.ma_mon || index + 1),
        code: formattedCode,
        name: item.ten_mon,
        subtitle: item.mo_ta || '',
        categoryId: item.ma_nhom || 1,
        categoryName: item.nhommon?.ten_nhom || 'Món đặc biệt',
        price: item.gia || 0,
        formattedPrice,
        image: resolveDishImage(item.hinh_anh, item.ten_mon),
        status,
        statusText,
      };
    });
  },

  /**
   * Tạo mới món ăn
   */
  async createDish(input: CreateDishInput): Promise<{ success: boolean; message?: string; data?: DishItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/dishes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ma_nhom: input.categoryId,
          ten_mon: input.name.trim(),
          gia: input.price,
          hinh_anh: input.image?.trim() || null,
          trang_thai: mapEnumToBackendString(input.status),
          mo_ta: input.subtitle?.trim() || null,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Thêm món ăn thất bại.' };
      }

      const item = resJson.data as BackendDish;
      const { status, statusText } = mapStatusToEnum(item.trang_thai);

      const createdDish: DishItem = {
        id: String(item.ma_mon),
        code: `#MA-${String(item.ma_mon).padStart(2, '0')}`,
        name: item.ten_mon,
        subtitle: item.mo_ta || input.subtitle?.trim() || undefined,
        categoryId: item.ma_nhom,
        categoryName: item.nhommon?.ten_nhom || 'Món mới',
        price: item.gia,
        formattedPrice: `${new Intl.NumberFormat('vi-VN').format(item.gia)} VNĐ`,
        image: resolveDishImage(item.hinh_anh, item.ten_mon),
        status,
        statusText,
      };

      return { success: true, data: createdDish };
    } catch (error) {
      console.error('Lỗi khi thêm món ăn:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Cập nhật món ăn
   */
  async updateDish(
    id: string,
    input: UpdateDishInput
  ): Promise<{ success: boolean; message?: string; data?: DishItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/dishes/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ma_nhom: input.categoryId,
          ten_mon: input.name.trim(),
          gia: input.price,
          hinh_anh: input.image?.trim() || null,
          trang_thai: mapEnumToBackendString(input.status),
          mo_ta: input.subtitle?.trim() || null,
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Cập nhật món ăn thất bại.' };
      }

      const item = resJson.data as BackendDish;
      const { status, statusText } = mapStatusToEnum(item.trang_thai);

      const updatedDish: DishItem = {
        id: String(item.ma_mon),
        code: `#MA-${String(item.ma_mon).padStart(2, '0')}`,
        name: item.ten_mon,
        subtitle: item.mo_ta || input.subtitle?.trim() || undefined,
        categoryId: item.ma_nhom,
        categoryName: item.nhommon?.ten_nhom || 'Món ăn',
        price: item.gia,
        formattedPrice: `${new Intl.NumberFormat('vi-VN').format(item.gia)} VNĐ`,
        image: resolveDishImage(item.hinh_anh, item.ten_mon),
        status,
        statusText,
      };

      return { success: true, data: updatedDish };
    } catch (error) {
      console.error('Lỗi khi cập nhật món ăn:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Xóa món ăn khỏi CSDL
   */
  async deleteDish(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/dishes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let msg = 'Không thể xóa món ăn.';
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
      console.error('Lỗi khi xóa món ăn:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Lấy danh sách danh mục để điền vào dropdown lọc & form
   */
  async getCategories(): Promise<Array<{ id: number; name: string }>> {
    try {
      const token = authService.getToken();
      if (!token) return [];

      const response = await fetch(`${API_BASE_URL}/menu/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && Array.isArray(resJson.data)) {
          return resJson.data.map((item: { ma_nhom: number; ten_nhom: string }) => ({
            id: item.ma_nhom,
            name: item.ten_nhom,
          }));
        }
      }

      return [];
    } catch {
      return [];
    }
  },
};
