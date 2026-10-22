"use client";

import Link from "next/link";
import { useCart } from "../../lib/cart";
import { formatPrice } from "../../lib/products";

export default function CartPage() {
  const { items, total } = useCart();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Your cart
      </h1>

      {items.length === 0 ? (
        <p data-testid="cart-empty" className="text-zinc-500">
          Your cart is empty.{" "}
          <Link href="/products" className="font-medium underline">
            Browse products
          </Link>
        </p>
      ) : (
        <>
          <ul className="mb-8 flex flex-col gap-3">
            {items.map((item) => (
              <li
                key={item.id}
                data-testid={`cart-item-${item.id}`}
                className="flex items-center justify-between rounded-lg border border-black/[.08] px-4 py-3 dark:border-white/[.145]"
              >
                <span className="font-medium text-black dark:text-zinc-50">
                  {item.name}
                  <span className="ml-2 text-sm text-zinc-500">×{item.qty}</span>
                </span>
                <span className="text-zinc-600 dark:text-zinc-400">
                  {formatPrice(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between">
            <span
              data-testid="cart-total"
              className="text-lg font-semibold text-black dark:text-zinc-50"
            >
              Total: {formatPrice(total)}
            </span>

            <Link
              href="/checkout"
              data-testid="checkout-button"
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
