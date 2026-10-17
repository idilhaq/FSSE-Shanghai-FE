'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type Role = 'guest' | 'customer' | 'admin';

interface User {
    email: string;
    role: Role;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, role: Role) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Start as logged-out so the first client render matches the server-rendered
    // HTML (localStorage isn't available on the server). The saved session is
    // restored in a mount effect below, avoiding a hydration mismatch.
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // Restore the persisted session after mount (client only), then mark ready.
    // Reading localStorage must happen post-hydration — doing it during render
    // would reintroduce a server/client mismatch — so setState-in-effect is the
    // correct pattern here, not an anti-pattern.
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('auth_user');
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (savedUser) setUser(JSON.parse(savedUser));
        } catch {
            // ignore malformed storage
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, role: Role) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, role }),
        });

        if (res.ok) {
            const userData = { email, role };
            setUser(userData);
            localStorage.setItem('auth_user', JSON.stringify(userData));
            router.refresh();
            return true;
        }
        return false;
    };

    const logout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        localStorage.removeItem('auth_user');
        router.push('/login');
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be enclosed in an AuthProvider framework');
    return context;
}
