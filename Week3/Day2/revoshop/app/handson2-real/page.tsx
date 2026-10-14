'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Real implementation of handson2: a proper AuthContext + useAuth() hook.
// In a real app this provider lives in app/context/AuthContext.tsx and wraps
// the whole tree in app/layout.tsx; useAuth() is imported where auth state is
// needed. Session is restored from localStorage on mount so a refresh keeps
// the user logged in.

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthContextValue {
    currentUser: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Restore the session on mount.
    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) {
            try {
                setCurrentUser(JSON.parse(raw) as User);
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);

    function login(user: User) {
        setCurrentUser(user);
        localStorage.setItem('user', JSON.stringify(user));
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('user');
    }

    const value: AuthContextValue = {
        currentUser,
        isLoggedIn: currentUser !== null,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook — the only way components read auth state.
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (ctx === null) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}

// ---- Header reacts to auth state ----------------------------------------
function Header() {
    const { currentUser, isLoggedIn, logout } = useAuth();
    const cartCount = 3; // in a real app this comes from useCart()

    return (
        <nav className="flex items-center gap-4 bg-white border rounded px-4 py-3 text-sm">
            <span className="font-bold">RevoShop</span>
            <div className="ml-auto flex items-center gap-4">
                {isLoggedIn && currentUser ? (
                    <>
                        <span>Hi, {currentUser.username}</span>
                        <span aria-label="cart">🛒 {cartCount}</span>
                        <button onClick={logout} className="px-3 py-1 border rounded">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <span className="text-gray-500">Register</span>
                        <span className="text-gray-500">Login</span>
                    </>
                )}
            </div>
        </nav>
    );
}

// ---- A tiny app to exercise the context ---------------------------------
function Demo() {
    const { isLoggedIn, login, logout } = useAuth();
    return (
        <div className="mt-4 flex gap-2">
            <button
                onClick={() => login({ id: 42, username: 'johndoe', email: 'john@email.com', role: 'customer' })}
                className="px-4 py-2 bg-gray-900 text-white rounded"
            >
                Simulate login
            </button>
            <button onClick={logout} className="px-4 py-2 border rounded">Logout</button>
            <span className="self-center text-sm text-gray-500">
                isLoggedIn: {String(isLoggedIn)}
            </span>
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <main className="font-sans p-6 bg-gray-50 min-h-screen">
                <Header />
                <Demo />
            </main>
        </AuthProvider>
    );
}
