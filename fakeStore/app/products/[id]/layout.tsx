import { fetchProductById } from '@/services/dummyjson';

interface Props {
    params: Promise<{ id: string }>;
}

// Generates dynamic SEO optimization metadata values 
export async function generateMetadata({ params }: Props) {
    try {
        const { id } = await params;
        const product = await fetchProductById(id);
        return {
            title: `${product.title} | E-Store`,
            description: product.description.slice(0, 150),
        };
    } catch {
        return { title: 'Product Details', description: 'View standalone storefront metrics' };
    }
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
    return <div style={{ marginTop: '12px' }}>{children}</div>;
}
