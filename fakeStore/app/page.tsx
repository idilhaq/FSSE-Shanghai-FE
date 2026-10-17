import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts, Product } from '@/services/dummyjson';
import HomeCta from '@/components/HomeCta';

const FEATURES = [
  { icon: '🗂️', title: 'Live Catalog', text: 'Products are fetched and cached from the FakeStore API with ISR.' },
  { icon: '🛒', title: 'Persistent Cart', text: 'Each account keeps its own cart, saved across visits.' },
  { icon: '🔐', title: 'Role-Based Access', text: 'Customers shop; admins get a protected dashboard.' },
];

export default async function Home() {
  // Pull a few items to feature. Fail soft so the landing page still renders if the API is down.
  let featured: Product[] = [];
  try {
    const listing = await fetchProducts({ limit: 4 });
    featured = listing.products;
  } catch {
    featured = [];
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero */}
      <section
        style={{
          background: 'linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%)',
          borderRadius: '12px',
          padding: '48px 32px',
          marginBottom: '40px',
        }}
      >
        <h1 style={{ fontSize: '36px', margin: '0 0 12px 0', color: '#1a202c' }}>
          ⚡ Welcome to Storefront
        </h1>
        <p style={{ fontSize: '18px', color: '#4a5568', maxWidth: '640px', margin: '0 0 24px 0' }}>
          A demo e-commerce app built with Next.js — browse the catalog, manage a
          per-user cart, and see role-based access in action.
        </p>
        <HomeCta />
      </section>

      {/* Feature cards */}
      <section style={{ marginBottom: '48px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#1a202c' }}>{f.title}</h3>
              <p style={{ margin: 0, color: '#4a5568', lineHeight: 1.5 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, color: '#1a202c' }}>Featured Products</h2>
            <Link href="/products" style={{ color: '#3182ce', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', height: '100%' }}>
                  <div style={{ position: 'relative', background: '#fff', borderRadius: '6px', padding: '8px', marginBottom: '12px', height: '140px' }}>
                    <Image src={product.thumbnail} alt={product.title} fill sizes="(max-width: 768px) 50vw, 220px" style={{ objectFit: 'contain', padding: '8px' }} />
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', lineHeight: 1.4, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.title}
                  </h4>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#2b6cb0' }}>${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
