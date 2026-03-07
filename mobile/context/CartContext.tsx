import { createContext, useContext, useState } from 'react';

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  stock: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: any) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === newItem.id);

      if (exist) {
        return prev.map((i) =>
          i.id === newItem.id
            ? {
                ...i,
                qty: Math.min(i.qty + newItem.qty, i.stock),
              }
            : i,
        );
      }

      return [...prev, newItem];
    });
  };

  const increase = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty < item.stock
          ? { ...item, qty: item.qty + 1 }
          : item,
      ),
    );
  };

  const decrease = (id: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item,
      ),
    );
  };

  const remove = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increase, decrease, remove }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext)!;
