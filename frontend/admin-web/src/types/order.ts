export type OrderStatus =
  | 'PENDING'    // Chờ tiếp nhận
  | 'COOKING'    // Đang nấu / Đang chế biến
  | 'SERVED'     // Đã lên món
  | 'COMPLETED'  // Đã phục vụ / Hoàn tất
  | 'CANCELLED'; // Đã hủy

export interface OrderDishItem {
  id: string | number;
  dishId: number;
  dishName: string;
  quantity: number;
  price: number;
  formattedPrice?: string;
  note?: string;
}

export interface OrderItem {
  id: string;               // ID đơn hàng ('102')
  code: string;             // Mã đơn hiển thị ('#DH102')
  isVip?: boolean;          // Có phải bàn/đơn VIP không
  tableId: number;          // ID Bàn (5)
  tableName: string;        // Tên bàn ('Bàn 05')
  employeeId: string;       // Mã nhân viên ('NV-01')
  employeeName: string;     // Tên nhân viên ('NV-01 Tuấn Anh')
  items: OrderDishItem[];   // Danh sách các món ăn trong đơn
  itemsSummary: string;     // Chuỗi tóm tắt món ăn ('1x Bò Wagyu Úc, 1x Mỳ Ý Trúc Đen, 2x Vang Đỏ')
  note?: string;            // Ghi chú phục vụ ('Steak Medium • Không tỏi')
  isUrgentNote?: boolean;   // Ghi chú quan trọng có dấu ! đỏ
  totalAmount: number;      // Tổng tiền dạng số (561600)
  formattedTotal: string;   // Tổng tiền định dạng ('561.600 đ')
  time: string;             // Giờ tạo đơn ('19:42')
  relativeTime: string;     // Thời gian tương đối ('3 phút trước')
  createdAt: string;        // ISO timestamp
  status: OrderStatus;      // Trạng thái đơn
  statusText: string;       // Nhãn tiếng Việt ('Chờ tiếp nhận', 'Đang nấu', 'Đã lên món', 'Đã phục vụ', 'Đã hủy')
}

export interface OrderStats {
  totalToday: number;
  growthRate: string;
  pending: number;
  cooking: number;
  completed: number;
  onTimeRate: string;
}

export interface OrderFiltersState {
  searchQuery: string;
  statusTab: 'ALL' | 'PENDING' | 'COOKING' | 'COMPLETED' | 'CANCELLED';
  tableFilter: 'ALL' | number;
}

export interface CreateOrderInput {
  tableId: number;
  items: Array<{ dishId: number; quantity: number; note?: string }>;
  note?: string;
}
