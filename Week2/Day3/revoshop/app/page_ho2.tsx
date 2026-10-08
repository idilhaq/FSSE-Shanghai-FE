'use client'

import { useState } from 'react';

// app/layout.tsx — base metadata for the whole site
const ROOT_METADATA = {
  title: 'RevoShop',
  description: 'Your one-stop online store.',
};

// Each page.tsx exports its own metadata object, overriding the root for that route.
const PAGES = [
  {
    path: '/',
    metadata: { title: 'Home — RevoShop', description: 'Welcome to RevoShop, your one-stop online store.' },
  },
  {
    path: '/products',
    metadata: { title: 'Products — RevoShop', description: 'Browse all RevoShop products.' },
  },
  {
    path: '/products/42',
    metadata: { title: 'Product #42 — RevoShop', description: 'Details for product #42.' },
  },
  {
    path: '/categories',
    metadata: { title: 'Categories — RevoShop', description: 'Shop RevoShop products by category.' },
  },
  // TODO Step 3: add the Orders page metadata
  {
    path: '/orders',
    metadata: { title: 'Orders - Revoshop', description: 'This is and order pager for revoshop' },
  },
];

export default function App() {
  const [path, setPath] = useState('/');
  const page = PAGES.find((p) => p.path === path);
  const meta = page ? page.metadata : ROOT_METADATA;

  return (
    <div className="font-sans flex gap-4 p-4 text-sm">
      <nav className="w-40 shrink-0 border-r pr-3">
        <p className="text-xs uppercase text-gray-400 mb-2">Pages</p>
        {PAGES.map((p) => (
          <button
            key={p.path}
            onClick={() => setPath(p.path)}
            className={p.path === path
              ? 'block w-full text-left font-semibold text-indigo-600 py-1'
              : 'block w-full text-left text-gray-600 hover:text-black py-1'}
          >
            {p.path}
          </button>
        ))}
      </nav>

      <div className="flex-1">
        {/* Simulated browser tab */}
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-t-lg px-3 py-1.5 border">
          <span className="w-3 h-3 rounded-full bg-gray-300" />
          <span className="font-medium">{meta.title}</span>
        </div>

        {/* Simulated DevTools <head> view */}
        <div className="border rounded-b-lg rounded-tr-lg p-4 bg-gray-900 text-gray-100 font-mono text-xs leading-6">
          <div className="text-gray-400">&lt;head&gt;</div>
          <div className="pl-4">&lt;title&gt;{meta.title}&lt;/title&gt;</div>
          <div className="pl-4">
            &lt;meta name="description" content="{meta.description}"&gt;
          </div>
          <div className="text-gray-400">&lt;/head&gt;</div>
        </div>
      </div>
    </div>
  );
}