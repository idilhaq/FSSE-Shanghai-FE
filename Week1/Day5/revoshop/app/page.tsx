'use client'

import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCards } from "./components/Product";
import { PageSection } from "./components/PageSection";
import { useState } from "react";
import { Navbar } from "./day3/navbar";
import { Cart } from "./day3/cart";
import { Shop } from "./day3/shop";
// import { Product, ProductCard } from "./day4/ProductCard";
import { ProductCardAdv } from "./day4/ProductCardAdv";
import { ProductCardNavbar } from "./day4/ProductCardNavbar";


// const products = [
//   { id: 1, name: "Laptop Stand", price: 250000 },
//   { id: 2, name: "Keyboard", price: 450000 },
//   { id: 3, name: "Mouse", price: 150000 },
//   { id: 4, name: "Monitor", price: 1800000 },
// ];

// export default function Day3() {
//   const [query, setQuery] = useState("")
//   const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

//   return (
//     <main className="p-8">
//       <Header />
//       {/* <PageSection title="Products" children={<ProductCards />} />
//        */}
//       {/* <Navbar /> */}
//       {/* <Cart /> */}
//       {/* <Shop /> */}
//       <Footer />
//     </main>
//   );
// }


// const products: Product[] = [
//   { id: 1, name: "Laptop Stand", price: 250000, stock: 8, sale: true },
//   { id: 2, name: "Laptop Stand 2", price: 250000, stock: 8, sale: true },
//   { id: 3, name: "Keyboard", price: 450000, stock: 0, sale: false },
//   { id: 4, name: "Keyboard 2", price: 250000, stock: 8, sale: true },
//   { id: 5, name: "Keyboard 3", price: 450000, stock: 0, sale: false },
// ];

// const PRODUCTS = [
//   { id: 1, name: "Laptop Stand", price: 250000, stock: 8, sale: false },
//   { id: 2, name: "Keyboard", price: 450000, stock: 0, sale: false },
//   { id: 3, name: "Mouse", price: 150000, stock: 12, sale: true },
// ];

// export default function Day4() {
//   // const [sale, setSale] = useState(false)
//   const [query, setQuery] = useState("");

//   const visible = PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
//   return (
//     // <main className="p-4 flex gap-4 flex-wrap">
//     //   <button onClick={() => setSale(!sale)} >Click me for Sale</button>
//     //   {products.filter((p) => p.sale === sale).map((p) =>
//     //     < ProductCardAdv key={p.id} product={p} />
//     //   )}
//     // </main >
//     <main className="p-4">
//       <input
//         className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
//         placeholder="Search products..."
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       {visible.length === 0 ? (
//         <p className="text-gray-400">No products match "{query}".</p>
//       ) : (
//         <div className="flex gap-4 flex-wrap">
//           {visible.map((p) => <ProductCardNavbar key={p.id} product={p} />)}
//         </div>
//       )}
//     </main>
//   )
// }

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Real .tsx: interface ProductFormData { name: string; price: number; stock: number; category: string }
interface ProductFormData {
  name: string;
  price: number;
  stock: number;
  category: string;
}

// Real .tsx: interface ProductFormErrors { name?: string; price?: string; stock?: string; category?: string }
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

function validate(data: ProductFormData): ProductFormErrors {
  const errors: ProductFormErrors = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (data.price <= 0) errors.price = "Price must be positive";
  if (data.stock < 0) errors.stock = "Stock cannot be negative";
  if (!data.category) errors.category = "Please select a category";
  return errors;
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 w-48">
      <div className="bg-gray-800 h-20 flex items-center justify-center rounded mb-3">img</div>
      <h3 className="font-bold">{product.name}</h3>
      <p className="mb-2">Rp {product.price.toLocaleString("id-ID")}</p>
      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">In stock</span>
      {/* TODO 6: Add to cart button → onAddToCart(product) */}
      <button
        className="mt-3 px-3 py-2 rounded bg-blue-600 text-white w-full"
        onClick={() => onAddToCart(product)}>Add to cart</button>
    </div>
  );
}

function AddProductForm({ onAddProduct }: { onAddProduct: (product: ProductFormData) => void }) {
  const [form, setForm] = useState<ProductFormData>({ name: "", price: 0, stock: 0, category: "" });
  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (hasErrors) return;
    onAddProduct(form);
    setForm({ name: "", price: 0, stock: 0, category: "" })
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 w-72 space-y-3 border border-gray-700 rounded-lg">
      <h3 className="font-bold">Add new product</h3>

      <div>
        <label className="block text-sm">Name</label>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      <div className="flex gap-2">
        <div>
          <label className="block text-sm">Price</label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
          {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-sm">Stock</label>
          <input
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full" />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm">Category</label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full">
          <option value="">Select category</option>
          <option value="accessories">Accessories</option>
          <option value="audio">Audio</option>
        </select>
        {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
      </div>
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

export default function Day5() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<Product[]>([]);
  const [query, setQuery] = useState("");

  const visible = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  function addProduct(data: ProductFormData) {
    setProducts([...products, { id: Date.now(), ...data }])
  }

  function addToCart(product: Product) {
    setCart([...cart, product])
  }

  return (
    <main className="p-4">
      <h1 className="font-bold text-lg mb-3">RevoShop</h1>
      <input
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
        placeholder="Search products..."
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="flex gap-6 items-start">
        <div className="flex gap-3 flex-wrap">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />)
          )}
        </div>
        <AddProductForm onAddProduct={addProduct} />
      </div>
      <CartSummary cart={cart} />
    </main>
  )
}