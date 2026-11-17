'use client';

import React, { createContext, useContext, useState } from 'react';
import { CartItem, Dish } from '@/types/menu';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (dish: Dish) => void;
  removeFromCart: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  getItemQuantity: (dishId: number) => number;
  totalCount: number;
  totalAmount: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = 'casacozy_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Lazy initialization from localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {}
    }
    return [];
  });

  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  };

  const addToCart = (dish: Dish) => {
    if (!dish.isAvailable) return;
    const existingIndex = cartItems.findIndex((item) => item.dish.id === dish.id);

    let nextItems: CartItem[];
    if (existingIndex > -1) {
      nextItems = [...cartItems];
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity + 1,
      };
    } else {
      nextItems = [...cartItems, { dish, quantity: 1 }];
    }
    saveCart(nextItems);
  };

  const removeFromCart = (dishId: number) => {
    const existingIndex = cartItems.findIndex((item) => item.dish.id === dishId);
    if (existingIndex === -1) return;

    let nextItems: CartItem[];
    if (cartItems[existingIndex].quantity > 1) {
      nextItems = [...cartItems];
      nextItems[existingIndex] = {
        ...nextItems[existingIndex],
        quantity: nextItems[existingIndex].quantity - 1,
      };
    } else {
      nextItems = cartItems.filter((item) => item.dish.id !== dishId);
    }
    saveCart(nextItems);
  };

  const updateQuantity = (dishId: number, quantity: number) => {
    if (quantity <= 0) {
      saveCart(cartItems.filter((item) => item.dish.id !== dishId));
      return;
    }
    const nextItems = cartItems.map((item) =>
      item.dish.id === dishId ? { ...item, quantity } : item
    );
    saveCart(nextItems);
  };

  const getItemQuantity = (dishId: number): number => {
    const item = cartItems.find((i) => i.dish.id === dishId);
    return item ? item.quantity : 0;
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        getItemQuantity,
        totalCount,
        totalAmount,
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
