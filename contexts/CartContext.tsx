'use client';
import React, { createContext, useContext, useMemo } from 'react';
import { useCartStore, calculateDerivedTotals, type CartTotals } from '@/stores/cartStore';
import type { Product, CartItem } from '@/types';

export interface CartContextType extends CartTotals {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleItemSelection: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useCartStore((state) => state.items);
  const loading = useCartStore((state) => state.loading);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const toggleItemSelection = useCartStore((state) => state.toggleItemSelection);
  const clearCart = useCartStore((state) => state.clearCart);

  const totals = useMemo(() => calculateDerivedTotals(items), [items]);

  const cartValue = useMemo<CartContextType>(
    () => ({
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleItemSelection,
      clearCart,
      ...totals,
    }),
    [items, loading, addToCart, removeFromCart, updateQuantity, toggleItemSelection, clearCart, totals]
  );

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
