'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

// Cart action types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  TOGGLE_ITEM_SELECTION: 'TOGGLE_ITEM_SELECTION',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART',
  SET_LOADING: 'SET_LOADING'
};

// Initial state
const initialState = {
  items: [],
  loading: false
};

// Cart reducer
function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update existing item quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        const newItem = {
          id: `${product.id}-${Date.now()}`, // Unique ID for cart item
          product,
          quantity,
          selected: true // Default to selected
        };
        return { ...state, items: [...state.items, newItem] };
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      const { itemId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => item.id !== itemId)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== itemId)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        )
      };
    }
    
    case CART_ACTIONS.TOGGLE_ITEM_SELECTION: {
      const { itemId } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, selected: !item.selected } : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART:
      return { ...state, items: [] };
    
    case CART_ACTIONS.LOAD_CART:
      return { ...state, items: action.payload };
    
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    default:
      return state;
  }
}

// Cart provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('wazir-cutlery-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wazir-cutlery-cart', JSON.stringify(state.items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [state.items]);

  // Cart actions
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { itemId } });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { itemId, quantity } });
  };

  const toggleItemSelection = (itemId) => {
    dispatch({ type: CART_ACTIONS.TOGGLE_ITEM_SELECTION, payload: { itemId } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Computed values
  const selectedItems = state.items.filter(item => item.selected);
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedItemsCount = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = subtotal > 200 ? 0 : 15; // Free delivery over $200
  const total = subtotal + tax + deliveryFee;

  const cartValue = {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleItemSelection,
    clearCart,
    selectedItems,
    totalItems,
    selectedItemsCount,
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    deliveryFee: parseFloat(deliveryFee.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    remainingForFreeDelivery: subtotal > 0 && subtotal < 200 ? parseFloat((200 - subtotal).toFixed(2)) : 0
  };

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
