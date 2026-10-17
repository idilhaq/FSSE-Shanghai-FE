'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '@/services/dummyjson';
import { useAuth } from '@/context/AuthContext';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    /** Add `qty` units of a product, clamped to available stock. Returns units actually added. */
    addToCart: (product: Product, qty?: number) => number;
    /** Set the exact quantity for a product (0 removes it); clamped to [0, stock]. */
    setQuantity: (productId: number, qty: number) => void;
    /** +1 unit, blocked at max stock. */
    incrementQuantity: (productId: number) => void;
    /** -1 unit, removes the item when it hits 0. */
    decrementQuantity: (productId: number) => void;
    removeFromCart: (productId: number) => void;
    clearCart: () => void;
    /** Current quantity of a product in the cart (0 if absent). */
    getQuantity: (productId: number) => number;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Each user gets an isolated cart bucket in localStorage. Guests share a
// dedicated guest bucket. Switching accounts switches the visible cart.
const STORAGE_PREFIX = 'shopping_cart';
const cartKeyFor = (email?: string | null) => `${STORAGE_PREFIX}:${email ?? 'guest'}`;

function readCart(email?: string | null): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(cartKeyFor(email));
        return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const email = user?.email ?? null;

    // Start empty so the first client render matches the server-rendered HTML
    // (localStorage isn't available on the server). The real cart is loaded
    // after mount — and reloaded whenever the signed-in user changes — avoiding
    // a hydration mismatch.
    const [cart, setCart] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load the current user's bucket after mount / on account switch. Reading
    // localStorage must happen post-hydration to avoid a server/client mismatch,
    // so setState-in-effect is the correct pattern here.
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(readCart(email));
        setHydrated(true);
    }, [email]);

    // Persist to the current user's bucket on every change — but only after the
    // initial load, so we don't overwrite stored data with the empty start state.
    useEffect(() => {
        if (!hydrated || typeof window === 'undefined') return;
        localStorage.setItem(cartKeyFor(email), JSON.stringify(cart));
    }, [cart, email, hydrated]);

    const getQuantity = useCallback(
        (productId: number) => cart.find((i) => i.product.id === productId)?.quantity ?? 0,
        [cart]
    );

    const addToCart = useCallback((product: Product, qty: number = 1): number => {
        const stock = product.stock;
        let added = 0;
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            const current = existing?.quantity ?? 0;
            // Validation: never exceed available stock.
            const next = Math.min(current + Math.max(0, qty), stock);
            added = next - current;
            if (added <= 0) return prev; // already at max stock, nothing to add
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id ? { ...item, quantity: next } : item
                );
            }
            return [...prev, { product, quantity: next }];
        });
        return added;
    }, []);

    const setQuantity = useCallback((productId: number, qty: number) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === productId);
            if (!existing) return prev;
            const stock = existing.product.stock;
            // Validation: clamp into [0, stock]; 0 removes the line.
            const next = Math.max(0, Math.min(qty, stock));
            if (next === 0) return prev.filter((item) => item.product.id !== productId);
            return prev.map((item) =>
                item.product.id === productId ? { ...item, quantity: next } : item
            );
        });
    }, []);

    const incrementQuantity = useCallback(
        (productId: number) => setQuantity(productId, getQuantity(productId) + 1),
        [setQuantity, getQuantity]
    );

    const decrementQuantity = useCallback(
        (productId: number) => setQuantity(productId, getQuantity(productId) - 1),
        [setQuantity, getQuantity]
    );

    const removeFromCart = useCallback((productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                setQuantity,
                incrementQuantity,
                decrementQuantity,
                removeFromCart,
                clearCart,
                getQuantity,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be enclosed in a CartProvider framework');
    return context;
}
