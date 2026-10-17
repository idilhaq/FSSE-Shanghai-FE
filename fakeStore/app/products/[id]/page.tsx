import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProductById, fetchProducts } from '@/services/dummyjson';
import AddToCartPanel from '@/components/AddToCartPanel';

// Pre-render the first batch of products at build time (SSG). Any id not in this
// list is rendered on first request and then cached via ISR (dynamicParams defaults to true).
export async function generateStaticParams() {
    try {
        const { products } = await fetchProducts({ limit: 30 });
        return products.map((p) => ({ id: String(p.id) }));
    } catch {
        return [];
    }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Server-rendered + ISR. Deduped with the layout's generateMetadata via cache().
    const product = await fetchProductById(id).catch(() => null);
    if (!product) notFound();

    const discounted = product.price * (1 - product.discountPercentage / 100);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ flex: '1 1 320px', background: '#fff', padding: '20px', borderRadius: '8px' }}>
                <div style={{ position: 'relative', width: '100%', height: '350px' }}>
                    <Image
                        src={product.images[0] ?? product.thumbnail}
                        alt={product.title}
                        fill
                        priority
                        sizes="(max-width: 1000px) 100vw, 460px"
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                {product.images.length > 1 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {product.images.slice(0, 4).map((src, i) => (
                            <div key={i} style={{ position: 'relative', width: '56px', height: '56px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                <Image src={src} alt={`${product.title} ${i + 1}`} fill sizes="56px" style={{ objectFit: 'contain', padding: '4px' }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div style={{ flex: '1 1 320px' }}>
                <Link href="/products" style={{ color: '#718096' }}>← Catalog</Link>
                <p style={{ margin: '12px 0 0', fontSize: '13px', color: '#718096', textTransform: 'capitalize' }}>
                    {product.category.replace(/-/g, ' ')}{product.brand ? ` · ${product.brand}` : ''}
                </p>
                <h2 style={{ margin: '4px 0 8px', color: '#1a202c' }}>{product.title}</h2>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '22px', color: '#2b6cb0', fontWeight: 'bold' }}>${discounted.toFixed(2)}</span>
                    {product.discountPercentage > 0 && (
                        <>
                            <span style={{ fontSize: '15px', color: '#a0aec0', textDecoration: 'line-through' }}>${product.price.toFixed(2)}</span>
                            <span style={{ fontSize: '13px', color: '#38a169', fontWeight: 600 }}>-{product.discountPercentage.toFixed(0)}%</span>
                        </>
                    )}
                    <span style={{ fontSize: '14px', color: '#d69e2e' }}>★ {product.rating.toFixed(1)}</span>
                </div>

                {product.minimumOrderQuantity > 1 && (
                    <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#718096' }}>
                        Minimum order: {product.minimumOrderQuantity}
                    </p>
                )}

                <p style={{ color: '#4a5568', lineHeight: '1.5', marginTop: '12px' }}>{product.description}</p>

                {/* Interactive piece only — the rest of the page is server-rendered. */}
                <AddToCartPanel product={product} />
            </div>
        </div>
    );
}
