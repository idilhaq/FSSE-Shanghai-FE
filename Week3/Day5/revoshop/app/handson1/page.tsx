'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ===== Types =====
interface Product {
    id: number;
    name: string;
    price: number;
}

interface CartItem extends Product {
    qty: number;
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (product: Product) => void;
    count: number;
}

// ===== CartContext: holds an array of CartItem { id, name, price, qty } =====
const CartContext = createContext<CartContextValue | null>(null);
function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}

function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);

    // Load the saved cart ONCE on mount — this is what survives a refresh.
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    // TODO 1: persist the cart to localStorage whenever "items" changes.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    function addToCart(product: Product) {
        setItems((prev) => {
            const found = prev.find((i) => i.id === product.id);
            if (found) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
        });
    }

    const count = items.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, count }}>
            {children}
        </CartContext.Provider>
    );
}

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

// ===== AddToCartButton: only logged-in users may add to cart =====
function AddToCartButton({ product, isLoggedIn }: { product: Product; isLoggedIn: boolean }) {
    const { addToCart } = useCart();

    // TODO 2: when NOT logged in, render a "Login to buy" link instead of the button.
    if (!isLoggedIn) {
        return <a href="/login" className="block text-center text-sm text-blue-600 border border-blue-300 rounded px-3 py-2">Login to buy</a>;
    }

    return (
        <button
            onClick={() => addToCart(product)}
            className="w-full text-sm bg-gray-900 text-white rounded px-3 py-2"
        >Add to cart</button>
    );
}

function ProductCard({ product, isLoggedIn }: { product: Product; isLoggedIn: boolean }) {
    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white text-gray-900 w-44">
            <p className="font-semibold">{product.name}</p>
            <p className="text-sm text-gray-600 mb-1">{rp(product.price)}</p>
            <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 mb-3">In stock</span>
            <p className="text-xs text-gray-400 mb-2">isLoggedIn: {String(isLoggedIn)}</p>
            <AddToCartButton product={product} isLoggedIn={isLoggedIn} />
        </div>
    );
}

function CartBar() {
    const { count } = useCart();
    return <p className="mt-4 text-sm font-medium">Cart ({count} item{count === 1 ? '' : 's'})</p>;
}

export default function App() {
    // A "Refresh" button remounts CartProvider so you can SEE localStorage reload.
    const [mountKey, setMountKey] = useState(0);

    return (
        <main className="font-sans p-6 bg-gray-50 text-gray-900 min-h-screen">
            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-lg font-bold">RevoShop</h1>
                <button
                    onClick={() => setMountKey((k) => k + 1)}
                    className="ml-auto text-xs border border-gray-300 bg-white text-gray-700 rounded px-2 py-1"
                >Refresh (reload cart)</button>
            </div>

            <CartProvider key={mountKey}>
                <div className="flex gap-4">
                    <ProductCard product={{ id: 1, name: 'Laptop Stand', price: 250000 }} isLoggedIn={true} />
                    <ProductCard product={{ id: 2, name: 'Mouse', price: 150000 }} isLoggedIn={false} />
                </div>
                <CartBar />
            </CartProvider>
        </main>
    );
}