export interface CategoryItem {
  id: number;
  name: string;
  count: number;
  iconName?: string;
}

export interface Dish {
  id: number;
  code: string;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string | null;
  categoryId: number;
  categoryName: string;
  isAvailable: boolean;
  status: string;
  portionSubtitle?: string;
}

export interface DishOption {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  isDefault?: boolean;
  badge?: string;
}

export interface DishOptionGroup {
  id: string;
  title: string;
  subtitle?: string;
  required?: boolean;
  type: 'single' | 'multiple';
  badgeText?: string;
  options: DishOption[];
}

export interface SelectedOption {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  selectedOptions?: SelectedOption[];
  note?: string;
  totalPrice?: number;
}
