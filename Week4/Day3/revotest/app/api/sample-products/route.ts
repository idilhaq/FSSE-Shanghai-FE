import { NextResponse } from "next/server";

export type SampleProduct = {
  id: number;
  name: string;
  price: number;
};

// Real backend data source for the "sample" flow.
//
// NOTE: GET and POST live on the SAME path (/api/sample-products). On the
// client side (the POST) we tell them apart in Playwright by inspecting the
// request METHOD, not the URL. See tests/sample-products.spec.ts.
const PRODUCTS: SampleProduct[] = [
  { id: 101, name: "RevoDesk", price: 1990000 },
  { id: 102, name: "RevoChair", price: 2490000 },
  { id: 103, name: "RevoLamp", price: 390000 },
];

// A test seam for the SERVER-SIDE list. Playwright's page.route() only
// intercepts requests made by the BROWSER, so it cannot mock a fetch that
// runs inside a React Server Component. Instead we let the test control the
// server's data source through an env var that Playwright sets on the dev
// server (see playwright.config.ts webServer.env).
function getServerProducts(): SampleProduct[] {
  const raw = process.env.SAMPLE_PRODUCTS_JSON;
  if (raw) {
    try {
      return JSON.parse(raw) as SampleProduct[];
    } catch {
      // fall through to the real data if the override is malformed
    }
  }
  return PRODUCTS;
}

// Server-side list: the product page fetches this during server rendering.
export async function GET() {
  return NextResponse.json(getServerProducts());
}

// Client-side mutation: "Add to cart" posts here from the browser.
// Returns a small cart summary so the UI can confirm the result.
export async function POST(request: Request) {
  const body = (await request.json()) as { productId?: number };
  const product = getServerProducts().find((p) => p.id === body.productId);

  if (!product) {
    return NextResponse.json(
      { ok: false, message: "Product not found" },
      { status: 404 }
    );
  }

  // In a real app this would persist to a cart/session. For the sample we
  // just echo back a confirmation the client can render/assert against.
  return NextResponse.json({
    ok: true,
    message: `${product.name} added to cart`,
    cartCount: 1,
  });
}
