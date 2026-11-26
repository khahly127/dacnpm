export type DishStatus = 'AVAILABLE' | 'OUT_OF_STOCK' | 'HIDDEN';

export interface DishItem {
  id: string;               // ID món ăn (ví dụ: '1')
  code: string;             // Mã món hiển thị (ví dụ: '#MA-01')
  name: string;             // Tên món ăn (ví dụ: 'Bò Bít Tết Wagyu Úc')
  subtitle?: string;        // Tên phụ/mô tả ngắn (ví dụ: 'Australian Wagyu Tenderloin')
  categoryId: number;       // Mã nhóm/danh mục
  categoryName: string;     // Tên nhóm món (ví dụ: 'Món chính (Bò & Cừu)')
  price: number;            // Giá niêm yết dạng số (ví dụ: 245000)
  formattedPrice: string;   // Giá niêm yết định dạng (ví dụ: '245,000 đ')
  image?: string | null;    // Đường dẫn hình ảnh hoặc ảnh mẫu
  status: DishStatus;       // Trạng thái: AVAILABLE, OUT_OF_STOCK, HIDDEN
  statusText: string;       // Nhãn tiếng Việt: 'Đang phục vụ', 'Tạm hết món', 'Đã ẩn (Kho)'
}

export interface DishStats {
  total: number;
  totalCategories: number;
  available: number;
  availableRate: string;
  pausedOrOutOfStock: number;   // Số món tạm dừng hoặc hết món
  averagePrice: number;         // Giá trung bình (số nguyên)
  formattedAveragePrice: string;// Ví dụ: '~185.000 VNĐ'
  minPrice: number;             // Giá thấp nhất
  maxPrice: number;             // Giá cao nhất
  priceRangeText: string;       // Ví dụ: 'Dao động 45k – 550k'
  outOfStock?: number;
  hidden?: number;
}

export interface DishFiltersState {
  searchQuery: string;
  categoryFilter: 'ALL' | number;
  statusFilter: 'ALL' | DishStatus;
  sortBy: 'NEWEST' | 'PRICE_ASC' | 'PRICE_DESC' | 'NAME_ASC';
}

export interface CreateDishInput {
  name: string;
  subtitle?: string;
  categoryId: number;
  price: number;
  image?: string | null;
  status: DishStatus;
}

export interface UpdateDishInput {
  name: string;
  subtitle?: string;
  categoryId: number;
  price: number;
  image?: string | null;
  status: DishStatus;
}
