'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  category: string;
}

interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<Product[] | null>;
}

// Simulates fetch(): ok=false + status 500 when the server "fails".
function mockFetch(shouldFail: boolean): Promise<MockResponse> {
  return new Promise((resolve) =>
    setTimeout(() => {
      if (shouldFail) {
        resolve({ ok: false, status: 500, json: () => Promise.resolve(null) });
      } else {
        resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve([
              { id: 42, name: 'Laptop Stand', price: 250000, inStock: true, category: 'Accessories' },
              { id: 7, name: 'Keyboard', price: 450000, inStock: false, category: 'Accessories' },
              { id: 9, name: 'USB-C Hub', price: 320000, inStock: true, category: 'Accessories' },
            ]),
        });
      }
    }, 600)
  );
}

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

// ── LAYER 1: fetch + res.ok guard ──────────────────────────────────────────
async function getProducts(shouldFail: boolean): Promise<Product[]> {
  const res = await mockFetch(shouldFail);
  // TODO 1: if (!res.ok) throw a typed Error whose message includes res.status
  if (!res.ok) {
    throw new Error(`Failed to load products (status ${res.status})`);
  }
  const data = await res.json();
  return data ?? [];
}

// A reusable ProductCard (your grid renders one per product)
function ProductCard({ product }: { product: Product }) {
  // TODO 4: render img placeholder, name, formatPrice(product.price),
  //         and an In stock / Out of stock badge
  return (
    <div className="border rounded-lg p-4">
      <div className="bg-gray-100 h-24 flex items-center justify-center text-gray-400 rounded mb-3">
        img
      </div>
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-gray-600">{formatPrice(product.price)}</p>
      {product.inStock ? (
        <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
          In stock
        </span>
      ) : (
        <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-red-100 text-red-700">
          Out of stock
        </span>
      )}
    </div>
  );
}

export default function App() {
  const [shouldFail, setShouldFail] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');

  function load() {
    setStatus('loading');
    getProducts(shouldFail)
      .then((data) => {
        setProducts(data);
        setStatus('success');
      })
      .catch((err: Error) => {
        setMessage(err.message);
        setStatus('error');
      });
  }
  useEffect(load, [shouldFail]);

  return (
    <main className="font-sans p-6">
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(e) => setShouldFail(e.target.checked)}
        />
        Simulate server failure (500)
      </label>
      <p className="text-sm text-gray-500 mb-3">RevoShop &rsaquo; Products</p>

      {/* TODO 2: when status === 'loading', render a skeleton grid (loading.tsx) */}
      {status === 'loading' && (
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-40 bg-red-200 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* TODO 3: when status === 'error', render the friendly error UI + Try again (error.tsx) */}
      {status === 'error' && (
        <div className="border border-red-200 bg-red-50 rounded-lg p-6 text-center">
          <p className="font-semibold text-red-700">Something went wrong</p>
          <p className="text-sm text-red-600 mt-1">
            {message || 'Unable to load products. Please try again.'}
          </p>
          <button
            onClick={load}
            className="mt-3 px-4 py-2 bg-gray-800 text-white rounded"
          >
            Try again
          </button>
        </div>
      )}

      {/* TODO 5: when status === 'success', render the ProductCard grid */}
      {status === 'success' && (
        <div className="grid grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
