'use client'

import { useState, useEffect } from 'react';

// ===== Types =====
interface Category {
    id: number;
    name: string;
    productCount: number;
}

interface ApiResponse<T> {
    ok: boolean;
    status: number;
    body: T;
}

let nextId = 3;

// ===== Mock Flask /categories endpoints — each returns { ok, status, body } =====
function mockGet(): Promise<Category[]> {
    return new Promise((resolve) => setTimeout(() => resolve([
        { id: 1, name: 'Electronics', productCount: 12 },
        { id: 2, name: 'Accessories', productCount: 8 },
    ]), 300));
}
function mockCreate(name: string): Promise<ApiResponse<Category | { error: string }>> {
    return new Promise((resolve) => setTimeout(() => {
        if (!name.trim()) return resolve({ ok: false, status: 400, body: { error: 'Name is required' } });
        resolve({ ok: true, status: 201, body: { id: nextId++, name, productCount: 0 } });
    }, 300));
}
function mockUpdate(id: number, name: string): Promise<ApiResponse<Category>> {
    return new Promise((resolve) => setTimeout(() => resolve({ ok: true, status: 200, body: { id, name, productCount: 0 } }), 300));
}
function mockDelete(id: number): Promise<ApiResponse<Record<string, never> | { error: string }>> {
    return new Promise((resolve) => setTimeout(() => {
        // Category #2 ("Accessories") still has linked products -> blocked.
        if (id === 2) return resolve({ ok: false, status: 400, body: { error: 'Cannot delete — category has linked products' } });
        resolve({ ok: true, status: 200, body: {} });
    }, 300));
}

// Pretend this page is wrapped: <AdminRoute><CategoriesPage /></AdminRoute>
export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newName, setNewName] = useState('');
    const [confirmId, setConfirmId] = useState<number | null>(null);
    const [rowError, setRowError] = useState('');

    // TODO 1: fetch GET /categories on mount.
    useEffect(() => {
        mockGet().then((data) => { setCategories(data); setLoading(false); });
    }, []);

    async function handleCreate() {
        const res = await mockCreate(newName);
        // TODO 2: on 201 -> setCategories([...categories, res.body]); setShowCreate(false); setNewName('');
        if (res.status === 201) {
            setCategories([...categories, res.body as Category]);
            setShowCreate(false);
            setNewName('');
        }
    }

    async function handleRename(id: number) {
        const res = await mockUpdate(id, prompt('New name?') || 'Renamed');
        // TODO 3: on 200 -> setCategories(categories.map((c) => c.id === id ? res.body : c));
        if (res.status === 200) {
            setCategories(categories.map((c) => c.id === id ? res.body : c));
        }
    }

    async function handleDelete(id: number) {
        setRowError('');
        const res = await mockDelete(id);
        // TODO 4: on res.ok -> setCategories(categories.filter((c) => c.id !== id)); setConfirmId(null);
        //         on 400   -> setRowError(res.body.error);
        if (res.ok) {
            setCategories(categories.filter((c) => c.id !== id));
            setConfirmId(null);
        } else {
            setRowError((res.body as { error: string }).error);
        }
    }

    return (
        <main className="font-sans p-6 bg-gray-50 text-gray-900 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/dashboard/categories</p>

            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-semibold mr-auto">Categories</h1>
                <button onClick={() => setShowCreate((s) => !s)} className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm">+ New category</button>
            </div>

            {showCreate && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white text-gray-900 mb-4 max-w-sm">
                    <p className="font-medium mb-2">New category</p>
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name" className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-white text-gray-900 placeholder-gray-400" />
                    <button onClick={handleCreate} className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm">Create</button>
                </div>
            )}

            {loading ? (
                <p className="text-sm text-gray-500">Loading categories…</p>
            ) : (
                <table className="w-full text-sm bg-white text-gray-900 border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-left text-gray-700">
                        <tr><th className="p-3">Name</th><th className="p-3">Products</th><th className="p-3">Actions</th></tr>
                    </thead>
                    <tbody>
                        {categories.map((c) => (
                            <tr key={c.id} className="border-t border-gray-200 align-top">
                                <td className="p-3 font-medium">{c.name}</td>
                                <td className="p-3">{c.productCount}</td>
                                <td className="p-3">
                                    <div className="flex gap-2">
                                        <button onClick={() => handleRename(c.id)} className="px-2 py-1 border border-gray-300 bg-white text-gray-700 rounded">Edit</button>
                                        <button onClick={() => { setConfirmId(c.id); setRowError(''); }} className="px-2 py-1 border border-gray-300 bg-white rounded text-red-600">Del</button>
                                    </div>
                                    {confirmId === c.id && (
                                        <div className="mt-2 border border-amber-300 bg-amber-50 rounded p-2">
                                            <p className="text-amber-800 mb-2">&#9888; Delete &quot;{c.name}&quot;?</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => setConfirmId(null)} className="px-2 py-1 border border-amber-300 bg-white text-gray-700 rounded">Cancel</button>
                                                <button onClick={() => handleDelete(c.id)} className="px-2 py-1 bg-red-600 text-white rounded">Yes, delete</button>
                                            </div>
                                            {rowError && <p className="text-sm text-red-600 mt-2">{rowError}</p>}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}