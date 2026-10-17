'use client';
import { useState } from 'react';
import { useAuth, Role } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('customer@example.com');
    const [role, setRole] = useState<Role>('customer');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await login(email, role);
        if (success) {
            router.push(role === 'admin' ? '/admin' : '/products');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '60px auto', padding: '32px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '20px' }}>Sign In</h2>
            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '8px' }}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '8px', marginBottom: '16px', boxSizing: 'border-box' }} required />

                <label style={{ display: 'block', marginBottom: '8px' }}>Assign RBAC Clearance Profile</label>
                <select value={role} onChange={e => setRole(e.target.value as Role)} style={{ width: '100%', padding: '8px', marginBottom: '24px' }}>
                    <option value="customer">Customer (Standard View Access)</option>
                    <option value="admin">Admin (Full Dashboard Clearance)</option>
                </select>

                <button type="submit" style={{ width: '100%', padding: '10px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Authenticate Interface
                </button>
            </form>
        </div>
    );
}
