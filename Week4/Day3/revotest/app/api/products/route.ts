import { NextResponse } from "next/server";

export type Product = {
  id: number;
  name: string;
  price: number;
};

// Real backend data source. In the Playwright test we intercept this
// request with page.route() and fulfill it with mocked products instead.
const PRODUCTS: Product[] = [
  { id: 1, name: "RevoBook Pro", price: 12990000 },
  { id: 2, name: "RevoPad Mini", price: 4590000 },
  { id: 3, name: "RevoMouse", price: 290000 },
];

export async function GET() {
  return NextResponse.json(PRODUCTS);
}
