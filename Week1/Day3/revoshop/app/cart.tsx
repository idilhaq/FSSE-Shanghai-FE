'use client'

import { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
}

const products: Product[] = [
    { id: 1, name: "Laptop Stand", price: 250000 },
    { id: 2, name: "Keyboard", price: 450000 },
    { id: 3, name: "Mouse", price: 150000 },
];

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

export function Cart() {
    const [cart, setCart] = useState<Product[]>([])

    const addToCart = (product: Product) => { setCart([...cart, product]) }

    return (
        <div className="p-4">
            <div className="flex gap-4 flex-wrap">
                {products.map((p) => (
                    <div key={p.id} className="border border-gray-700 rounded-lg p-4 w-44">
                        <h3 className="font-bold">{p.name}</h3>
                        <p className="mb-2">Rp {p.price.toLocaleString("id-ID")}</p>
                        <button onClick={() => addToCart(p)} className="ml-auto px-3 py-1 bg-blue-600 rounded">Add to cart</button>
                    </div>
                ))}
            </div>
            <CartSummary cart={cart} />
        </div>
    );
}