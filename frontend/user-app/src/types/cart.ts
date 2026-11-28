import { SelectedOption, Dish } from './menu';

export interface EnhancedCartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  selectedOptions: SelectedOption[];
  note: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CartOrderPayload {
  ma_ban: number;
  items: {
    ma_mon: number;
    so_luong: number;
    don_gia?: number;
    ghi_chu?: string;
  }[];
  ghi_chu_ban?: string;
}

export interface OrderCreationResult {
  success: boolean;
  message: string;
  orderId?: number;
  orderCode?: string;
}
