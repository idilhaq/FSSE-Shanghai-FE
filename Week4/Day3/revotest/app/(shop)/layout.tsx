import Link from "next/link";
import { CartLink } from "../components/cart-badge";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/[.08] dark:border-white/[.145]">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/products"
            className="text-lg font-semibold tracking-tight text-black dark:text-zinc-50"
          >
            RevoShop
          </Link>
          <CartLink />
        </div>
      </header>
      {children}
    </div>
  );
}
