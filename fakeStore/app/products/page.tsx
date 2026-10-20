import Link from 'next/link';
import Image from 'next/image';
import {
    fetchProducts,
    fetchProductsByCategory,
    fetchCategories,
    Product,
} from '@/services/dummyjson';

const PAGE_LIMIT = 30;

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;

    const [categories, listing] = await Promise.all([
        fetchCategories(),
        category
            ? fetchProductsByCategory(category, { limit: PAGE_LIMIT })
            : fetchProducts({ limit: PAGE_LIMIT }),
    ]);

    const products: Product[] = listing.products;
    const activeCategory = categories.find((c) => c.slug === category);

    const chip = (active: boolean): React.CSSProperties => ({
        display: 'inline-block',
        padding: '6px 12px',
        borderRadius: '999px',
        fontSize: '13px',
        textDecoration: 'none',
        border: '1px solid',
        borderColor: active ? '#3182ce' : '#e2e8f0',
        background: active ? '#3182ce' : '#fff',
        color: active ? '#fff' : '#2d3748',
        whiteSpace: 'nowrap',
    });

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                <h1 style={{ marginBottom: '8px' }}>
                    {activeCategory ? activeCategory.name : 'Marketplace Catalog'}
                </h1>
                <span style={{ color: '#718096', fontSize: '14px' }}>
                    {listing.total} product{listing.total !== 1 ? 's' : ''}
                </span>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 0 20px', marginBottom: '8px' }}>
                <Link href="/products" style={chip(!category)}>All</Link>
                {categories.map((c) => (
                    <Link key={c.slug} href={`/products?category=${c.slug}`} style={chip(c.slug === category)}>
                        {c.name}
                    </Link>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {products.map((product, index) => {
                    const soldOut = product.stock <= 0;
                    // Eagerly load the first row (above the fold) so the LCP image
                    // isn't lazy-loaded; the rest stay lazy for bandwidth savings.
                    const isAboveFold = index < 4;
                    return (
                        <div data-testid="product-card" key={product.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#fff', color: '#1a202c', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                            <div>
                                <div style={{ position: 'relative', background: '#fff', borderRadius: '6px', padding: '8px', marginBottom: '12px', height: '180px' }}>
                                    <Image
                                        src={product.thumbnail}
                                        alt={product.title}
                                        fill
                                        priority={isAboveFold}
                                        sizes="(max-width: 768px) 50vw, 280px"
                                        style={{ objectFit: 'contain', padding: '8px' }}
                                    />
                                </div>
                                <span style={{ fontSize: '12px', color: '#718096', textTransform: 'capitalize' }}>{product.category.replace(/-/g, ' ')}</span>
                                <h3 style={{ fontSize: '15px', lineHeight: '1.4', margin: '4px 0 8px 0', minHeight: '42px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{product.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                    <p style={{ fontWeight: 'bold', color: '#2b6cb0', margin: '8px 0', fontSize: '18px' }}>${product.price.toFixed(2)}</p>
                                    <span style={{ fontSize: '13px', color: '#d69e2e' }}>★ {product.rating.toFixed(1)}</span>
                                </div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: soldOut ? '#c53030' : '#2f855a' }}>
                                    {soldOut ? 'Out of stock' : `${product.stock} in stock`}
                                </p>
                            </div>
                            <Link href={`/products/${product.id}`} style={{ display: 'block', textAlign: 'center', background: '#3182ce', color: 'white', padding: '8px', borderRadius: '4px', textDecoration: 'none', marginTop: '12px' }}>
                                View Details
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
