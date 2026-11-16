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
  nhommon?: { ma_nhom: number; ten_nhom: string };
}

// Danh sách món mẫu chuẩn theo đúng bản thiết kế Casa Cozy Bistro
const sampleDishes: DishItem[] = [
  {
    id: '1',
    code: '#MA-01',
    name: 'Bò Bít Tết Wagyu Úc',
    subtitle: 'Australian Wagyu Tenderloin',
    categoryId: 2,
    categoryName: 'Món chính (Bò & Cừu)',
    price: 245000,
    formattedPrice: '245,000 đ',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '2',
    code: '#MA-02',
    name: 'Sườn Cừu Nướng Thảo Mộc',
    subtitle: 'Herb-Crusted Lamb Rack',
    categoryId: 2,
    categoryName: 'Món chính (Bò & Cừu)',
    price: 490000,
    formattedPrice: '490,000 đ',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&auto=format&fit=crop&q=80',
    status: 'OUT_OF_STOCK',
    statusText: 'Tạm hết món',
  },
  {
    id: '3',
    code: '#MA-03',
    name: 'Gan Ngỗng Áp Chảo Foie Gras',
    subtitle: 'Pan-seared Duck Foie Gras',
    categoryId: 1,
    categoryName: 'Món Khai Vị',
    price: 365000,
    formattedPrice: '365,000 đ',
    image: null,
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '4',
    code: '#MA-04',
    name: 'Mì Ý Hải Sản Nero di Seppia',
    subtitle: 'Squid Ink Seafood Spaghetti',
    categoryId: 3,
    categoryName: 'Mỳ Ý & Risotto',
    price: 280000,
    formattedPrice: '280,000 đ',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '5',
    code: '#MA-05',
    name: 'Cơm Ý Risotto Nấm Truffle',
    subtitle: 'Black Truffle Mushroom Risotto',
    categoryId: 3,
    categoryName: 'Mỳ Ý & Risotto',
    price: 320000,
    formattedPrice: '320,000 đ',
    image: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=120&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '6',
    code: '#MA-06',
    name: 'Salad Cá Hồi Xông Khói',
    subtitle: 'Smoked Salmon Garden Salad',
    categoryId: 1,
    categoryName: 'Món Khai Vị',
    price: 215000,
    formattedPrice: '215,000 đ',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '7',
    code: '#MA-07',
    name: 'Bánh Tiramisu Truyền Thống',
    subtitle: 'Classic Italian Mascarpone Tiramisu',
    categoryId: 4,
    categoryName: 'Tráng Miệng',
    price: 125000,
    formattedPrice: '125,000 đ',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&auto=format&fit=crop&q=80',
    status: 'AVAILABLE',
    statusText: 'Đang phục vụ',
  },
  {
    id: '8',
    code: '#MA-08',
    name: 'Rượu Vang Đỏ Bordeaux Chateau',
    subtitle: 'Château Grand-Puy-Lacoste 750ml',
    categoryId: 5,
    categoryName: 'Rượu Vang & Đồ Uống',
    price: 1450000,
    formattedPrice: '1,450,000 đ',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=120&auto=format&fit=crop&q=80',
    status: 'HIDDEN',
    statusText: 'Đã ẩn (Kho)',
  },
];

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

const DISH_IMAGE_MAP: Record<string, string> = {
  'goicuon.jpg': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=120&auto=format&fit=crop&q=80',
  'supcua.jpg': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=120&auto=format&fit=crop&q=80',
  'comtam.jpg': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&auto=format&fit=crop&q=80',
  'bobittet.jpg': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop&q=80',
  'lauthai.jpg': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'chekhucbach.jpg': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=120&auto=format&fit=crop&q=80',
  'tradaocamsa.jpg': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=120&auto=format&fit=crop&q=80',
  'laucakeo.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'laucuadong.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'lauchay.png': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
  'laudacbiet.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'lauech.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'laugalagiang.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'lauhaisan.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
  'laumam.png': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80',
};

function resolveDishImage(image?: string | null, tenMon?: string): string | null {
  if (!image) return null;
  const trimmed = image.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  const key = trimmed.toLowerCase();
  if (DISH_IMAGE_MAP[key]) {
    return DISH_IMAGE_MAP[key];
  }

  if (tenMon && tenMon.toLowerCase().includes('lẩu')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&auto=format&fit=crop&q=80';
  }

  return null;
}

export const dishService = {
  /**
   * Lấy danh sách món ăn từ Backend Supabase
   */
  async getDishList(): Promise<DishItem[]> {
    try {
      const token = authService.getToken();
      if (!token) {
        return sampleDishes;
      }

      const response = await fetch(`${API_BASE_URL}/menu/dishes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const resJson = await response.json();
        if (resJson.success && Array.isArray(resJson.data) && resJson.data.length > 0) {
          const dbDishes = resJson.data as BackendDish[];

          return dbDishes.map((item, index) => {
            const { status, statusText } = mapStatusToEnum(item.trang_thai);
            const formattedCode = `#MA-${String(item.ma_mon || index + 1).padStart(2, '0')}`;
            const formattedPrice = `${new Intl.NumberFormat('vi-VN').format(item.gia || 0)} đ`;

            return {
              id: String(item.ma_mon || index + 1),
              code: formattedCode,
              name: item.ten_mon,
              subtitle: 'Món ăn đặc sản Casa Cozy',
              categoryId: item.ma_nhom || 1,
              categoryName: item.nhommon?.ten_nhom || 'Món đặc biệt',
              price: item.gia || 0,
              formattedPrice,
              image: resolveDishImage(item.hinh_anh, item.ten_mon),
              status,
              statusText,
            };
          });
        }
      }

      return sampleDishes;
    } catch {
      return sampleDishes;
    }
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
        subtitle: input.subtitle?.trim() || undefined,
        categoryId: item.ma_nhom,
        categoryName: item.nhommon?.ten_nhom || 'Món mới',
        price: item.gia,
        formattedPrice: `${new Intl.NumberFormat('vi-VN').format(item.gia)} đ`,
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
        subtitle: input.subtitle?.trim() || undefined,
        categoryId: item.ma_nhom,
        categoryName: item.nhommon?.ten_nhom || 'Món ăn',
        price: item.gia,
        formattedPrice: `${new Intl.NumberFormat('vi-VN').format(item.gia)} đ`,
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
      if (!token) {
        return [
          { id: 1, name: 'Món Khai Vị' },
          { id: 2, name: 'Món chính (Bò & Cừu)' },
          { id: 3, name: 'Mỳ Ý & Risotto' },
          { id: 4, name: 'Tráng Miệng' },
          { id: 5, name: 'Rượu Vang & Đồ Uống' },
        ];
      }

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

      return [
        { id: 1, name: 'Món Khai Vị' },
        { id: 2, name: 'Món chính (Bò & Cừu)' },
        { id: 3, name: 'Mỳ Ý & Risotto' },
        { id: 4, name: 'Tráng Miệng' },
        { id: 5, name: 'Rượu Vang & Đồ Uống' },
      ];
    } catch {
      return [
        { id: 1, name: 'Món Khai Vị' },
        { id: 2, name: 'Món chính (Bò & Cừu)' },
        { id: 3, name: 'Mỳ Ý & Risotto' },
        { id: 4, name: 'Tráng Miệng' },
        { id: 5, name: 'Rượu Vang & Đồ Uống' },
      ];
    }
  },
};
