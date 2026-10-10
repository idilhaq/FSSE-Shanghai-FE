'use client'

import { Product } from "./page";

function formatPrice(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

export function ProductCard({ product }: { product: Product }) {
    return (
        <div className="border rounded-lg p-4">
            <div className="bg-gray-100 h-24 flex items-center justify-center text-gray-400 rounded mb-3">
                img
            </div>
            <h3 className="font-semibold">{product.title}</h3>
            <p className="text-gray-600">{formatPrice(product.price)}</p>
            {product.inStock ? (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">In stock</span>
            ) : (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700">Out of stock</span>
            )}
        </div>
    );
}