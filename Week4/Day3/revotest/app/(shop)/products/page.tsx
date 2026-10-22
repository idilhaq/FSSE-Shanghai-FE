"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatPrice, type Product } from "../../lib/products";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: Product[] = await res.json();
        if (active) {
          setProducts(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load products");
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Products
      </h1>

      {error && (
        <p data-testid="products-error" className="text-red-600">
          {error}
        </p>
      )}

      {!products && !error && (
        <p data-testid="products-loading" className="text-zinc-500">
          Loading products…
        </p>
      )}

      {products && (
        <ul className="flex flex-col gap-3">
          {products.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.id}`}
                data-testid={`product-${product.id}`}
                className="flex items-center justify-between rounded-lg border border-black/[.08] px-4 py-3 transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  {product.name}
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {formatPrice(product.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
