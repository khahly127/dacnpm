import { CategoryItem, CreateCategoryInput, UpdateCategoryInput } from '@/types/category';
import { authService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BackendCategory {
  ma_nhom: number;
  ten_nhom: string;
  monan?: Array<{ ma_mon: number; ten_mon: string }>;
}

// Bảng từ điển mô tả & tên tiếng Anh mẫu theo phong cách ẩm thực Casa Cozy
const categoryPresetMap: Record<string, { englishName: string; description: string }> = {
  'Khai vị': {
    englishName: 'Appetizers & Starters',
    description: 'Kích thích vị giác với pate gan ngỗng béo ngậy, carpaccio thịt bò Wagyu và xà lách hữu cơ sốt nấm Truffle.',
  },
  'Món chính': {
    englishName: 'Main Courses: Beef & Lamb',
    description: 'Bò Angus nướng đá nham thạch, sườn cừu Pháp ướp thảo mộc xốt rượu vang đỏ thượng hạng niên vụ 2018.',
  },
  'Lẩu & Món nhậu': {
    englishName: 'Hotpot & Bistro Specials',
    description: 'Sợi mì tươi thủ công nhào cán trong ngày kết hợp phô mai Grana Padano 24 tháng và nấm Morel quý hiếm.',
  },
  'Tráng miệng': {
    englishName: 'Artisan Desserts & Pastry',
    description: 'Tiramisu nguyên bản vị cà phê espresso Ý nồng nàn, bánh phồng Panna Cotta dâu rừng và sô cô la Valrhona đắng.',
  },
  'Đồ uống': {
    englishName: 'Fine Wine & Beverage Selection',
    description: 'Bộ sưu tập vang Bordeaux, Chianti Classico bảo quản hầm gỗ sồi kèm cocktail thủ công chế tác bởi Sommelier.',
  },
};

export const categoryService = {
  /**
   * Lấy danh sách nhóm món/danh mục từ Backend API (cổng 5000)
   */
  async getCategoryList(): Promise<CategoryItem[]> {
    const token = authService.getToken();
    if (!token) {
      throw new Error('Chưa đăng nhập hoặc phiên làm việc hết hạn.');
    }

    const response = await fetch(`${API_BASE_URL}/menu/categories`, {
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
      throw new Error(resJson.message || 'Dữ liệu nhóm món ăn không hợp lệ.');
    }

    const dbCategories = resJson.data as BackendCategory[];

    return dbCategories.map((item, index) => {
      const preset = categoryPresetMap[item.ten_nhom] || {
        englishName: 'Signature Selection',
        description: 'Các món ăn hảo hạng được chế biến từ nguyên liệu chọn lọc của nhà hàng.',
      };

      const count = Array.isArray(item.monan) ? item.monan.length : 0;
      const formattedCode = `#DM-${String(item.ma_nhom || index + 1).padStart(2, '0')}`;

      return {
        id: String(item.ma_nhom || index + 1),
        code: formattedCode,
        name: item.ten_nhom,
        englishName: preset.englishName,
        description: preset.description,
        dishCount: count,
        status: 'VISIBLE',
        displayOrder: item.ma_nhom || index + 1,
      };
    });
  },

  /**
   * Tạo mới danh mục món ăn
   */
  async createCategory(input: CreateCategoryInput): Promise<{ success: boolean; message?: string; data?: CategoryItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_nhom: input.name.trim(),
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Thêm danh mục thất bại.' };
      }

      const item = resJson.data as BackendCategory;
      const createdCategory: CategoryItem = {
        id: String(item.ma_nhom),
        code: `#DM-${String(item.ma_nhom).padStart(2, '0')}`,
        name: item.ten_nhom,
        description: input.description?.trim() || 'Các món ăn hảo hạng chế biến từ nguyên liệu chọn lọc.',
        dishCount: 0,
        status: input.status || 'VISIBLE',
        displayOrder: item.ma_nhom,
      };

      return { success: true, data: createdCategory };
    } catch (error) {
      console.error('Lỗi khi thêm danh mục:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Chỉnh sửa thông tin danh mục
   */
  async updateCategory(
    id: string,
    input: UpdateCategoryInput
  ): Promise<{ success: boolean; message?: string; data?: CategoryItem }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ten_nhom: input.name.trim(),
        }),
      });

      const resJson = await response.json();
      if (!response.ok || !resJson.success) {
        return { success: false, message: resJson.message || 'Cập nhật danh mục thất bại.' };
      }

      const item = resJson.data as BackendCategory;
      const updatedCategory: CategoryItem = {
        id: String(item.ma_nhom),
        code: `#DM-${String(item.ma_nhom).padStart(2, '0')}`,
        name: item.ten_nhom,
        description: input.description?.trim() || 'Các món ăn hảo hạng chế biến từ nguyên liệu chọn lọc.',
        dishCount: 0,
        status: input.status || 'VISIBLE',
        displayOrder: item.ma_nhom,
      };

      return { success: true, data: updatedCategory };
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },

  /**
   * Xóa danh mục khỏi Supabase
   */
  async deleteCategory(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const token = authService.getToken();
      if (!token) {
        return { success: false, message: 'Phiên làm việc hết hạn. Vui lòng đăng nhập lại.' };
      }

      const response = await fetch(`${API_BASE_URL}/menu/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        let msg = 'Không thể xóa danh mục.';
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
      console.error('Lỗi khi xóa danh mục:', error);
      return { success: false, message: 'Không thể kết nối đến máy chủ backend.' };
    }
  },
};
