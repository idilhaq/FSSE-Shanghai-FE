'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '../lib/auth';

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        const loginError = loginUser(email.trim(), password);

        if (loginError) {
            setError(loginError);
            return;
        }

        router.push('/dashboard');
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome back
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Log in to your RevoShop account.
                    </p>
                </div>

                <form
                    data-testid="login-form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            data-testid="email-input"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            data-testid="password-input"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            data-testid="login-error"
                            className="text-sm text-red-600"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        data-testid="login-submit"
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Log in
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <a href="/register" className="font-medium text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </section>
        </main>
    );
}
