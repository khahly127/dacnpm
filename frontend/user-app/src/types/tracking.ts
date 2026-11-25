export type DishPreparationStatus =
  | 'WAITING_ACCEPT'  // ⏳ Chờ xác nhận
  | 'COOKING'         // 🔄 Đang chuẩn bị
  | 'READY'           // ✓ Đã xong - Chờ lên bàn
  | 'SERVED';         // ✓ Đã phục vụ tại bàn

export interface TrackedDishItem {
  id: string | number;
  name: string;
  image?: string;
  optionsText?: string;
  cookingNote?: string;
  status: DishPreparationStatus;
  statusText: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TrackedOrderRound {
  orderId: number;
  orderCode: string;          // '#DH102'
  roundNumber: number;        // 1, 2, ...
  roundLabel: string;         // 'Đợt 1 • 19:42', 'Đợt 2 • Gọi thêm 19:55'
  time: string;               // '19:42'
  status: string;             // 'Cho xac nhan', 'Dang chuan bi', 'Dang phuc vu', 'Hoan tat'
  dishes: TrackedDishItem[];
  subtotal: number;
}

export interface TableTrackingSession {
  tableNumber: string | number;
  tableName: string;            // 'Bàn số 05'
  zoneText: string;             // 'Tầng 1 • Trong Nhà'
  combinedCodesText: string;    // '#DH102 & #DH104 (2 đợt gọi)'
  estimatedMinutesText: string; // '~8 - 12 phút nữa'
  kitchenStatusText: string;    // 'Bếp đang ra món'
  progressPercent: number;      // 65
  readyDishesCount: number;     // 3
  totalDishesCount: number;     // 5
  timelineStep: 1 | 2 | 3;      // 1: Chờ xác nhận, 2: Đang chuẩn bị, 3: Lên bàn
  isConfirmed: boolean;         // true: Admin đã bấm Xác nhận duyệt đơn
  rounds: TrackedOrderRound[];
  grandTotal: number;
  breakdownText?: string;       // 'Đợt 1: 561.600đ + Đợt 2: 183.600đ (VAT 8%)'
}
