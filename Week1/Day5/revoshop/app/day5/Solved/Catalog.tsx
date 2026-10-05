'use client';

import { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
}

interface ProductFormData {
    name: string;
    price: number;
    stock: number;
    category: string;
}

interface ProductFormErrors {
    name?: string;
    price?: string;
    stock?: string;
    category?: string;
}

const INITIAL_PRODUCTS: Product[] = [
    { id: 1, name: "Laptop Stand", price: 250000, stock: 8, category: "accessories" },
    { id: 2, name: "Mouse", price: 150000, stock: 12, category: "accessories" },
];

// 1) validate(data): FormErrors — a message per invalid field
function validate(data: ProductFormData): ProductFormErrors {
    const errors: ProductFormErrors = {};
    if (!data.name.trim()) errors.name = "Name is required";
    if (!(data.price > 0)) errors.price = "Price must be greater than 0";
    if (data.stock < 0) errors.stock = "Stock cannot be negative";
    if (!data.category) errors.category = "Please select a category";
    return errors;
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
    const inStock = product.stock > 0;

    return (
        <div className="border border-gray-700 rounded-lg p-4 w-48">
            <div className="bg-gray-800 h-20 flex items-center justify-center rounded mb-3">img</div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>
            {inStock ? (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">In stock</span>
            ) : (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">Out of stock</span>
            )}
            {/* TODO 6: Add to cart button → onAddToCart(product) */}
            <button
                onClick={() => onAddToCart(product)}
                disabled={!inStock}
                className="mt-3 px-3 py-2 rounded bg-blue-600 text-white w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                {inStock ? "Add to cart" : "Unavailable"}
            </button>
        </div>
    );
}

function AddProductForm({ onAddProduct }: { onAddProduct: (data: ProductFormData) => void }) {
    const [form, setForm] = useState<ProductFormData>({ name: "", price: 0, stock: 0, category: "" });
    // TODO 2: const errors = validate(form); const hasErrors = Object.keys(errors).length > 0;
    const errors = validate(form);
    const hasErrors = Object.keys(errors).length > 0;

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // TODO 3: if (hasErrors) return;
        if (hasErrors) return;
        // TODO 4: onAddProduct(form); then reset the form
        onAddProduct(form);
        setForm({ name: "", price: 0, stock: 0, category: "" });
    }

    return (
        <form onSubmit={handleSubmit} className="w-64 space-y-3 border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold">Add new product</h3>
            <div>
                <label className="block text-sm">Name</label>
                {/* TODO 1: controlled Name input + error below */}
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="flex gap-2">
                <div>
                    <label className="block text-sm">Price</label>
                    {/* TODO 1: controlled Price input (Number) + error */}
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                </div>
                <div>
                    <label className="block text-sm">Stock</label>
                    {/* TODO 1: controlled Stock input (Number) */}
                    <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                    />
                    {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
                </div>
            </div>
            <div>
                <label className="block text-sm">Category</label>
                {/* TODO 1: controlled <select> + error */}
                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                >
                    <option value="">Select category</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
            </div>
            {/* TODO 2: disabled={hasErrors} */}
            <button
                type="submit"
                disabled={hasErrors}
                className="px-4 py-2 rounded bg-blue-600 text-white w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Add product
            </button>
        </form>
    );
}

function CartSummary({ cart }: { cart: Product[] }) {
    // TODO 7: derive count and total from cart
    const count = cart.length;
    const totalQty = count; // one unit added per click
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className="border-t border-gray-700 pt-3 mt-4 text-sm w-full max-w-md">
            {/* TODO 7: Items in cart / Total qty / Total price (Rp toLocaleString) */}
            <p>Items in cart: {count}</p>
            <p>Total qty: {totalQty}</p>
            <p>Total price: Rp {totalPrice.toLocaleString("id-ID")}</p>
        </div>
    );
}

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
    const [cart, setCart] = useState<Product[]>([]);
    const [query, setQuery] = useState("");

    // TODO 5: const visible = products.filter(name includes query, case-insensitive)
    const visible = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    function addProduct(data: ProductFormData) {
        // TODO 4: setProducts([...products, { id: Date.now(), ...data }])
        setProducts([...products, { id: Date.now(), ...data }]);
    }
    function addToCart(product: Product) {
        // TODO 6: setCart([...cart, product])
        setCart([...cart, product]);
    }

    return (
        <main className="p-4">
            <h1 className="font-bold text-lg mb-3">RevoShop</h1>
            {/* TODO 5: controlled SearchBar bound to query / setQuery */}
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full max-w-md bg-gray-800 border border-gray-700 rounded px-3 py-2 mb-4"
            />
            <div className="flex gap-6 items-start">
                <div className="flex gap-3 flex-wrap">
                    {/* TODO 5: visible.map((p) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />) */}
                    {visible.length === 0 ? (
                        <p className="text-gray-400">No products match &quot;{query}&quot;.</p>
                    ) : (
                        visible.map((p) => (
                            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                        ))
                    )}
                </div>
                <AddProductForm onAddProduct={addProduct} />
            </div>
            <CartSummary cart={cart} />
        </main>
    );
}