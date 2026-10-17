// Streamed via Suspense while the server component fetches the product.
// Mirrors the detail page's two-column layout to minimize layout shift.
const block = (style: React.CSSProperties) => (
    <div className="animate-pulse" style={{ background: '#e2e8f0', borderRadius: '6px', ...style }} />
);

export default function ProductDetailLoading() {
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ flex: '1 1 320px', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                {block({ width: '100%', height: '320px' })}
            </div>
            <div style={{ flex: '1 1 320px' }}>
                {block({ width: '80px', height: '14px', marginBottom: '16px' })}
                {block({ width: '60%', height: '28px', marginBottom: '12px' })}
                {block({ width: '120px', height: '22px', marginBottom: '20px' })}
                {block({ width: '100%', height: '14px', marginBottom: '8px' })}
                {block({ width: '100%', height: '14px', marginBottom: '8px' })}
                {block({ width: '70%', height: '14px', marginBottom: '28px' })}
                {block({ width: '220px', height: '44px' })}
            </div>
        </div>
    );
}
