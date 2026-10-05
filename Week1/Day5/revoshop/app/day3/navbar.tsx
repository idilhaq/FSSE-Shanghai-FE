'use client'

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState } from "react";

const products = [
    { id: 1, name: "Laptop Stand", price: 250000 },
    { id: 2, name: "Keyboard", price: 450000 },
    { id: 3, name: "Mouse", price: 150000 },
    { id: 4, name: "Monitor", price: 1800000 },
];

export function Navbar() {
    const [query, setQuery] = useState("")
    const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <>
            <input
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2"
                placeholder="Search products..."
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex gap-4 flex-wrap">
                {filtered.map((p) => (
                    <div key={p.id} className="border border-gray-700 rounded-lg p-4 w-44">
                        <h3 className="font-bold">{p.name}</h3>
                        <p>Rp {p.price.toLocaleString("id-ID")}</p>
                    </div>
                ))}
            </div>
        </>
    );
}