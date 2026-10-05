import { useState } from "react";

// Real .tsx: interface ProductFormErrors { name?: string; price?: string; stock?: string; category?: string }
function validate(data) {
    const errors = {};
    // TODO 1: add a message per invalid field
    // if (!data.name.trim()) errors.name = "Name is required";
    // if (data.price <= 0) errors.price = "Price must be positive";
    // if (data.stock < 0) errors.stock = "Stock cannot be negative";
    // if (!data.category) errors.category = "Please select a category";
    return errors;
}

export default function ProductForm() {
    const [form, setForm] = useState({ name: "", price: 0, stock: 0, category: "" });

    // TODO 2: const errors = validate(form);
    const errors = {};
    // TODO 4: const hasErrors = Object.keys(errors).length > 0;
    const hasErrors = false;

    function handleSubmit(event) {
        event.preventDefault();
        // TODO 5: if (hasErrors) return;
        console.log("Valid product:", form);
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 w-72 space-y-3 border border-gray-700 rounded-lg">
            <h3 className="font-bold">Add new product</h3>

            <div>
                <label className="block text-sm">Name</label>
                <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                />
                {/* TODO 3: {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>} */}
            </div>

            <div className="flex gap-2">
                <div>
                    <label className="block text-sm">Price</label>
                    <input
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                    />
                    {/* TODO 3: price error */}
                </div>
                <div>
                    <label className="block text-sm">Stock</label>
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
                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border border-gray-600 bg-gray-800 rounded px-2 py-1 w-full"
                >
                    <option value="">Select category</option>
                    <option value="accessories">Accessories</option>
                    <option value="audio">Audio</option>
                </select>
                {/* TODO 3: category error */}
            </div>

            {/* TODO 4: disabled={hasErrors} + a muted look when disabled */}
            <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white w-full disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                Add product
            </button>
        </form>
    );
}