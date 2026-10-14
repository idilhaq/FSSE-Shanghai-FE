'use client';

import { useState, useEffect } from 'react';

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
};

// Simulates GET http://localhost:5000/products on the Flask backend.
// Real call:  const res = await fetch(base + '/products'); const data = await res.json();
function mockGetProducts(): Promise<Product[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'Laptop Stand', price: 250000, stock: 10, category: 'Accessories' },
                { id: 2, name: 'Wireless Mouse', price: 150000, stock: 5, category: 'Electronics' },
            ]);
        }, 400);
    });
}

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

// Pretend this comes from useAuth() — the admin verified by AdminRoute.
function useAuth() {
    return { currentUser: { id: 1, username: 'sevrian', role: 'admin' }, isLoggedIn: true };
}

function CreateProductForm() {
    return (
        <div className="border rounded-lg p-4 bg-amber-600 mb-4 text-sm">
            <p className="font-medium mb-2">New product</p>
            <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Product name" />
            <button className="px-3 py-1.5 bg-gray-900 text-white rounded">Save product</button>
        </div>
    );
}

export default function DashboardPage() {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Fetch GET /products on mount
    useEffect(() => {
        mockGetProducts().then((data) => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const isAdmin = currentUser.role === 'admin'

    return (
        <main className="font-sans p-6 bg-gray-500 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/dashboard</p>

            <header className="flex items-center gap-2 mb-5">
                <span className="font-bold text-lg">RevoShop</span>
                <span className="ml-auto text-sm text-gray-600">{currentUser.username}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white">{currentUser.role}</span>
            </header>

            {isAdmin && (
                <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-xl font-semibold mr-auto">Products</h1>
                    <a href="/dashboard/categories" className="text-sm text-blue-600 underline">Manage categories</a>
                    <button
                        onClick={() => setShowForm((s) => !s)}
                        className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm"
                    >+ New product</button>
                </div>
            )}

            {showForm && <CreateProductForm />}

            {isAdmin ? (loading ? (
                <p className="text-sm text-black-500">Loading products…</p>
            ) : (
                <table className="w-full text-sm bg-blue-600 border rounded-lg overflow-hidden">
                    <thead className="bg-black-100 text-left">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id} className="border-t">
                                <td className="p-3 font-medium">{p.name}</td>
                                <td className="p-3">{rp(p.price)}</td>
                                <td className="p-3">{p.stock}</td>
                                <td className="p-3">{p.category}</td>
                                <td className="p-3 flex gap-2">
                                    <button className="px-2 py-1 border rounded">Edit</button>
                                    <button className="px-2 py-1 border rounded text-red-600">Del</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )) : (
                <p className="text-sm text-black-500">Access Denied</p>
            )}
        </main>
    );
}