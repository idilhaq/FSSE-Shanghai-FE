// Server Component (no 'use client').
// The fetch runs on the server during render:
//   - while awaiting, the segment suspends -> loading.tsx is shown
//   - if it throws, the error flows to error.tsx

function formatPrice(n: number) {
    return 'Rp ' + n.toLocaleString('id-ID');
}

interface Product {
    id: number;
    title: string;
    price: number;
    inStock: boolean;
    category: string;
}

async function fetchProducts(): Promise<Product[]> {
    // Disable caching so loading/error states are exercised on every request.
    const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to load products (' + res.status + ')');
    }
    const products: Product[] = await res.json(); // now a real array

    return products;
}

function ProductCard({ product }: { product: Product }) {
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

export default async function Products() {
    // Awaiting during render makes the segment suspend (loading.tsx) and lets a
    // thrown error bubble up to error.tsx.
    const products = await fetchProducts();

    return (
        <main className="font-sans p-6">
            <p className="text-sm text-gray-500 mb-3">RevoShop &rsaquo; Products</p>
            <div className="grid grid-cols-3 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </main>
    );
}
