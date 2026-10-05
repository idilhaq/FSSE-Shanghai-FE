'use client';

import { useState } from "react";

interface ProductFormData {
    name: string;
    price: number;
    stock: number;
    category: string;
}

export default function ProductForm() {
    // TODO 1: one typed state object for all four fields
    const [form, setForm] = useState<ProductFormData>({ name: "", price: 0, stock: 0, category: "" });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        // TODO 5: stop the page reload, then log the typed values
        event.preventDefault();
        console.log(form);
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 w-72 space-y-3 border border-gray-700 rounded-lg">
            <h3 className="font-bold">Add new product</h3>

            <div>
                <label className="block text-sm">Name</label>
                {/* TODO 2: controlled Name input */}
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                />
            </div>

            <div className="flex gap-2">
                <div>
                    <label className="block text-sm">Price</label>
                    {/* TODO 3: controlled Price input — Number(e.target.value) */}
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm">Stock</label>
                    {/* TODO 3: controlled Stock input — Number(e.target.value) */}
                    <input
                        type="number"
                        value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm">Category</label>
                {/* TODO 4: controlled <select> */}
                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                >
                    <option value="">Select category</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio</option>
                </select>
            </div>

            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white w-full">
                Add product
            </button>
        </form>
    );
}
