// DummyJSON product/category service. https://dummyjson.com/docs/products

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

/** Shape of DummyJSON's paginated list envelope. */
export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ListOptions {
  limit?: number;
  skip?: number;
  /** Field to sort by, e.g. 'price' or 'title'. */
  sortBy?: string;
  order?: 'asc' | 'desc';
}

import { cache } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dummyjson.com';

// Revalidation window (in seconds) for ISR; configurable via env, defaults to 1 hour.
const REVALIDATE_SECONDS = Number(process.env.NEXT_PUBLIC_API_REVALIDATE_SECONDS ?? 3600);

const fetchOpts = { next: { revalidate: REVALIDATE_SECONDS } } as const;

function buildQuery(opts: ListOptions = {}): string {
  const params = new URLSearchParams();
  if (opts.limit != null) params.set('limit', String(opts.limit));
  if (opts.skip != null) params.set('skip', String(opts.skip));
  if (opts.sortBy) params.set('sortBy', opts.sortBy);
  if (opts.order) params.set('order', opts.order);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchProducts(opts: ListOptions = {}): Promise<ProductListResponse> {
  const res = await fetch(`${BASE_URL}/products${buildQuery(opts)}`, fetchOpts);
  if (!res.ok) {
    throw new Error('Failed to fetch products listing from DummyJSON');
  }
  return res.json();
}

// Wrapped in React cache() so a single request (e.g. a page + its generateMetadata)
// that looks up the same product only triggers one upstream fetch.
export const fetchProductById = cache(async (id: string | number): Promise<Product> => {
  const res = await fetch(`${BASE_URL}/products/${id}`, fetchOpts);
  if (!res.ok) {
    throw new Error(`Failed to fetch product metadata for ID: ${id}`);
  }
  const data = await res.json();
  if (!data || !data.id) throw new Error('Product lookup returned empty.');
  return data;
});

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/products/categories`, fetchOpts);
  if (!res.ok) {
    throw new Error('Failed to fetch categories from DummyJSON');
  }
  return res.json();
}

export async function fetchProductsByCategory(
  slug: string,
  opts: ListOptions = {}
): Promise<ProductListResponse> {
  const res = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(slug)}${buildQuery(opts)}`,
    fetchOpts
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch products for category: ${slug}`);
  }
  return res.json();
}

export async function searchProducts(
  query: string,
  opts: ListOptions = {}
): Promise<ProductListResponse> {
  const params = new URLSearchParams(buildQuery(opts).replace(/^\?/, ''));
  params.set('q', query);
  const res = await fetch(`${BASE_URL}/products/search?${params.toString()}`, fetchOpts);
  if (!res.ok) {
    throw new Error(`Failed to search products for: ${query}`);
  }
  return res.json();
}
