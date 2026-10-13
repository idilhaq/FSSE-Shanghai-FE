'use client';

import { FormEvent, useState } from 'react';

type ProductBody = {
    name: string;
    price: string;
    stock: string;
    category: string;
};

type MockResponse = {
    ok: boolean;
    status: number;
    json: () => Promise<{ error?: string } | { id: number; name: string } | null>;
};

// Simulates POST http://localhost:5000/products on the Flask API.
// In the real app this is:
//   const res = await fetch(base + '/products', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ name, price: Number(price), stock: Number(stock), category }),
//   });
function mockPostProduct(body: ProductBody): Promise<MockResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!body.name || body.price === '' || body.stock === '' || !body.category) {
                resolve({ ok: false, status: 400, json: () => Promise.resolve({ error: 'All fields are required' }) });
            } else if (Number(body.price) === 99999) {
                resolve({ ok: false, status: 500, json: () => Promise.resolve(null) });
            } else {
                resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 101, name: body.name }) });
            }
        }, 500);
    });
}

export default function App() {
    const [name, setName] = useState('Laptop Stand');
    const [price, setPrice] = useState('250000');
    const [stock, setStock] = useState('10');
    const [category, setCategory] = useState('Accessories');
    const [formError, setFormError] = useState('');
    const [toast, setToast] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function resetForm() {
        setName(''); setPrice(''); setStock(''); setCategory('');
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError('');
        setSuccess('');
        setToast('');
        setSubmitting(true);

        const res = await mockPostProduct({ name, price, stock, category });

        if (res.status === 201) {
            resetForm();
            setSuccess('Product created successfully');
        } else if (res.status === 400) {
            const data = await res.json();
            setFormError((data && 'error' in data && data.error) || 'All fields are required');
        } else {
            setToast('Something went wrong. Please try again.');
        }

        setSubmitting(false);
    }

    const field = 'w-full border rounded px-3 py-2 mb-3';

    return (
        <main className="font-sans p-6 bg-gray-50 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/dashboard</p>
            <form onSubmit={handleSubmit} className="max-w-sm bg-white border rounded-lg p-5 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold">New product</h2>
                    <span className="text-gray-400">x</span>
                </div>

                <label className="text-sm">Name</label>
                <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
                <label className="text-sm">Price</label>
                <input className={field} value={price} onChange={(e) => setPrice(e.target.value)} />
                <label className="text-sm">Stock</label>
                <input className={field} value={stock} onChange={(e) => setStock(e.target.value)} />
                <label className="text-sm">Category</label>
                <input className={field} value={category} onChange={(e) => setCategory(e.target.value)} />

                <div className="flex gap-2 mt-2">
                    <button type="button" onClick={resetForm} className="px-4 py-2 border rounded">Cancel</button>
                    <button type="submit" disabled={submitting} className="px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50">
                        {submitting ? 'Saving…' : 'Add product'}
                    </button>
                </div>

                {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
                {success && <p className="mt-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2">&#10003; {success}</p>}
            </form>

            {toast && (
                <div className="fixed bottom-4 right-4 bg-red-600 text-white text-sm px-4 py-2 rounded shadow">
                    {toast}
                </div>
            )}
        </main>
    );
}