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
import { Product, ProductCard } from "./day4/ProductCard";
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

const PRODUCTS = [
  { id: 1, name: "Laptop Stand", price: 250000, stock: 8, sale: false },
  { id: 2, name: "Keyboard", price: 450000, stock: 0, sale: false },
  { id: 3, name: "Mouse", price: 150000, stock: 12, sale: true },
];

export default function Day4() {
  // const [sale, setSale] = useState(false)
  const [query, setQuery] = useState("");

  const visible = PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
  return (
    // <main className="p-4 flex gap-4 flex-wrap">
    //   <button onClick={() => setSale(!sale)} >Click me for Sale</button>
    //   {products.filter((p) => p.sale === sale).map((p) =>
    //     < ProductCardAdv key={p.id} product={p} />
    //   )}
    // </main >
    <main className="p-4">
      <input
        className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
        placeholder="Search products..."
        onChange={(e) => setQuery(e.target.value)}
      />

      {visible.length === 0 ? (
        <p className="text-gray-400">No products match "{query}".</p>
      ) : (
        <div className="flex gap-4 flex-wrap">
          {visible.map((p) => <ProductCardNavbar key={p.id} product={p} />)}
        </div>
      )}
    </main>
  )
}