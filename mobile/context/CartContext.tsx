import { createContext, useContext, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  stock: number;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem, qty?: number) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem, qty: number = 1) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === item.id);

      if (exist) {
        return prev.map((p) =>
          p.id === item.id && p.qty + qty <= p.stock
            ? { ...p, qty: p.qty + qty }
            : p,
        );
      }

      return [...prev, { ...item, qty }];
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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        remove,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
