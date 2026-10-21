'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, type Session } from '../lib/auth';

export default function DashboardPage() {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const current = getSession();
        if (!current) {
            router.replace('/login');
            return;
        }
        setSession(current);
        setChecked(true);
    }, [router]);

    function handleLogout() {
        logout();
        router.push('/login');
    }

    // Avoid flashing content before the session check completes.
    if (!checked || !session) {
        return null;
    }

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
                <a href="/" className="text-xl font-bold text-blue-600">
                    RevoShop
                </a>

                <div className="flex items-center gap-4">
                    <span data-testid="welcome-username" className="text-sm text-gray-700">
                        Signed in as{' '}
                        <strong data-testid="username">{session.username}</strong>
                    </span>
                    <button
                        data-testid="logout-button"
                        type="button"
                        onClick={handleLogout}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Log out
                    </button>
                </div>
            </nav>

            <section className="mx-auto max-w-5xl px-6 py-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight">
                    Welcome, {session.username}!
                </h1>
                <p className="mt-4 text-lg text-gray-600">
                    You are now logged in to your RevoShop dashboard.
                </p>
            </section>
        </main>
    );
}
