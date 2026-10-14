'use client';

import { FormEvent, useState } from 'react';

// Real implementation of handson1: register a user against the Flask backend.
// POST {API_BASE}/users  ->  201 on success, 409 if the email is taken.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterReal() {
    const [form, setForm] = useState<RegisterForm>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [redirectedTo, setRedirectedTo] = useState('');
    const [submitting, setSubmitting] = useState(false);

    function update(field: keyof RegisterForm, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function validate(f: RegisterForm): FormErrors {
        const e: FormErrors = {};
        if (!f.username.trim()) e.username = 'Username is required';
        if (!EMAIL_RE.test(f.email)) e.email = 'Enter a valid email address';
        if (f.password.length < 8) e.password = 'Password must be at least 8 characters';
        if (f.confirmPassword !== f.password) e.confirmPassword = 'Passwords do not match';
        return e;
    }

    async function handleSubmit(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        setFormError('');
        setRedirectedTo('');

        const errs = validate(form);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return; // stop — do not POST invalid data

        setSubmitting(true);
        try {
            const res = await fetch(`${API_BASE}/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: form.username,
                    email: form.email,
                    password_hash: form.password,
                }),
            });

            if (res.status === 201) {
                const user = await res.json();
                localStorage.setItem('user', JSON.stringify(user));
                setRedirectedTo('/'); // in the real app: router.push('/')
            } else if (res.status === 409) {
                const data = await res.json();
                setFormError(data.error ?? 'Email already registered');
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
                    &#10003; Account created — redirected to {redirectedTo}. Welcome, {form.username}!
                </div>
            </main>
        );
    }

    return (
        <main className="font-sans p-6 bg-gray-50 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/register</p>
            <nav className="max-w-sm flex gap-4 text-sm mb-4">
                <span className="font-bold">RevoShop</span>
                <span className="text-gray-500 ml-auto">Login</span>
                <span className="text-gray-500">Register</span>
            </nav>

            <form onSubmit={handleSubmit} className="max-w-sm bg-white border rounded-lg p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Create account</h2>

                <label className="text-sm">Username</label>
                <input className={field} value={form.username} onChange={(e) => update('username', e.target.value)} />
                {errors.username && <p className={errText}>{errors.username}</p>}

                <label className="text-sm">Email</label>
                <input className={field} value={form.email} onChange={(e) => update('email', e.target.value)} />
                {errors.email && <p className={errText}>{errors.email}</p>}

                <label className="text-sm">Password</label>
                <input type="password" className={field} value={form.password} onChange={(e) => update('password', e.target.value)} />
                {errors.password && <p className={errText}>{errors.password}</p>}

                <label className="text-sm">Confirm password</label>
                <input type="password" className={field} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                {errors.confirmPassword && <p className={errText}>{errors.confirmPassword}</p>}

                {formError && <p className="mt-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded px-3 py-2">{formError}</p>}

                <button type="submit" disabled={submitting} className="w-full mt-3 px-4 py-2 bg-gray-900 text-white rounded disabled:opacity-50">
                    {submitting ? 'Creating…' : 'Register'}
                </button>
            </form>
        </main>
    );
}
