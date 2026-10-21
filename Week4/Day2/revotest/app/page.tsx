'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, type Session } from './lib/auth';

export default function HomePage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Read the session that global-setup seeded (or that login created).
    setSession(getSession());
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    router.push('/login');
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
        <a href="/" className="text-xl font-bold text-blue-600">
          RevoShop
        </a>

        <div className="flex items-center gap-6">
          <a href="/" className="hover:text-blue-600">
            Home
          </a>
          <a href="/products" className="hover:text-blue-600">
            Products
          </a>
          <a href="/categories" className="hover:text-blue-600">
            Categories
          </a>

          {session ? (
            <>
              <span
                data-testid="nav-username"
                className="font-semibold text-gray-900"
              >
                {session.username}
              </span>
              <button
                data-testid="nav-logout"
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Log out
              </button>
            </>
          ) : (
            <a
              data-testid="nav-login"
              href="/login"
              className="hover:text-blue-600"
            >
              Login
            </a>
          )}
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to RevoShop
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          Discover products you will love.
        </p>

        <a
          href="/products"
          className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Browse Products
        </a>
      </section>
    </main>
  );
}
