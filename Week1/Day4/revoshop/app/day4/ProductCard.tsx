export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    sale: boolean;
}

export function ProductCard({ product }: { product: Product }) {
    const inStock = product.stock > 0;

    return (
        <div className="border border-gray-700 rounded-lg p-4 w-56">
            <div className="bg-gray-800 h-20 flex items-center justify-center rounded mb-3">img</div>
            <h3 className="font-bold">
                {product.name}
                {product.sale && <span className="ml-2 text-xs text-pink-500">Sale</span>}
            </h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>

            {inStock ?
                (<span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">In Stock</span>)
                :
                (<span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Out of Stock</span>)
            }
            <div className="mt-3">
                <button disabled={!inStock} className="px-4 py-2 rounded bg-blue-600 text-white">{inStock ? "Add to Cart" : "Unavailable"}</button>
            </div>
        </div>
    );
}
