'use client'

import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
    const params = useParams<{ id: string; }>()

    return (
        <div className="border rounded-lg p-4 mb-4">
            <p className="text-xs text-gray-400 font-mono">app/products/[id]/page.tsx</p>
            <h1 className="text-xl font-bold">Product Detail</h1>
            <p>Showing product #{params.id}</p>
            <p className="text-green-600 font-mono text-sm">→ GET /products/{params.id}</p>
        </div>
    );
}