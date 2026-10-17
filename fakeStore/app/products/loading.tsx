// Streamed via Suspense while the catalog server component fetches products +
// categories. Mirrors the real grid so there's minimal layout shift on load.
export default function ProductsLoading() {
    return (
        <div>
            <div className="animate-pulse" style={{ width: '240px', height: '28px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '16px' }} />

            {/* Category chip row placeholder */}
            <div style={{ display: 'flex', gap: '8px', padding: '8px 0 20px' }}>
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse" style={{ width: '84px', height: '30px', background: '#e2e8f0', borderRadius: '999px' }} />
                ))}
            </div>

            {/* Product card grid placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#fff' }}>
                        <div className="animate-pulse" style={{ width: '100%', height: '180px', background: '#edf2f7', borderRadius: '6px', marginBottom: '12px' }} />
                        <div className="animate-pulse" style={{ width: '90%', height: '14px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
                        <div className="animate-pulse" style={{ width: '50%', height: '14px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }} />
                        <div className="animate-pulse" style={{ width: '100%', height: '34px', background: '#e2e8f0', borderRadius: '4px' }} />
                    </div>
                ))}
            </div>
        </div>
    );
}
