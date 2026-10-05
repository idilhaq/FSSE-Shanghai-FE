import { useState } from "react";

// Real .tsx: interface Product { id; name; price; stock; category }
//            interface ProductFormData { name; price; stock; category }
//            interface ProductFormErrors { name?; price?; stock?; category? }

const INITIAL_PRODUCTS = [
    { id: 1, name: "Laptop Stand", price: 250000, stock: 8, category: "accessories" },
    { id: 2, name: "Mouse", price: 150000, stock: 12, category: "accessories" },
];

// 1) validate(data): FormErrors — a message per invalid field
function validate(data) {
    const errors = {};
    // TODO: name required, price > 0, stock >= 0, category selected
    return errors;
}

function ProductCard({ product, onAddToCart }) {
    return (
        <div className="border border-gray-700 rounded-lg p-4 w-48">
            <div className="bg-gray-800 h-20 flex items-center justify-center rounded mb-3">img</div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>
            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">In stock</span>
            {/* TODO 6: Add to cart button → onAddToCart(product) */}
            <button className="mt-3 px-3 py-2 rounded bg-blue-600 text-white w-full">Add to cart</button>
        </div>
    );
}

function AddProductForm({ onAddProduct }) {
    const [form, setForm] = useState({ name: "", price: 0, stock: 0, category: "" });
    // TODO 2: const errors = validate(form); const hasErrors = Object.keys(errors).length > 0;

    function handleSubmit(event) {
        event.preventDefault();
        // TODO 3: if (hasErrors) return;
        // TODO 4: onAddProduct(form); then reset the form
    }

    return (
        <form onSubmit={handleSubmit} className="w-64 space-y-3 border border-gray-700 rounded-lg p-4">
            <h3 className="font-bold">Add new product</h3>
            <div>
                <label className="block text-sm">Name</label>
                {/* TODO 1: controlled Name input + error below */}
                <input className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
            </div>
            <div className="flex gap-2">
                <div>
                    <label className="block text-sm">Price</label>
                    {/* TODO 1: controlled Price input (Number) + error */}
                    <input type="number" className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
                </div>
                <div>
                    <label className="block text-sm">Stock</label>
                    {/* TODO 1: controlled Stock input (Number) */}
                    <input type="number" className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
                </div>
            </div>
            <div>
                <label className="block text-sm">Category</label>
                {/* TODO 1: controlled <select> + error */}
                <select className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full">
                    <option value="">Select category</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio</option>
                </select>
            </div>
            {/* TODO 2: disabled={hasErrors} */}
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white w-full disabled:bg-gray-600 disabled:cursor-not-allowed">
                Add product
            </button>
        </form>
    );
}

function CartSummary({ cart }) {
    // TODO 7: derive count and total from cart
    return (
        <div className="border-t border-gray-700 pt-3 mt-4 text-sm w-full max-w-md">
            {/* TODO 7: Items in cart / Total qty / Total price (Rp toLocaleString) */}
        </div>
    );
}

export default function App() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [cart, setCart] = useState([]);
    const [query, setQuery] = useState("");

    // TODO 5: const visible = products.filter(name includes query, case-insensitive)
    const visible = products; // replace

    function addProduct(data) {
        // TODO 4: setProducts([...products, { id: Date.now(), ...data }])
    }
    function addToCart(product) {
        // TODO 6: setCart([...cart, product])
    }

    return (
        <main className="p-4">
            <h1 className="font-bold text-lg mb-3">RevoShop</h1>
            {/* TODO 5: controlled SearchBar bound to query / setQuery */}
            <div className="flex gap-6 items-start">
                <div className="flex gap-3 flex-wrap">
                    {/* TODO 5: visible.map((p) => <ProductCard key={p.id} product={p} onAddToCart={addToCart} />) */}
                </div>
                <AddProductForm onAddProduct={addProduct} />
            </div>
            <CartSummary cart={cart} />
        </main>
    );
}