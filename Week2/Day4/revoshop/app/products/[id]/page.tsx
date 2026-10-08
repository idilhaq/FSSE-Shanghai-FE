import type { Metadata } from 'next';

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

async function getProductByID(id: number): Promise<Product> {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    const res = await fetch(base + '/products' + `/${id}`);
    if (!res.ok) {
        throw new Error('Failed to load products (' + res.status + ')');
    }
    const product: Product = await res.json();

    return product;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const product = await getProductByID(Number(id));
    return { title: `${product.title} — RevoShop` };
}

export default async function App({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductByID(Number(id));

    return (
        <main className="font-sans p-6 max-w-xl">
            <p className="text-sm text-gray-500 mb-3">
                RevoShop &rsaquo; Products &rsaquo; {product.title}
            </p>

            <div className="border rounded-lg p-6">
                <div className="bg-gray-100 h-32 flex items-center justify-center text-gray-400 rounded mb-4">
                    img
                </div>
                <h1 className="text-xl font-semibold">{product.title}</h1>
                <p className="text-gray-600 mt-1">{formatPrice(product.price)}</p>
                {product.inStock ? (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                        In stock
                    </span>
                ) : (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700">
                        Out of stock
                    </span>
                )}
                <p className="text-sm text-gray-500 mt-3">Category: {product.category}</p>
            </div>
        </main>
    );
}
