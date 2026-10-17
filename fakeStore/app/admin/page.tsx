'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user?.role !== 'admin') {
            router.push('/products');
        }
    }, [user, isLoading, router]);

    if (isLoading || user?.role !== 'admin') return <p>Verifying secure clearance...</p>;

    return (
        <div style={{ padding: '24px' }}>
            <h1>🔐 System Administrative Dashboard</h1>
            <p>Only verified users with an explicit <strong>admin</strong> assignment can render this terminal layer.</p>
        </div>
    );
}
