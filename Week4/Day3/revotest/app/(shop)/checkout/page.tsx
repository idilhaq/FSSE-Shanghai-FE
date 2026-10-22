"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../lib/cart";
import { formatPrice } from "../../lib/products";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);

  const placeOrder = () => {
    clearCart();
    setPlaced(true);
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Checkout
      </h1>

      {placed ? (
        <div
          data-testid="order-success"
          className="flex flex-col gap-3 rounded-lg border border-green-600/40 bg-green-50 p-6 dark:bg-green-950/30"
        >
          <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400">
            Order placed!
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            Thanks for shopping with RevoShop. Your order is confirmed.
          </p>
          <Link href="/products" className="font-medium underline">
            Continue shopping
          </Link>
        </div>
      ) : items.length === 0 ? (
        <p data-testid="checkout-empty" className="text-zinc-500">
          There is nothing to check out.{" "}
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
            <span className="text-lg font-semibold text-black dark:text-zinc-50">
              Total: {formatPrice(total)}
            </span>

            <button
              type="button"
              data-testid="place-order"
              onClick={placeOrder}
              className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Place order
            </button>
          </div>
        </>
      )}
    </main>
  );
}
