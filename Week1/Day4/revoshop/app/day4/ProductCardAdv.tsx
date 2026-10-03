import { cn } from "../lib/styleHelper";

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

export function ProductCardAdv({ product }: { product: Product }) {
    const inStock = product.stock > 0;

    return (
        <div className={cn(
            "border rounded-lg p-4 w-56",
            inStock ? "border-gray-700"
                : "border-gray-800 opacity-80"
        )}>
            <div className="bg-gray-800 h-20 flex items-center justify-center rounded mb-3">img</div>
            <h3 className="font-bold">
                {product.name}
                {product.sale && <span className="ml-2 text-xs text-pink-500">Sale</span>}
            </h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>

            <span className={getStockBadgeClasses(product.stock)}>{inStock ? "In Stock" : "Out of Stock"}</span>
            <div className="mt-3">
                <button disabled={!inStock} className={getButtonClasses(inStock)}>{inStock ? "Add to Cart" : "Unavailable"}</button>
            </div>
        </div>
    );
}