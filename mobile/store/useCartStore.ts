import { create } from 'zustand';

type CartItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  qty: number;
};

type CartState = {
  cart: CartItem[];

  addToCart: (product: Omit<CartItem, 'qty'>, qty: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: [],

  addToCart: (product, qty) =>
    set((state) => {
      const exist = state.cart.find((i) => i.id === product.id);

      if (exist) {
        return {
          cart: state.cart.map((i) =>
            i.id === product.id
              ? { ...i, qty: Math.min(i.qty + qty, i.stock) }
              : i,
          ),
        };
      }

      return {
        cart: [...state.cart, { ...product, qty }],
      };
    }),

  increase: (id) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id && i.qty < i.stock ? { ...i, qty: i.qty + 1 } : i,
      ),
    })),

  decrease: (id) =>
    set((state) => ({
      cart: state.cart.map((i) =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i,
      ),
    })),

  remove: (id) =>
    set((state) => ({
      cart: state.cart.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ cart: [] }),
}));
