'use client'

import { useParams } from 'next/navigation'

const ROUTES = [
    { url: '/', label: 'Home' },
    { url: '/products', label: 'Active' },
    { url: '/categories', label: 'Page' },
    { url: '/orders', label: 'Page' },
];

export default function ProductsPage() {
    const params = useParams<{ id: string }>()
    // TODO: <h1>Products</h1>, then a 4-column grid of route cards from ROUTES,
    //       then one wide card for "/products/[id]" — "Dynamic segment - params.id".
    return (
        <>
            <h1 className="px-6 py-4 text-xl font-bold">Product #{params.id}</h1>
            {
                ROUTES.map((r) => (
                    <div key={r.url} className="border rounded-lg p-4">
                        <p className="text-blue-600 font-mono text-sm">{r.url}</p>
                        <p className="text-gray-400 font-mono text-xs">{r.label}</p>
                    </div>
                ))
            }
        </>
    );
}