import { API_BASE_URL } from '@/lib/utils';
import { CategoryItem, Dish } from '@/types/menu';

function formatPrice(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} VNĐ`;
}

function resolveImage(rawImage?: string | null, _name?: string): string | null {
  if (!rawImage) return null;
  const trimmed = rawImage.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }

  // Supabase storage bucket fallback (nếu trong DB chỉ lưu tên file)
  if (trimmed.endsWith('.jpg') || trimmed.endsWith('.png') || trimmed.endsWith('.jpeg')) {
    return `https://fdvfadjkxtcgpcgsxjdl.supabase.co/storage/v1/object/public/menu-images/${encodeURIComponent(trimmed)}`;
  }

  return null;
}

function getDishDescription(_name: string, categoryName: string): string {
  return `Món ${categoryName.toLowerCase()} đặc sắc tại Casa Cozy Bistro.`;
}

interface BackendDishRaw {
  ma_mon: number;
  ma_nhom: number;
  ten_mon: string;
  gia: number;
  hinh_anh?: string | null;
  trang_thai: string;
  nhommon?: {
    ma_nhom: number;
    ten_nhom: string;
  };
}

export const menuService = {
  /**
   * Fetch all categories directly from backend API
   */
  async getCategories(): Promise<CategoryItem[]> {
    const res = await fetch(`${API_BASE_URL}/menu/categories`);
    if (!res.ok) {
      throw new Error(`Không thể kết nối đến máy chủ Backend (Mã lỗi ${res.status}).`);
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.message || 'Dữ liệu danh mục từ máy chủ không hợp lệ.');
    }

    return json.data.map((cat: { ma_nhom: number; ten_nhom: string }) => ({
      id: cat.ma_nhom,
      name: cat.ten_nhom,
      count: 0,
    }));
  },

  /**
   * Fetch all dishes from backend API
   */
  async getDishes(): Promise<Dish[]> {
    const res = await fetch(`${API_BASE_URL}/menu/dishes`);
    if (!res.ok) {
      throw new Error(`Không thể kết nối đến máy chủ Backend (Mã lỗi ${res.status}).`);
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.message || 'Dữ liệu món ăn từ máy chủ không hợp lệ.');
    }

    const rawDishes: BackendDishRaw[] = json.data;

    // Map into clean client Dish items
    return rawDishes.map((item: BackendDishRaw) => {
      const isAvailable =
        item.trang_thai === 'Còn món' ||
        item.trang_thai === 'AVAILABLE' ||
        item.trang_thai === 'Đang phục vụ';

      const categoryName = item.nhommon?.ten_nhom || 'Món ăn';
      const price = Number(item.gia) || 0;

      return {
        id: item.ma_mon,
        code: `#MA-${String(item.ma_mon).padStart(2, '0')}`,
        name: item.ten_mon,
        description: getDishDescription(item.ten_mon, categoryName),
        price,
        formattedPrice: formatPrice(price),
        image: resolveImage(item.hinh_anh, item.ten_mon),
        categoryId: item.ma_nhom || 1,
        categoryName,
        isAvailable,
        status: item.trang_thai || (isAvailable ? 'Còn món' : 'Hết món'),
      };
    });
  },
};
