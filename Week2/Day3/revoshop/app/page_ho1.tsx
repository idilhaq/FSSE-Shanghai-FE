'use client'

import { useState } from 'react';

// Simulates your .env.local file. In a real app this is a separate file at the
// project root and is git-ignored — it is NEVER written inside your code.
const ENV_FILE: any = {
  NEXT_PUBLIC_API_BASE_URL: 'http://localhost:5000',
  API_SECRET_KEY: 'super-secret-key-123',
};

// Simulates how Next.js exposes env vars to the BROWSER (client components):
// only keys prefixed with NEXT_PUBLIC_ are available; everything else is undefined.
// In real code you'd just write: process.env.NEXT_PUBLIC_API_BASE_URL
function clientEnv(key: string) {
  return key.startsWith('NEXT_PUBLIC_') ? ENV_FILE[key] : undefined;
}

export default function App() {
  // TODO Step 3: read NEXT_PUBLIC_API_BASE_URL via clientEnv(...)
  // const baseUrl = clientEnv('NEXT_PUBLIC_API_BASE_URL');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // TODO Step 4: read API_SECRET_KEY the same way — what do you get?
  // const secret = clientEnv('API_SECRET_KEY');
  const secret = process.env.API_SECRET_KEY;

  return (
    <main className="font-sans p-8 max-w-lg">
      <h1 className="text-xl font-bold mb-4">Environment Variables</h1>

      <div className="border rounded-lg p-4 mb-3">
        <p className="text-xs text-gray-500 mb-1">NEXT_PUBLIC_API_BASE_URL</p>
        <p className="font-mono text-green-700">{process.env.NEXT_PUBLIC_API_BASE_URL ?? 'undefined'}</p>
        <p className="text-xs text-gray-400 mt-1">Has NEXT_PUBLIC_ prefix → visible in the browser ✅</p>
      </div>

      <div className="border rounded-lg p-4">
        <p className="text-xs text-gray-500 mb-1">API_SECRET_KEY</p>
        <p className="font-mono text-red-700">
          {process.env.NEXT_PUBLIC_API_SECRET_KEY}
        </p>
        <p className="text-xs text-gray-400 mt-1">No prefix → stays on the server only 🔒</p>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        Example request URL:{' '}
        <span className="font-mono">{baseUrl}/products</span>
      </p>
    </main>
  );
}