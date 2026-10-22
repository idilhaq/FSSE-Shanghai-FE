import { Suspense } from "react";
import { headers } from "next/headers";
import { formatPrice } from "../../lib/products";
import type { SampleProduct } from "../../api/sample-products/route";
import { AddToCartButton } from "./add-to-cart-button";

// This is a SERVER COMPONENT. The product list is fetched on the server
// during rendering (no useEffect, no client fetch). In Playwright we mock
// this GET with page.route() just like a client fetch — the intercept sits
// in the browser's network layer, and Next's server fetch to its own
// /api route still travels back through the same origin the test controls.
async function getProducts(): Promise<SampleProduct[]> {
  // Server-side fetch needs an absolute URL. Derive the origin from the
  // incoming request headers so it works in dev and under Playwright.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/sample-products`, {
    // Always hit the route fresh so the mock is exercised every run.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  return res.json();
}

async function ProductList() {
  const products = await getProducts();

  return (
    <ul className="flex flex-col gap-3">
      {products.map((product) => (
        <li
          key={product.id}
          data-testid={`sample-product-${product.id}`}
          className="flex items-center justify-between rounded-lg border border-black/[.08] px-4 py-3 dark:border-white/[.145]"
        >
          <div className="flex flex-col">
            <span className="font-medium text-black dark:text-zinc-50">
              {product.name}
            </span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {formatPrice(product.price)}
            </span>
          </div>

          {/* Client component: the POST happens from the browser. */}
          <AddToCartButton productId={product.id} />
        </li>
      ))}
    </ul>
  );
}

export default function SampleProductsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Sample products (server-rendered)
      </h1>

      {/* The server fetch is wrapped in Suspense so Next can stream it. */}
      <Suspense
        fallback={
          <p data-testid="sample-products-loading" className="text-zinc-500">
            Loading products…
          </p>
        }
      >
        <ProductList />
      </Suspense>
    </main>
  );
}
