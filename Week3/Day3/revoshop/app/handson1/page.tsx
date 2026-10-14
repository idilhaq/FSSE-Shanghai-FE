'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ===== Shared types =========================================================
type User = { id: number; username: string; role: string };
type Auth = { isLoggedIn: boolean; currentUser: User | null };
type Router = { replace: (path: string) => void };

// ===== Lecture 2's AuthContext + useAuth() (recreated here in one file) =====
const AuthContext = createContext<Auth | null>(null);
function useAuth(): Auth {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthContext.Provider');
    return ctx;
}

// ===== A FAKE useRouter() — replace() records where we got sent =============
const RouterContext = createContext<Router | null>(null);
function useRouter(): Router {
    const ctx = useContext(RouterContext);
    if (!ctx) throw new Error('useRouter must be used within RouterContext.Provider');
    return ctx;
}

// A tiny "you were redirected" banner so the redirect is visible on screen.
function Redirecting({ to, reason }: { to: string; reason: string }) {
    return (
        <div className="border border-amber-300 bg-amber-50 text-amber-800 rounded-lg p-4 text-sm">
            &#9888; {reason} &rarr; redirecting to <b>{to}</b>
        </div>
    );
}

// ===== WORKED EXAMPLE — ProtectedRoute (authentication only) ===============
function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) router.replace('/login');
    }, [isLoggedIn]);

    if (!isLoggedIn) return <Redirecting to="/login" reason="Not logged in" />;
    return children;
}

// ===== YOUR TURN — AdminRoute (login AND admin role) =======================
function AdminRoute({ children }: { children: ReactNode }) {
    const { isLoggedIn, currentUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect rules, login checked FIRST
        if (!isLoggedIn) router.replace('/login');
        else if (currentUser?.role !== 'admin') router.replace('/');
    }, [isLoggedIn, currentUser]);

    // Render guards (return BEFORE children)
    if (!isLoggedIn) return <Redirecting to="/login" reason="Not logged in" />;
    if (currentUser?.role !== 'admin') return <Redirecting to="/" reason="Access denied" />;

    return children;
}

// ===== YOUR TURN — PublicOnlyRoute (only for logged-OUT users) =============
function PublicOnlyRoute({ children }: { children: ReactNode }) {
    const { isLoggedIn } = useAuth();
    const router = useRouter();

    // Redirect to '/' when the user IS logged in (inverted condition),
    // then guard the render the same way.
    useEffect(() => {
        if (isLoggedIn) router.replace('/');
    }, [isLoggedIn]);

    if (isLoggedIn) return <Redirecting to="/" reason="Already logged in" />;

    return children;
}

// ===== The protected page AdminRoute is guarding ===========================
function DashboardStub() {
    const { currentUser } = useAuth();
    return (
        <div className="border border-green-300 bg-green-50 text-green-800 rounded-lg p-4 text-sm">
            &#10003; Admin verified &rarr; dashboard loaded. Welcome, <b>{currentUser?.username}</b>.
        </div>
    );
}

export default function App() {
    const [session, setSession] = useState<'out' | 'customer' | 'admin'>('out');
    const [redirectLog, setRedirectLog] = useState('');

    const auth: Auth = {
        isLoggedIn: session !== 'out',
        currentUser:
            session === 'admin'
                ? { id: 1, username: 'admin', role: 'admin' }
                : session === 'customer'
                    ? { id: 42, username: 'johndoe', role: 'customer' }
                    : null,
    };
    const router: Router = { replace: (path) => setRedirectLog(path) };

    const btn = (s: any, label: string) =>
        <button
            onClick={() => { setRedirectLog(''); setSession(s); }}
            className={'px-3 py-1.5 rounded text-sm ' + (session === s ? 'bg-gray-900 text-white' : 'bg-grey-100 border')}
        >{label}</button>;

    return (
        <AuthContext.Provider value={auth}>
            <RouterContext.Provider value={router}>
                <main className="font-sans p-6 bg-gray-700 min-h-screen">
                    <p className="text-xs text-gray-500 mb-3">localhost:3000/dashboard (wrapped in AdminRoute)</p>
                    <div className="flex gap-2 mb-4">
                        {btn('out', 'Logged out')}
                        {btn('customer', 'Customer')}
                        {btn('admin', 'Admin')}
                    </div>
                    {redirectLog &&
                        <p className="text-xs text-black-500 mb-3">router.replace(&apos;{redirectLog}&apos;) was called</p>}
                    <div className="max-w-md">
                        <AdminRoute>
                            <DashboardStub />
                        </AdminRoute>
                    </div>
                </main>
            </RouterContext.Provider>
        </AuthContext.Provider>
    );
}
