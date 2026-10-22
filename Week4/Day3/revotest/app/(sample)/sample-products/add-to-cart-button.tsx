"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

// Client component. Clicking the button fires a POST to /api/sample-products
// from the BROWSER, so Playwright intercepts it in the page network layer.
export function AddToCartButton({ productId }: { productId: number }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const addToCart = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/sample-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data: { ok: boolean; message: string } = await res.json();
      setStatus("success");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        data-testid={`sample-add-to-cart-${productId}`}
        onClick={addToCart}
        disabled={status === "loading"}
        className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-foreground px-5 text-sm text-background transition-colors hover:bg-[#383838] disabled:opacity-60 dark:hover:bg-[#ccc]"
      >
        {status === "loading" ? "Adding…" : "Add to cart"}
      </button>

      {status === "success" && (
        <p
          data-testid={`sample-add-success-${productId}`}
          className="text-xs text-green-600"
        >
          {message}
        </p>
      )}

      {status === "error" && (
        <p
          data-testid={`sample-add-error-${productId}`}
          className="text-xs text-red-600"
        >
          {message}
        </p>
      )}
    </div>
  );
}
