"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";

export function CartLink() {
  const { count } = useCart();

  return (
    <Link
      href="/cart"
      data-testid="cart-link"
      className="inline-flex items-center gap-2 rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
    >
      <span>Cart</span>
      <span
        data-testid="cart-badge"
        className="inline-flex min-w-6 items-center justify-center rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background"
      >
        {count}
      </span>
    </Link>
  );
}
