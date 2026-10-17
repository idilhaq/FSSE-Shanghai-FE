import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Products | Sample E-Store',
    description: 'Browse our full catalog of clothing, electronics, and accessories updated live.',
};

export default function ProductsRootLayout({ children }: { children: React.ReactNode }) {
    return <section style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>{children}</section>;
}
