"use client";

import { use, useEffect, useState } from "react";
import { useCart } from "../../../lib/cart";
import { formatPrice, type Product } from "../../../lib/products";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const productId = Number(id);

  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: Product[] = await res.json();
        if (!active) return;
        const match = data.find((p) => p.id === productId);
        if (match) {
          setProduct(match);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load product");
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [productId]);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Product detail
      </h1>

      {error && (
        <p data-testid="product-error" className="text-red-600">
          {error}
        </p>
      )}

      {notFound && (
        <p data-testid="product-not-found" className="text-zinc-500">
          Product not found.
        </p>
      )}

      {!product && !notFound && !error && (
        <p data-testid="product-loading" className="text-zinc-500">
          Loading product…
        </p>
      )}

      {product && (
        <div
          data-testid={`product-detail-${product.id}`}
          className="flex flex-col gap-6 rounded-lg border border-black/[.08] p-6 dark:border-white/[.145]"
        >
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
              {product.name}
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {formatPrice(product.price)}
            </p>
          </div>

          <button
            type="button"
            data-testid="add-to-cart"
            onClick={() => {
              addToCart(product);
              setAdded(true);
            }}
            className="inline-flex h-12 w-fit items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add to cart
          </button>

          {added && (
            <p data-testid="added-confirmation" className="text-sm text-green-600">
              Added to cart.
            </p>
          )}
        </div>
      )}
    </main>
  );
}
