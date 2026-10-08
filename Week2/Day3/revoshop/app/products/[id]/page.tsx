import type { Metadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Product #${id} — My Store`,
    description: 'Product details.',
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  return (
    <main className="font-sans p-6 max-w-xl">
      <p className="font-mono text-xs text-gray-400 mb-3">app/products/[id]/page.tsx</p>
      <h1 className="text-2xl font-semibold">Product #{id}</h1>
    </main>
  );
}
