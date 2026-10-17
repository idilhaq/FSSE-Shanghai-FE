'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ===== Types =====
interface Product {
    id: number;
    name: string;
    price: number;
}

interface ApiResponse<T> {
    ok: boolean;
    status: number;
    body: T;
}

// ===== Types =====
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    toasts: Toast[];
}

// ===== Simulated react-hot-toast: a Toaster + a toast() API =====
const ToastContext = createContext<ToastContextValue>({ toasts: [] });
let pushToast: (type: ToastType, message: string) => void = () => { };

function ToastViewport() {
    const { toasts } = useContext(ToastContext);
    return (
        <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={
                        'px-3 py-2 rounded shadow text-sm border ' +
                        (t.type === 'success'
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'bg-red-50 border-red-300 text-red-700')
                    }
                >{t.type === 'success' ? '\u2713 ' : '\u2717 '}{t.message}</div>
            ))}
        </div>
    );
}

function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    pushToast = useCallback((type: ToastType, message: string) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
    }, []);
    return (
        <ToastContext.Provider value={{ toasts }}>
            {children}
            <ToastViewport />
        </ToastContext.Provider>
    );
}

// ===== lib/toast.ts equivalent — the helper you would import everywhere =====
const showSuccess = (msg: string) => pushToast('success', msg);
const showError = (msg: string) => pushToast('error', msg);

const rp = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
let nextId = 3;

// ===== Mock Flask endpoints — each returns { ok, status, body } =====
function mockCreate(data: { name: string; price: number }): Promise<ApiResponse<Product | { error: string }>> {
    return new Promise((resolve) => setTimeout(() => {
        if (!data.name.trim()) return resolve({ ok: false, status: 400, body: { error: 'Name is required' } });
        resolve({ ok: true, status: 201, body: { id: nextId++, ...data } });
    }, 300));
}
function mockUpdate(id: number, data: { name: string, price: number }): Promise<ApiResponse<Product>> {
    return new Promise((resolve) => setTimeout(() => {
        resolve({ ok: true, status: 200, body: { id, ...data } });
    }, 300));
}
function mockDelete(id: number): Promise<ApiResponse<Record<string, never> | { error: string }>> {
    return new Promise((resolve) => setTimeout(() => {
        // Product #2 ("Mouse") has active orders -> backend blocks the delete.
        if (id === 2) return resolve({ ok: false, status: 400, body: { error: 'Cannot delete — product has active orders' } });
        resolve({ ok: true, status: 200, body: {} });
    }, 300));
}

function DashboardPage() {
    const [products, setProducts] = useState<Product[]>([
        { id: 1, name: 'Laptop Stand', price: 250000 },
        { id: 2, name: 'Mouse', price: 150000 },
    ]);
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [formError, setFormError] = useState('');
    const [confirmId, setConfirmId] = useState<number | null>(null);  // which row is asking "Are you sure?"
    const [rowError, setRowError] = useState('');       // a failed DELETE message

    async function handleCreate() {
        setFormError('');
        const res = await mockCreate({ name, price: Number(price) });
        // TODO 1: on 201 -> setProducts([...products, res.body]); setShowCreate(false); setName(''); setPrice('');
        //         on 400 -> setFormError(res.body.error);
        if (res.status === 201) {
            setProducts([...products, res.body as Product]);
            setShowCreate(false);
            setName('');
            setPrice('');
            showSuccess('Product created successfully')
        } else {
            setFormError((res.body as { error: string }).error);
            showError('Failed to create the product')
        }
    }

    async function handleUpdate(id: number, newName: string, price: number) {
        const res = await mockUpdate(id, { name: newName, price });
        // TODO 2: on 200 -> setProducts(products.map((p) => p.id === id ? res.body : p));
        if (res.status === 200) {
            setProducts(products.map((p) => p.id === id ? res.body : p));
        }
    }

    async function handleDelete(id: number) {
        setRowError('');
        setConfirmId(null);
        setProducts(products.filter((p) => p.id !== id));
        const res = await mockDelete(id);
        // TODO 3: on res.ok -> setProducts(products.filter((p) => p.id !== id)); setConfirmId(null);
        //         on 400   -> setRowError(res.body.error);
        if (!res.ok) {
            setProducts(products)
            setRowError((res.body as { error: string }).error);
            showError('Cannot delete the product you selected')
        } else {
            showSuccess('Product Deleted Successfully')
        }
    }

    return (
        <main className="font-sans p-6 bg-gray-50 text-gray-900 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/dashboard</p>

            <div className="flex items-center gap-3 mb-4">
                <h1 className="text-xl font-semibold mr-auto">Products</h1>
                <button onClick={() => setShowCreate((s) => !s)} className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm">+ New product</button>
            </div>

            {showCreate && (
                <div className="border border-gray-200 rounded-lg p-4 bg-white text-gray-900 mb-4 max-w-sm">
                    <p className="font-medium mb-2">New product</p>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-white text-gray-900 placeholder-gray-400" />
                    <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" className="w-full border border-gray-300 rounded px-3 py-2 mb-2 bg-white text-gray-900 placeholder-gray-400" />
                    {formError && <p className="text-sm text-red-600 mb-2">{formError}</p>}
                    <button onClick={handleCreate} className="px-3 py-1.5 bg-gray-900 text-white rounded text-sm">Create</button>
                </div>
            )}

            <table className="w-full text-sm bg-white text-gray-900 border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-left text-gray-700">
                    <tr><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Actions</th></tr>
                </thead>
                <tbody>
                    {products.map((p) => (
                        <tr key={p.id} className="border-t border-gray-200 align-top">
                            <td className="p-3 font-medium">{p.name}</td>
                            <td className="p-3">{rp(p.price)}</td>
                            <td className="p-3">
                                <div className="flex gap-2">
                                    <button onClick={() => handleUpdate(p.id, p.name + ' (edited)', p.price)} className="px-2 py-1 border border-gray-300 bg-white text-gray-700 rounded">Edit</button>
                                    <button onClick={() => { setConfirmId(p.id); setRowError(''); }} className="px-2 py-1 border border-gray-300 bg-white rounded text-red-600">Del</button>
                                </div>
                                {confirmId === p.id && (
                                    <div className="mt-2 border border-amber-300 bg-amber-50 rounded p-2">
                                        <p className="text-amber-800 mb-2">&#9888; Delete &quot;{p.name}&quot;? This cannot be undone.</p>
                                        <div className="flex gap-2">
                                            <button onClick={() => setConfirmId(null)} className="px-2 py-1 border border-amber-300 bg-white text-gray-700 rounded">Cancel</button>
                                            <button onClick={() => handleDelete(p.id)} className="px-2 py-1 bg-red-600 text-white rounded">Yes, delete</button>
                                        </div>
                                        {rowError && <p className="text-sm text-red-600 mt-2">{rowError}</p>}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
}

export default function App() {
    return (
        <ToastProvider>
            <DashboardPage />
        </ToastProvider>
    )
}