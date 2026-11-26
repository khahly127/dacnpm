import { EnhancedCartItem } from './cart';

export interface TableLocationInfo {
  tableName: string;
  floor: string;
  area: string;
  time: string;
}

export interface OrderConfirmationProps {
  onBackToCart: () => void;
  onConfirmOrder: () => Promise<void>;
  isSubmitting?: boolean;
}

export interface OrderSuccessData {
  orderId?: number;
  orderCode: string;
  tableName: string;
  time: string;
  items: EnhancedCartItem[];
  grandTotal: number;
}
