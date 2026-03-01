import { create, StateCreator } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  customization?: string;
  variantId?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

/**
 * Shopping Cart Store using Zustand
 * Persists to localStorage for cart recovery
 */
export const useCartStore = create<CartStore>((set: any, get: any) => ({
  items: [],

  addItem: (item: CartItem) => {
    set((state: CartStore) => {
      const existingItem = state.items.find(
        (i: CartItem) => i.id === item.id && i.size === item.size
      );

      if (existingItem) {
        return {
          items: state.items.map((i: CartItem) =>
            i.id === item.id && i.size === item.size
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return { items: [...state.items, item] };
    });

    // Persist to localStorage
    const state = get();
    localStorage.setItem('cart', JSON.stringify(state.items));
  },

  removeItem: (id: string) => {
    set((state: CartStore) => ({
      items: state.items.filter((item) => item.id !== id),
    }));

    const state = get();
    localStorage.setItem('cart', JSON.stringify(state.items));
  },

  updateQuantity: (id: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }

    set((state: CartStore) => ({
      items: state.items.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));

    const state = get();
    localStorage.setItem('cart', JSON.stringify(state.items));
  },

  clearCart: () => {
    set({ items: [] });
    localStorage.removeItem('cart');
  },

  getTotalPrice: () => {
    return get().items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
  },
}));

// Hydrate cart from localStorage on app start
if (typeof window !== 'undefined') {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      const items: CartItem[] = JSON.parse(savedCart);
      useCartStore.setState({ items });
    } catch (e) {
      console.warn('[Cart] Failed to restore cart from localStorage', e);
    }
  }
}
