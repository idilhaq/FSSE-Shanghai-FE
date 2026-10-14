'use client';

import { FormEvent, useState } from 'react';

type RegisterForm = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

type UserBody = {
    username: string;
    email: string;
    password_hash: string;
};

type MockResponse = {
    ok: boolean;
    status: number;
    json: () => Promise<{ error?: string } & Record<string, unknown>>;
};

// Simulates POST http://localhost:5000/users on the Flask backend.
// Real call:
//   const res = await fetch(base + '/users', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ username, email, password_hash: password }),
//   });
function mockPostUser(body: UserBody): Promise<MockResponse> {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (body.email === 'taken@email.com') {
                resolve({ ok: false, status: 409, json: () => Promise.resolve({ error: 'Email already registered' }) });
            } else {
                resolve({
                    ok: true,
                    status: 201,
                    json: () => Promise.resolve({ id: 42, username: body.username, email: body.email, role: 'customer' }),
                });
            }
        }, 400);
    });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function App() {
    const [form, setForm] = useState({
        username: 'johndoe',
        email: 'bad-email',
        password: 'secret',
        confirmPassword: 'sec',
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
        const res = await mockPostUser({
            username: form.username,
            email: form.email,
            password_hash: form.password,
        });

        if (res.status === 201) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            setRedirectedTo('/'); // simulates router.push('/')
        } else if (res.status === 409) {
            const data = await res.json();
            setFormError(data.error ?? 'Something went wrong');
        }

        setSubmitting(false);
    }

    const field = 'w-full border rounded px-3 py-2';
    const errText = 'text-sm text-red-600 mt-1 mb-2';
    const raw = localStorage.getItem('user');
    const user = raw ? JSON.parse(raw) : null;
    const flag = localStorage.getItem('IS_USER_EXIST');

    if (redirectedTo) {
        return (
            <main className="font-sans p-6 bg-gray-50 min-h-screen">
                <p className="text-xs text-gray-500 mb-3">localhost:3000{redirectedTo}</p>
                <div className="max-w-sm bg-green-50 border border-green-200 text-green-700 rounded-lg p-5">
                    &#10003; Account created — redirected to {redirectedTo}. Welcome, {flag}!
                </div>
            </main>
        );
    }

    return (
        <main className="font-sans p-6 bg-black-50 min-h-screen">
            <p className="text-xs text-gray-500 mb-3">localhost:3000/register</p>
            <nav className="max-w-sm flex gap-4 text-sm mb-4">
                <span className="font-bold">RevoShop</span>
                <span className="text-gray-500 ml-auto">Login</span>
                <span className="text-gray-500">Register</span>
            </nav>
            {flag}
            <form onSubmit={handleSubmit} className="max-w-sm bg-amber-700 border rounded-lg p-5 shadow-sm">
                <h2 className="font-semibold text-lg mb-3">Create account</h2>

                <label className="text-sm">Username</label>
                <div style={{ display: 'flex' }}>
                    <input className={field} value={form.username} onChange={(e) => update('username', e.target.value)} />{errors.username && <p className={errText}>{errors.username}</p>}
                </div>

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