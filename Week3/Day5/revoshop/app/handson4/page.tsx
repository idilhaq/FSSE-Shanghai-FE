'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

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
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
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

// ===== Mock operations, each returning { ok, status, body } =====
const ok = <T,>(body: T) => Promise.resolve({ ok: true, status: 200, body });
const created = <T,>(body: T) => Promise.resolve({ ok: true, status: 201, body });
const fail = (error: string) => Promise.resolve({ ok: false, status: 400, body: { error } });

function Dashboard() {
    async function createProduct() {
        const res = await created({ id: 9, name: 'New Product' });
        // TODO 1: on a 2xx -> showSuccess('Product created successfully');
        if (res.ok) showSuccess('Product created successfully');
    }

    async function addToCart() {
        const res = await ok({ added: true });
        // TODO 1 (cont): on a 2xx -> showSuccess('Added to cart');
        if (res.ok) showSuccess('Added to cart');
    }

    async function deleteProduct() {
        const res = await fail('Failed to delete product');
        // TODO 2: on a 4xx -> showError(res.body.error);
        if (!res.ok) showError(res.body.error);
    }

    async function deleteCategory() {
        const res = await fail('Cannot delete category');
        // TODO 2 (cont): on a 4xx -> showError(res.body.error);
        if (!res.ok) showError(res.body.error);
    }

    const btn = 'px-3 py-2 rounded text-sm border border-gray-300 bg-white text-gray-800 hover:bg-gray-50';
    return (
        <main className="font-sans p-6 bg-gray-50 text-gray-900 min-h-screen">
            <h1 className="text-lg font-bold mb-4">Toast notifications — all operations</h1>
            <div className="flex flex-wrap gap-2">
                <button onClick={createProduct} className={btn}>Create product</button>
                <button onClick={addToCart} className={btn}>Add to cart</button>
                <button onClick={deleteProduct} className={btn}>Delete product (fails)</button>
                <button onClick={deleteCategory} className={btn}>Delete category (fails)</button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Click each button — toasts appear top-right and auto-dismiss.</p>
        </main>
    );
}

export default function App() {
    return (
        <ToastProvider>
            <Dashboard />
        </ToastProvider>
    );
}