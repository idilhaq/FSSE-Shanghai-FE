'use client'

import { useState } from 'react';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type OrderBody = {
  items: CartItem[];
  total: number;
};

type MockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<{ id: number }>;
};

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthed = true;
  if (!isAuthed) return <p className="p-6">Redirecting to /login…</p>;
  return <>{children}</>;
}

function useCart() {
  const items = [
    { id: 1, name: 'Laptop Stand', price: 250000, quantity: 1 },
    { id: 2, name: 'Mouse', price: 150000, quantity: 2 },
  ];
  const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  return { items, total };
}

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// Simulates POST http://localhost:5000/orders. Real call:
//   await fetch(base + '/orders', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ items, total }),
//   });
function mockPostOrder(body: OrderBody): Promise<MockResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ok: true, status: 201, json: () => Promise.resolve({ id: 5001 }) });
    }, 500);
  });
}

function CheckoutPage() {
  const { items, total } = useCart();
  const [placed, setPlaced] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleConfirm() {
    setSubmitting(true);
    const res = await mockPostOrder({ items, total });
    if (res.status === 201) setPlaced(true);
    console.log(res.json())
    setSubmitting(false);
  }

  return (
    <main className="font-sans p-6 max-w-xl">
      <header className="flex items-center gap-4 border-b pb-3 mb-4">
        <span className="font-bold text-lg">RevoShop</span>
        <span className="text-gray-500 text-sm">Products</span>
        <span className="text-gray-500 text-sm">John</span>
      </header>

      <h1 className="text-xl font-semibold mb-3">Order summary</h1>

      <div className="border rounded-lg p-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-1">
            <span>{item.name} &times; {item.quantity}</span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>)
        )}

        <div className="flex justify-between border-t mt-2 pt-2 font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={submitting || placed}
        className="w-full mt-4 px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50"
      >
        {submitting ? 'Placing order…' : 'Confirm Order'}
      </button>

      {placed && (
        <p className="mt-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2">
          &#10003; Order placed! Redirecting to /orders...
        </p>
      )}
    </main>
  );
}

export default function App() {
  return (
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  );
}