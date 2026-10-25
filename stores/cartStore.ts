import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem } from '@/types';

export interface CartTotals {
  selectedItems: CartItem[];
  totalItems: number;
  selectedItemsCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  remainingForFreeDelivery: number;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  toggleItemSelection: (itemId: string) => void;
  clearCart: () => void;
  getTotals: () => CartTotals;
}

export const calculateDerivedTotals = (items: CartItem[]): CartTotals => {
  const selectedItems = items.filter((item) => item.selected);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  const rawSubtotal = selectedItems.reduce(
    (sum, item) => sum + (parseFloat(String(item.product?.price || 0)) || 0) * item.quantity,
    0
  );
  const subtotal = parseFloat(rawSubtotal.toFixed(2));
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const deliveryFee = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));
  const remainingForFreeDelivery =
    subtotal > 0 && subtotal < 200 ? parseFloat((200 - subtotal).toFixed(2)) : 0;

  return {
    selectedItems,
    totalItems,
    selectedItemsCount,
    subtotal,
    tax,
    deliveryFee,
    total,
    remainingForFreeDelivery,
  };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const currentItem = updatedItems[existingItemIndex];
            if (currentItem) {
              updatedItems[existingItemIndex] = {
                ...currentItem,
                quantity: currentItem.quantity + quantity,
              };
            }
            return { items: updatedItems };
          }

          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            selected: true,
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeFromCart: (itemId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      updateQuantity: (itemId: string, quantity: number) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== itemId) };
          }
          return {
            items: state.items.map((item) =>
              item.id === itemId ? { ...item, quantity } : item
            ),
          };
        });
      },

      toggleItemSelection: (itemId: string) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, selected: !item.selected } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotals: () => calculateDerivedTotals(get().items),
    }),
    {
      name: 'wazir-cutlery-cart',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({ items: state.items } as unknown as CartState),
    }
  )
);
