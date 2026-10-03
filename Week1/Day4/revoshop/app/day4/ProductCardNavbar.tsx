'use client'

import { useState } from "react";

export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    sale: boolean;
}

function getStockBadgeClasses(stock: number): string {
    const base = "text-xs px-2 py-1 rounded-full font-medium";
    return stock > 0
        ? base + " bg-green-100 text-green-700"
        : base + " bg-red-100 text-red-700";
}

function getButtonClasses(inStock: boolean): string {
    const base = "px-4 py-2 rounded font-medium";
    return inStock
        ? base + " bg-blue-600 text-white hover:bg-blue-700"
        : base + " bg-gray-200 text-gray-400 cursor-not-allowed";
}

export function ProductCardNavbar({ product }: { product: Product }) {
    const inStock = product.stock > 0;
    const [quantity, setQuantity] = useState(0);

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
            <h3 className="font-bold">
                {product.name}
                {product.sale && <span className="ml-2 text-xs text-pink-500">Sale</span>}
            </h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>

            <span className={getStockBadgeClasses(product.stock)}>{inStock ? "In Stock" : "Out of Stock"}</span>

            <div className="flex items-center gap-3 mt-3">
                {inStock ? (
                    <>
                        <button onClick={decrease} disabled={quantity <= 1} className="px-2 border rounded">-</button>
                        {quantity}
                        <button onClick={increase} disabled={quantity >= product.stock} className="px-2 border rounded">+</button>
                    </>
                ) : (
                    <button className={getButtonClasses(false)} disabled>Unavailable</button>
                )}
            </div>
        </div>
    );
}