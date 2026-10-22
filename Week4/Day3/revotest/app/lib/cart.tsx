"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "./products";

export type CartItem = Product & { qty: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addToCart: (product: Product) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "revoshop-cart";

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate from localStorage after mount so the cart survives real
  // browser navigations between /products, /cart and /checkout.
  useEffect(() => {
    setItems(readStoredCart());
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  }, []);

  const addToCart = useCallback(
    (product: Product) => {
      const current = readStoredCart();
      const existing = current.find((item) => item.id === product.id);
      const next = existing
        ? current.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + 1 } : item
          )
        : [...current, { ...product, qty: 1 }];
      persist(next);
    },
    [persist]
  );

  const clearCart = useCallback(() => {
    persist([]);
  }, [persist]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return { items, count, total, addToCart, clearCart };
  }, [items, addToCart, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
