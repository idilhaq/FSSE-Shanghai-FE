'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
    const pathname = usePathname();
    const { user, logout, isLoading } = useAuth();
    const { totalItems } = useCart();

    const linkStyle = (path: string) => ({
        color: pathname === path ? '#3182ce' : '#2d3748',
        fontWeight: pathname === path ? 'bold' : 'normal',
        textDecoration: 'none',
        padding: '8px 12px',
        borderRadius: '4px',
        background: pathname === path ? '#ebf8ff' : 'transparent',
    });

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#fff' }}>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <strong style={{ fontSize: '20px', color: '#1a202c' }}>⚡ Storefront</strong>

                {/* Universal Routes */}
                <Link href="/products" style={linkStyle('/products')}>Products</Link>
                <Link href="/cart" style={linkStyle('/cart')}>Cart ({totalItems})</Link>

                {/* RBAC Route: Admins Only */}
                {user?.role === 'admin' && (
                    <Link href="/admin" style={linkStyle('/admin')}>Admin Controls</Link>
                )}
            </div>

            <div>
                {isLoading ? (
                    // Neutral placeholder until the client restores the session, so the
                    // auth UI doesn't flash "Sign In" before swapping to the user.
                    <div style={{ width: '80px', height: '32px' }} />
                ) : user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '14px', background: '#edf2f7', padding: '4px 8px', borderRadius: '6px' }}>
                            {user.email} ({user.role})
                        </span>
                        <button onClick={logout} style={{ padding: '6px 12px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <Link href="/login" style={{ padding: '8px 16px', background: '#3182ce', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
