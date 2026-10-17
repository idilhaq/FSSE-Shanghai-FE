'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const primaryBtn: React.CSSProperties = {
    padding: '12px 24px',
    background: '#3182ce',
    color: '#fff',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
};

const secondaryBtn: React.CSSProperties = {
    padding: '12px 24px',
    background: '#fff',
    color: '#2d3748',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 'bold',
};

export default function HomeCta() {
    const { user, isLoading } = useAuth();
    const { totalItems } = useCart();

    // Avoid flashing the wrong CTA before the client knows the auth state.
    if (isLoading) {
        return <div style={{ height: '48px' }} />;
    }

    return (
        <div>
            {user ? (
                <>
                    <p style={{ margin: '0 0 12px 0', color: '#4a5568' }}>
                        Welcome back, <strong>{user.email}</strong> ({user.role})
                        {totalItems > 0 && (
                            <> — you have <strong>{totalItems}</strong> item{totalItems !== 1 ? 's' : ''} in your cart.</>
                        )}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link href="/products" style={primaryBtn}>Browse Products</Link>
                        <Link href="/cart" style={secondaryBtn}>View Cart ({totalItems})</Link>
                        {user.role === 'admin' && (
                            <Link href="/admin" style={secondaryBtn}>Admin Dashboard</Link>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <p style={{ margin: '0 0 12px 0', color: '#4a5568' }}>
                        Sign in to start shopping — your cart is saved to your account.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link href="/login" style={primaryBtn}>Sign In</Link>
                        <Link href="/products" style={secondaryBtn}>Browse Products</Link>
                    </div>
                </>
            )}
        </div>
    );
}
