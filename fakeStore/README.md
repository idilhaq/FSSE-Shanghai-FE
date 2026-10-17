# FakeStore — a Next.js feature demo

A small e-commerce sample built to **demonstrate Next.js (App Router) and TypeScript features**: file-based routing, the server/client component split, data fetching with caching, route protection, and typed React Context. Product data comes from the [DummyJSON API](https://dummyjson.com).

> Built with **Next.js 16.3.8** (App Router + Turbopack) and **React 19**. Next.js 16 renamed Middleware to **Proxy** and made dynamic `params`/`searchParams` **async (Promises)** — this project uses the new conventions.

## Getting started

```bash
npm install
npm run dev     # dev server (Turbopack)
npm run build   # production build
npm run lint    # eslint
```

Open [http://localhost:3000](http://localhost:3000).

Environment variables live in `.env` (see `.env.example`):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | public | DummyJSON base URL |
| `NEXT_PUBLIC_API_REVALIDATE_SECONDS` | public | ISR revalidation window |
| `SESSION_COOKIE_NAME` | server | auth cookie name |
| `SESSION_TOKEN_PREFIX` | server | session token scheme |
| `SESSION_MAX_AGE_SECONDS` | server | session lifetime |

`NEXT_PUBLIC_`-prefixed vars are exposed to the browser; the rest stay server-only.

## Project structure

```
app/                         # App Router: folders = routes
├── layout.tsx               # Root layout — wraps app in Auth + Cart providers
├── page.tsx                 # "/" home (Server Component, ISR)
├── globals.css              # global styles + Tailwind
├── login/page.tsx           # "/login"
├── admin/page.tsx           # "/admin" (role-gated)
├── cart/page.tsx            # "/cart" (Client Component)
├── products/
│   ├── layout.tsx           # nested layout + static metadata
│   ├── page.tsx             # "/products" catalog (Server Component)
│   ├── loading.tsx          # Suspense skeleton for the catalog
│   ├── error.tsx            # error boundary for the segment
│   └── [id]/                # dynamic route segment
│       ├── page.tsx         # "/products/:id" (SSG + ISR)
│       ├── layout.tsx       # generateMetadata (dynamic SEO)
│       ├── loading.tsx      # detail skeleton
│       └── error.tsx        # detail error boundary
└── api/auth/
    ├── login/route.tsx      # POST /api/auth/login (Route Handler)
    └── logout/route.tsx     # POST /api/auth/logout
components/                  # reusable UI (client islands + presentational)
context/                     # typed React Context providers
services/                   # data layer + config (pure TS, no React)
proxy.tsx                   # request gateway (formerly "middleware")
next.config.ts              # typed Next config
```

The core idea: **a folder under `app/` is a route**, and the special files (`page`, `layout`, `loading`, `error`, `route`) each have a defined role in the segment.

## Next.js features demonstrated

### File-based routing (App Router)
- **Routes from folders** — each directory with a `page.tsx` becomes a URL segment.
- **Dynamic segments** — `app/products/[id]/page.tsx` matches `/products/123`.
- **Nested layouts** — `app/products/layout.tsx` wraps all product routes; the root `layout.tsx` wraps everything. Layouts persist across navigation.
- **Route Handlers** — `app/api/auth/login/route.tsx` exports a `POST` function, giving API endpoints inside the App Router.

### Special files per segment
- **`loading.tsx`** — automatic Suspense boundary; shown while the server component streams. Used for the catalog and detail skeletons.
- **`error.tsx`** — client-side error boundary (`'use client'`) with a `reset()` handler to retry a failed segment.
- **`not-found`** — the detail page calls `notFound()` for invalid product IDs.

### Server vs. Client Components
- **Server Components by default** — `app/products/page.tsx` and `app/products/[id]/page.tsx` fetch data on the server; no client JS shipped for them.
- **Client Components (`'use client'`)** — only the genuinely interactive pieces: `Navbar`, `AddToCartPanel`, `QuantitySelector`, the cart page, and the context providers.
- **Client islands** — the product detail page is a Server Component that renders a small client island (`AddToCartPanel`) for the add-to-cart interaction, keeping most of the page static HTML.

### Data fetching & caching
- **Server-side `fetch` with ISR** — `services/dummyjson.ts` uses `fetch(url, { next: { revalidate } })` so pages are cached and periodically regenerated.
- **Request memoization** — `fetchProductById` is wrapped in React's `cache()` so the page and its `generateMetadata` share one upstream request.
- **Static generation + ISR** — `generateStaticParams` in `[id]/page.tsx` prerenders a batch of product pages at build time; the rest render on demand and cache (shown as `●`/`ƒ` in the build output).
- **Parallel fetching** — the catalog loads categories and products together with `Promise.all` to avoid a request waterfall.

### Routing dynamics (Next.js 16)
- **Async `params`** — `const { id } = await params` in Server Components; `use(params)` in Client Components.
- **Async `searchParams`** — the catalog reads `?category=` via `await searchParams` to filter server-side.
- **`next/link`** — client-side navigation with prefetching.

### Metadata & SEO
- **Static metadata** — `app/products/layout.tsx` exports a typed `metadata` object.
- **Dynamic metadata** — `app/products/[id]/layout.tsx` uses `generateMetadata` to build per-product titles/descriptions from fetched data.

### Proxy (request gateway)
- **`proxy.tsx`** (Next.js 16's renamed Middleware) guards routes before they render: it redirects unauthenticated users away from `/products` and non-admins away from `/admin`, using a `matcher` config to scope which paths it runs on.

### Images & assets
- **`next/image`** — product images use `<Image>` with `fill`/`sizes` and `priority` for the detail hero, giving automatic optimization and lazy loading. The DummyJSON CDN is allowlisted via `remotePatterns` in `next.config.ts`.

### Configuration
- **Typed config** — `next.config.ts` is TypeScript (`NextConfig`) and declares `images.remotePatterns`.
- **Environment variables** — public (`NEXT_PUBLIC_`) vs. server-only split, centralized in `services/`.

## TypeScript features demonstrated

- **Typed domain models** — `services/dummyjson.ts` defines `Product`, `Category`, `ProductListResponse`, etc., so API data is typed end to end.
- **Generic React Context** — `AuthContext` and `CartContext` are typed with explicit context interfaces, and their `useAuth`/`useCart` hooks throw if used outside a provider.
- **Union types** — `type Role = 'guest' | 'customer' | 'admin'` models user roles.
- **Typed component props** — e.g. `QuantitySelector`'s props interface drives its validation (`min`/`max`/`value`).
- **Promise-typed route props** — `params: Promise<{ id: string }>` matches Next.js 16's async routing.
- **Utility types** — `Pick`, `Awaited<ReturnType<...>>`, `React.CSSProperties`, and `as const` appear across the data and UI layers.
- **Path aliases** — `@/*` imports (configured in `tsconfig.json`) instead of brittle relative paths.
- **`strict` mode** — the project compiles under TypeScript strict settings.

## App features (what the demo actually does)

- Browse a product catalog with **category filtering** (`/products?category=...`).
- View rich **product detail** pages (gallery, discount, rating, stock).
- **Per-user cart** persisted in `localStorage`, keyed by the signed-in account.
- **Quantity selector with validation** — can't exceed stock or drop below the minimum order quantity; buttons disable at the limits.
- **Mock auth + role-based access** — sign in as a customer or admin; the Proxy and client guards enforce access to `/products` and `/admin`.

> The cart is intentionally client-side (`localStorage`) and auth is a mock cookie scheme — both are kept simple to keep the focus on the Next.js/TypeScript patterns above.
