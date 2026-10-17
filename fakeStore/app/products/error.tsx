'use client';
import { useEffect } from 'react';

export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => { console.error('E-commerce Page Error Dashboard:', error); }, [error]);

    return (
        <div style={{ padding: '40px', textAlign: 'center', border: '1px solid #ffcccc', borderRadius: '8px', background: '#fff5f5' }}>
            <h2 style={{ color: '#cc0000' }}>Something went wrong!</h2>
            <p style={{ margin: '12px 0', color: '#555' }}>{error.message || 'Could not fetch catalogue list details.'}</p>
            <button onClick={() => reset()} style={{ padding: '10px 20px', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                🔄 Try Again
            </button>
        </div>
    );
}
