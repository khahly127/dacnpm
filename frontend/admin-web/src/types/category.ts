export type CategoryStatus = 'VISIBLE' | 'HIDDEN';

export interface CategoryItem {
  id: string;              // ID duy nhất (ví dụ: '1')
  code: string;            // Mã hiển thị (ví dụ: '#DM-01')
  name: string;            // Tên danh mục (ví dụ: 'Khai vị')
  englishName?: string;    // Tên tiếng Anh (tùy chọn)
  description: string;     // Mô tả thực đơn & phục vụ
  dishCount: number;       // Số lượng món ăn thuộc danh mục
  status: CategoryStatus;  // 'VISIBLE' (Đang hiển thị) hoặc 'HIDDEN' (Đang ẩn)
  displayOrder: number;    // Thứ tự hiển thị menu
  createdAt?: string;
}

export interface CategoryFiltersState {
  searchQuery: string;
  statusFilter: 'ALL' | CategoryStatus;
  sortBy: 'MENU_ORDER' | 'DISH_COUNT' | 'NAME_ASC';
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  status?: CategoryStatus;
}

export interface UpdateCategoryInput {
  name: string;
  description?: string;
  status?: CategoryStatus;
}
