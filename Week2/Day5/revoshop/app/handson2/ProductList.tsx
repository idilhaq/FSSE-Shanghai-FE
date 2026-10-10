'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from './page';

const DB: Product[] = [
    { id: 1, name: 'Laptop Stand', price: 250000, inStock: true, categoryId: 2 },
    { id: 2, name: 'Mouse', price: 150000, inStock: true, categoryId: 1 },
    { id: 3, name: 'Keyboard', price: 450000, inStock: true, categoryId: 1 },
    { id: 4, name: 'USB-C Hub', price: 320000, inStock: true, categoryId: 2 },
    { id: 5, name: 'Webcam', price: 540000, inStock: true, categoryId: 1 },
];

// Simulates GET /products?search=...&category_id=...
function fetchProducts(search: string, categoryId: string): Promise<Product[]> {
    let rows = DB;
    if (search) rows = rows.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (categoryId) rows = rows.filter((p) => p.categoryId === Number(categoryId));
    return new Promise((resolve) => setTimeout(() => resolve(rows), 250));
}

const CATEGORIES: Category[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Accessories' },
];

// Simulates GET /categories
function fetchCategories(): Promise<Category[]> {
    return new Promise((resolve) => setTimeout(() => resolve(CATEGORIES), 200));
}

function formatPrice(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

// This component is a Client Component ("use client" on the real file) because
// it has state, effects, and click handlers. It RECEIVES initialProducts as a
// prop from the Server Component parent (app/products/page.tsx).
export function ProductList({ initialProducts }: { initialProducts: Product[] }) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories, setCategories] = useState<Category[]>([]);
    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [cart, setCart] = useState<Product[]>([]);

    // CategoryFilter loads its options once on mount (GET /categories).
    useEffect(() => {
        fetchCategories().then(setCategories);
    }, []);

    // Step 1: refetch products whenever search OR categoryId changes.
    useEffect(() => {
        fetchProducts(search, categoryId).then(setProducts);
    }, [search, categoryId]);

    function addToCart(product: Product) {
        // Step 3: append the product so the header "Cart (n)" count increases.
        setCart((prev) => [...prev, product]);
    }

    return (
        <div className="font-sans p-6">
            <nav className="flex items-center gap-4 text-sm mb-4 border-b pb-3">
                <span className="font-bold text-base">RevoShop</span>
                <span className="text-gray-500">Home</span>
                <span className="font-semibold underline">Products</span>
                <span className="ml-auto px-2 py-1 rounded-full bg-red-500 text-white text-xs">Cart {cart.length}</span>
            </nav>

            <p className="inline-block text-xs px-2 py-0.5 mb-3 rounded bg-indigo-100 text-indigo-700">ProductList — "use client"</p>

            {/* SearchBar */}
            <input
                className="w-full border rounded px-3 py-2 mb-3 text-sm"
                placeholder="Search products… (press Enter)"
                onKeyDown={(e) => {
                    // Step 2: when Enter is pressed, apply the search term.
                    if (e.key === 'Enter') setSearch((e.target as HTMLInputElement).value);
                }}
            />

            {/* CategoryFilter */}
            <select
                className="w-full border rounded px-3 py-2 mb-3 text-sm"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
            >
                <option value="">All categories</option>
                {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            {search && <p className="text-xs text-gray-500 mb-2">Filtering by: "{search}"</p>}

            <div className="grid grid-cols-2 gap-4">
                {products.map((p) => (
                    <div key={p.id} className="border rounded-lg p-4">
                        <h3 className="font-semibold">{p.name}</h3>
                        <p className="text-gray-600">{formatPrice(p.price)}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-1 rounded bg-green-100 text-green-700">In stock</span>
                        <button
                            onClick={() => addToCart(p)}
                            className="block mt-3 w-full px-3 py-1.5 bg-gray-800 text-white rounded text-sm"
                        >
                            Add to cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}