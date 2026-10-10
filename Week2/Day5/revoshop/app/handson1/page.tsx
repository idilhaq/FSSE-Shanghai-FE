'use client';

import { useState, useEffect } from 'react';

type Product = { id: number; name: string; price: number; inStock: boolean };

// Simulates GET http://localhost:5000/products from the Flask API.
// In a real Server Component (app/page.tsx) you write:
//   const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/products');
//   const products = await res.json();  // typed as Product[]
function fetchProducts(): Promise<Product[]> {
    const DATA: Product[] = [
        { id: 1, name: 'Laptop Stand', price: 250000, inStock: true },
        { id: 2, name: 'Mouse', price: 150000, inStock: true },
        { id: 3, name: 'Keyboard', price: 450000, inStock: false },
        { id: 4, name: 'USB-C Hub', price: 320000, inStock: true },
        { id: 5, name: 'Webcam', price: 540000, inStock: true },
        { id: 6, name: 'Desk Lamp', price: 180000, inStock: true },
        { id: 7, name: 'Monitor', price: 1800000, inStock: false },
    ];
    return new Promise((resolve) => setTimeout(() => resolve(DATA), 300));
}

function formatPrice(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

// Read-only card: name, price, stock badge ONLY.
// No Add to Cart button -> no interactivity -> no "use client" needed.
function ProductCard({ product }: { product: Product }) {
    return (
        <div className="border rounded-lg p-4">
            <div className="bg-gray-100 h-24 flex items-center justify-center text-gray-400 rounded mb-3">img</div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{formatPrice(product.price)}</p>
            {product.inStock ? (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">In stock</span>
            ) : (
                <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700">Out of stock</span>
            )}
        </div>
    );
}

export default function App() {
    const [products, setProducts] = useState<Product[]>([]);

    // Mimics: const products = await fetchProducts() in an async Server Component.
    useEffect(() => {
        fetchProducts().then((data) => setProducts(data));
    }, []);

    // Step 3: the home page shows only the FIRST 5 "featured" products.
    const featured = products.slice(0, 5);

    return (
        <main className="font-sans p-6">
            <nav className="flex items-center gap-4 text-sm mb-5 border-b pb-3">
                <span className="font-bold text-base">RevoShop</span>
                <span className="font-semibold underline">Home</span>
                <span className="text-gray-500">Products</span>
                <span className="text-gray-500">Categories</span>
                <span className="ml-auto text-xs text-gray-400">Server Component</span>
            </nav>

            <h2 className="text-xl font-bold mb-3">Featured products</h2>
            <div className="grid grid-cols-2 gap-4 max-w-xl">
                {featured.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">No AddToCartButton — read only</p>
        </main>
    );
}