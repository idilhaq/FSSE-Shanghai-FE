'use client'

import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCards } from "./components/Product";
import { PageSection } from "./components/PageSection";
import { useState } from "react";
import { Navbar } from "./navbar";
import { Cart } from "./cart";
import { Shop } from "./shop";

const products = [
  { id: 1, name: "Laptop Stand", price: 250000 },
  { id: 2, name: "Keyboard", price: 450000 },
  { id: 3, name: "Mouse", price: 150000 },
  { id: 4, name: "Monitor", price: 1800000 },
];

export default function Home() {
  const [query, setQuery] = useState("")
  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <main className="p-8">
      <Header />
      {/* <PageSection title="Products" children={<ProductCards />} />
       */}
      {/* <Navbar /> */}
      {/* <Cart /> */}
      <Shop />
      <Footer />
    </main>
  );
}