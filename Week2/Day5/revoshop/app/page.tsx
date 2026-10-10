'use client'

import { useState, useEffect } from 'react';

export interface Order {
  id: number;
  userId: number;
  itemCount: number;
  status: string;
}

export interface Category {
  id: number;
  name: string;
  productCount: number;
}

// ── Simulated backend ──────────────────────────────────────────────────────
function fetchCategories(): Promise<Category[]> {
  const DATA: Category[] = [
    { id: 1, name: 'Electronics', productCount: 12 },
    { id: 2, name: 'Accessories', productCount: 8 },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(DATA), 300));
}
function fetchOrders(): Promise<Order[]> {
  const DATA: Order[] = [
    { id: 1, userId: 3, itemCount: 2, status: 'Placed' },
    { id: 2, userId: 1, itemCount: 1, status: 'Placed' },
  ];
  return new Promise((resolve) => setTimeout(() => resolve(DATA), 300));
}

// Shared header (lives in app/layout.tsx). Active link uses usePathname() on
// the real app; here we pass the current page in as a prop.
function Header({ page, cartCount }: { page: string, cartCount: number }) {
  const link = (name: string, key: string) =>
    page === key
      ? 'font-semibold underline'        // active route
      : 'text-gray-500';                 // inactive
  return (
    <nav className="flex items-center gap-4 text-sm mb-5 border-b pb-3">
      <span className="font-bold text-base">RevoShop</span>
      {/* TODO: highlight the active link using the link() helper */}
      <span className={link('home', 'home')}>Home</span>
      <span className={link('categories', 'categories')}>Categories</span>
      <span className={link('orders', 'orders')}>Orders</span>
      <span className="ml-auto px-2 py-1 rounded-full bg-red-500 text-white text-xs">Cart {cartCount}</span>
    </nav>
  );
}

// TODO 1: CategoriesPage — a Server Component (no "use client").
//   Fetch categories, then render each name + "<n> products".
function CategoriesPage() {
  const [categories, setCategories] = useState<Category[] | null>(null); // null = still loading
  useEffect(() => { fetchCategories().then(setCategories); }, []);

  // loading.tsx layer:
  if (!categories) return <p className="text-indigo-600">Loading categories…</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-3">Categories</h1>
      <div className="grid grid-cols-2 gap-4 max-w-lg">
        {/* TODO 1: render a card per category: name + "<productCount> products" */}
        {categories.length > 0 && categories.map((category) => (
          <div key={category.id} className="rounded border p-4">
            <p className="font-semibold">{category.name}</p>
            <p className="text-sm text-gray-500">{category.productCount} products</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">+ loading.tsx + error.tsx</p>
    </section>
  );
}

// TODO 2: OrdersPage — a Server Component (no "use client").
//   Fetch orders, then render Order #id, User #userId, item count, status badge.
function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  useEffect(() => { fetchOrders().then(setOrders); }, []);

  if (!orders) return <p className="text-indigo-600">Loading orders…</p>;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-3">Orders</h1>
      {/* TODO 2: render a row per order with the status badge */}
      {orders.map((order) => (
        <div key={order.id} className="flex items-center gap-3 rounded border p-3 text-sm">
          <span className="font-semibold">Order #{order.id}</span>
          <span className="text-gray-500">User #{order.userId}</span>
          <span className="text-gray-500">{order.itemCount} items</span>
          <span className="ml-auto px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">{order.status}</span>
          <Reorder order={order} />
        </div>
      ))}
      <p className="text-xs text-gray-400 mt-3">+ loading.tsx + error.tsx</p>
    </section>
  );
}

// use client
function Reorder({ order }: { order: Order }) {
  return (
    <button>reorder</button>
  )
}

export default function App() {
  const [page, setPage] = useState('categories'); // tiny router
  const cartCount = 2;

  return (
    <main className="font-sans p-6">
      {/* page switcher (stands in for navigation between routes) */}
      <div className="flex gap-2 mb-4">
        {['categories', 'orders'].map((p) => (
          <button key={p} onClick={() => setPage(p)}
            className={p === page ? 'px-3 py-1 rounded bg-indigo-600 text-white text-sm' : 'px-3 py-1 rounded border text-sm'}>
            /{p}
          </button>
        ))}
      </div>

      <Header page={page} cartCount={cartCount} />

      {page === 'categories' && <CategoriesPage />}
      {page === 'orders' && <OrdersPage />}
    </main>
  );
}