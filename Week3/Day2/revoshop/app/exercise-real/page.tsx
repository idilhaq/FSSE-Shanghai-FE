'use client';

import { FormEvent, useState } from 'react';

// Real implementation of the exercise: log in against the Flask backend.
// POST {API_BASE}/auth/login
//   200 -> { id, username, email, role }
//   400 -> { error, field }   (missing email/password)
//   401 -> { error }          (invalid credentials)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

type FieldErrors = {
    email?: string;
    password?: string;
};

// Stand-in for the shared useAuth() hook (see handson2-real).
function useFakeAuth() {
    return { login: (user: User) => console.log('login(user) called with', user) };
}

export default function LoginReal() {
    const { login } = useFakeAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState('');
    const [redirectedTo, setRedirectedTo] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setFieldErrors({});
        setFormError('');
        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 200) {
                const user = (await res.json()) as User;
                localStorage.setItem('user', JSON.stringify(user));
                login(user);
                setRedirectedTo(user.role === 'admin' ? '/dashboard' : '/');
            } else if (res.status === 401) {
                const data = await res.json();
                setFormError(data.error ?? 'Invalid email or password');
            } else if (res.status === 400) {
                const data = await res.json();
                if (data.field) setFieldErrors({ [data.field as keyof FieldErrors]: data.error });
            } else {
                setFormError('Something went wrong. Please try again.');
            }
        } catch {
            setFormError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const field = 'w-full border rounded px-3 py-2';
    const errText = 'text-sm text-red-600 mt-1 mb-2';

    if (redirectedTo) {
        return (
            <main className="font-sans p-6 bg-gray-50 min-h-screen">
                <p className="text-xs text-gray-500 mb-3">localhost:3000{redirectedTo}</p>
                <div className="max-w-sm bg-green-50 border border-green-200 text-green-700 rounded-lg p-5">
                    &#10003; Logged in — redirected to {redirectedTo}.
                </div>
            </main>
        );
    }

    return (
        <main className="font-sans p-6 bg-gray-50 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/login</p>
            <nav className="max-w-sm flex gap-4 text-sm mb-4">
                <span className="font-bold">RevoShop</span>
                <span className="text-gray-500 ml-auto">Login</span>
                <span className="text-gray-500">Register</span>
            </nav>

            <form onSubmit={handleSubmit} className="max-w-sm bg-white border rounded-lg p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Login</h2>

                <label className="text-sm">Email</label>
                <input
                    className={field}
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && <p className={errText}>{fieldErrors.email}</p>}

                <label className="text-sm">Password</label>
                <input
                    type="password"
                    className={field}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && <p className={errText}>{fieldErrors.password}</p>}

                {formError && <p className="mt-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{formError}</p>}

                <button type="submit" disabled={submitting} className="w-full mt-3 px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50">
                    {submitting ? 'Signing in…' : 'Login'}
                </button>
            </form>

            <p className="max-w-sm text-xs text-gray-500 mt-3 text-center">
                Admin &rarr; redirects to /dashboard<br />
                Customer &rarr; redirects to /
            </p>
        </main>
    );
}
