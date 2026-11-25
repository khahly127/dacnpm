'use client';

import React, { createContext, useContext, useMemo, useSyncExternalStore } from 'react';
import { Dish, SelectedOption } from '@/types/menu';
import { EnhancedCartItem } from '@/types/cart';
import { orderService } from '@/services/orderService';

interface CartContextType {
  cartItems: EnhancedCartItem[];
  addToCart: (
    dish: Dish,
    options?: SelectedOption[],
    note?: string,
    quantity?: number,
    isFromDetailModal?: boolean
  ) => void;
  removeFromCart: (dishId: number) => void;
  updateItemQuantity: (cartItemId: string, quantity: number) => void;
  removeCartItem: (cartItemId: string) => void;
  getItemQuantity: (dishId: number) => number;
  tableNote: string;
  setTableNote: (note: string) => void;
  distinctItemsCount: number;
  totalQuantity: number;
  totalCount: number;
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEYS = {
  CART: 'casacozy_cart_v2',
  TABLE_NOTE: 'casacozy_table_note',
};

// External store listeners for React 19 hydration safety
let storeListeners: Array<() => void> = [];

function emitStoreChange() {
  for (const listener of storeListeners) {
    listener();
  }
}

function subscribeToStore(listener: () => void) {
  storeListeners = [...storeListeners, listener];
  return () => {
    storeListeners = storeListeners.filter((l) => l !== listener);
  };
}

const cartStorageStore = {
  getSnapshot(): string {
    if (typeof window === 'undefined') return '[]';
    try {
      return localStorage.getItem(STORAGE_KEYS.CART) || '[]';
    } catch {
      return '[]';
    }
  },
  getServerSnapshot(): string {
    return '[]';
  },
  set(items: EnhancedCartItem[]) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
      } catch {}
    }
    emitStoreChange();
  },
};

const noteStorageStore = {
  getSnapshot(): string {
    if (typeof window === 'undefined') return '';
    try {
      return localStorage.getItem(STORAGE_KEYS.TABLE_NOTE) || '';
    } catch {
      return '';
    }
  },
  getServerSnapshot(): string {
    return '';
  },
  set(note: string) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEYS.TABLE_NOTE, note);
      } catch {}
    }
    emitStoreChange();
  },
};

function generateCartItemId(
  dishId: number,
  options: SelectedOption[] = [],
  note: string = ''
): string {
  const optKey = options.map((o) => o.optionId).sort().join('-');
  return `${dishId}__${optKey}__${note.trim().toLowerCase()}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Sync with external localStorage store without cascading renders
  const rawCartJson = useSyncExternalStore(
    subscribeToStore,
    cartStorageStore.getSnapshot,
    cartStorageStore.getServerSnapshot
  );

  const tableNote = useSyncExternalStore(
    subscribeToStore,
    noteStorageStore.getSnapshot,
    noteStorageStore.getServerSnapshot
  );

  const cartItems = useMemo<EnhancedCartItem[]>(() => {
    try {
      return JSON.parse(rawCartJson);
    } catch {
      return [];
    }
  }, [rawCartJson]);

  const saveCart = (items: EnhancedCartItem[]) => {
    cartStorageStore.set(items);
  };

  const setTableNote = (note: string) => {
    noteStorageStore.set(note);
  };

  const addToCart = (
    dish: Dish,
    options: SelectedOption[] = [],
    note: string = '',
    qty: number = 1,
    isFromDetailModal: boolean = false
  ) => {
    if (!dish.isAvailable) return;

    const cartItemId = generateCartItemId(dish.id, options, note);
    const extraPrice = options.reduce((sum, opt) => sum + opt.price, 0);
    const unitPrice = dish.price + extraPrice;

    let nextItems = [...cartItems];

    if (isFromDetailModal) {
      // Nếu được thêm từ modal chi tiết (có tùy chọn/ghi chú), gỡ bản chưa cấu hình trước đó nếu có
      if (options.length > 0 || note.trim()) {
        nextItems = nextItems.filter(
          (item) => !(item.dish.id === dish.id && item.selectedOptions.length === 0 && !item.note)
        );
      }

      const existingIndex = nextItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        // Cập nhật số lượng chính xác theo stepper trong modal
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: qty,
          totalPrice: unitPrice * qty,
        };
      } else {
        nextItems.push({
          cartItemId,
          dish,
          quantity: qty,
          selectedOptions: options,
          note: note.trim(),
          unitPrice,
          totalPrice: unitPrice * qty,
        });
      }
    } else {
      // Từ nút nhanh "+ Thêm" hoặc "+" ngoài danh sách: cộng dồn theo qty
      const existingIndex = nextItems.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const newQty = nextItems[existingIndex].quantity + qty;
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: newQty,
          totalPrice: unitPrice * newQty,
        };
      } else {
        nextItems.push({
          cartItemId,
          dish,
          quantity: qty,
          selectedOptions: options,
          note: note.trim(),
          unitPrice,
          totalPrice: unitPrice * qty,
        });
      }
    }

    saveCart(nextItems);
  };

  // Quick remove from dish card (removes first matching dish or reduces qty)
  const removeFromCart = (dishId: number) => {
    const existingIndex = cartItems.findIndex((item) => item.dish.id === dishId);
    if (existingIndex === -1) return;

    let nextItems: EnhancedCartItem[];
    if (cartItems[existingIndex].quantity > 1) {
      nextItems = [...cartItems];
      const newQty = nextItems[existingIndex].quantity - 1;
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: newQty,
        totalPrice: nextItems[existingIndex].unitPrice * newQty,
      };
    } else {
      nextItems = cartItems.filter((_, idx) => idx !== existingIndex);
    }

    saveCart(nextItems);
  };

  const updateItemQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(cartItemId);
      return;
    }

    const nextItems = cartItems.map((item) => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          quantity,
          totalPrice: item.unitPrice * quantity,
        };
      }
      return item;
    });

    saveCart(nextItems);
  };

  const removeCartItem = (cartItemId: string) => {
    const nextItems = cartItems.filter((item) => item.cartItemId !== cartItemId);
    saveCart(nextItems);
  };

  const getItemQuantity = (dishId: number): number => {
    return cartItems
      .filter((item) => item.dish.id === dishId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    saveCart([]);
    setTableNote('');
  };

  // Derived calculations
  const distinctItemsCount = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const vatAmount = orderService.calculateVat(subtotal);
  const grandTotal = subtotal + vatAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateItemQuantity,
        removeCartItem,
        getItemQuantity,
        tableNote,
        setTableNote,
        distinctItemsCount,
        totalQuantity,
        totalCount: totalQuantity,
        subtotal,
        vatAmount,
        grandTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}
