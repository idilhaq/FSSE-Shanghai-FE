'use client'

import { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    in_stock: boolean;
    stock: number;
}

const products: Product[] = [
    { id: 1, name: "Laptop Stand", price: 250000, in_stock: true, stock: 8 },
    { id: 2, name: "Keyboard", price: 450000, in_stock: true, stock: 5 },
    { id: 3, name: "Mouse", price: 150000, in_stock: true, stock: 12 },
];

// 1) Per-card quantity counter + Add to cart
function ProductCard({ product, onAdd }: { product: Product, onAdd: (p: Product) => void }) {
    const [quantity, setQuantity] = useState(1)
    const increase = () => {
        if (!product.stock) return

        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    }

    const decrease = () => {
        if (!product.stock) return

        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    return (
        <div className="border border-gray-700 rounded-lg p-4 w-56">
            <div className="bg-gray-800 h-24 flex items-center justify-center rounded mb-3">img</div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">In stock</span>
            <button onClick={decrease} disabled={quantity <= 1} className="px-2 border rounded">-</button>
            {quantity}
            <button onClick={increase} disabled={quantity >= product.stock} className="px-2 border rounded">+</button>
            <button onClick={() => onAdd(product)} className="ml-auto px-3 py-1 bg-blue-600 rounded">Add to cart</button>
        </div>
    );
}

// // 2) Derived summary — count + total from the cart
function CartSummary({ cart }: { cart: Product[] }) {
    const total = cart.reduce((sum, p) => sum + p.price, 0)
    return (
        <div className="border-t border-gray-700 mt-6 pt-3 flex justify-between">
            <div>
                <p className="text-xs text-gray-400">Items in cart</p>
                <p className="font-bold">Total</p>
            </div>
            <div className="text-right">
                {cart.length}
                <p className="font-bold">Rp {total.toLocaleString("id-ID")}</p>
            </div>
        </div>
    );
}

export function Shop() {
    const [query, setQuery] = useState("")
    const [cart, setCart] = useState<Product[]>([])

    const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

    const addToCart = (product: Product) => { setCart([...cart, product]) }

    return (
        <main className="p-4">
            <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                placeholder="Search products..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex gap-4 flex-wrap">
                {filtered.map((p) => (
                    <ProductCard key={p.id} product={p} onAdd={addToCart} />
                ))}
            </div>
            <CartSummary cart={cart} />
        </main>
    );
}