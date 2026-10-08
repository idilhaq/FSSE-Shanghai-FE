'use client'
import Image from "next/image";
// import RootLayout from "./layout";
// import ProductsLayout from "./HandsOn12/products/layout";
import ProductDetailPage from "./HandsOn12/products/page";
import ProductsPage from "./HandsOn1/products/page";
import ProductsLayout from "./HandsOn1/products/layout";
import RootLayout from "./layout";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
// import Link from 'next/link';

// In a real Next.js app, each route below is a separate page.tsx file.
// Here we render them as a "route map" so you can SEE the folder -> URL mapping.

// const ROUTES = [
//   { url: '/', file: 'app/page.tsx', heading: 'Home', backend: 'GET /' },
//   { url: '/products', file: 'app/products/page.tsx', heading: 'Products', backend: 'GET /products' },
//   { url: '/categories', file: 'app/categories/page.tsx', heading: 'Categories', backend: 'GET /categories' },
//   { url: '/orders', file: 'app/orders/page.tsx', heading: 'Orders', backend: 'GET /orders' },
// ];

// export default function RouteMap() {
//   return (
//     <RootLayout>
//       <h1>Home</h1>
//     </RootLayout>
//   );
// }

// app/layout.tsx — ROOT layout (wraps every page)


// app/products/layout.tsx — NESTED layout (product routes only)


// app/products/page.tsx


// export default function App() {
//   return (
//     <Home />
//   );
// }

// function Home() {
//   return <h1>Home</h1>
// }

// Hands On 1 W2D2
// Stand-in for next/link's <Link>. In a real app:
//   import Link from 'next/link';
//   <Link href={href}>{children}</Link>
// Here, clicking does a client-side "transition" by updating state (no reload).
// function Link({ href, onNavigate, children }: { href: any, onNavigate: any, children: any }) {
//   return (
//     <a
//       href={href}
//       onClick={(e) => { e.preventDefault(); onNavigate(href); }}
//       className="text-gray-500 hover:text-black cursor-pointer"
//     >
//       {children}
//     </a>
//   );
// }

// const NAV_LINKS = [
//   { href: '/', label: 'Home' },
//   { href: '/products', label: 'Products' },
//   { href: '/categories', label: 'Categories' },
//   { href: '/orders', label: 'Orders' },
//   { href: '/dashboard', label: 'Dashboard' }
// ];

// export default function App() {
//   const [currentPath, setCurrentPath] = useState('/');

//   return (
//     <div className="font-sans">
//       <header className="flex items-center gap-6 border-b px-6 py-3">
//         <span className="font-bold text-lg">RevoShop</span>
//         <nav className="flex gap-4 text-sm">
//           {NAV_LINKS.map((link) => (
//             <Link key={link.href} href={link.href} onNavigate={setCurrentPath}>
//               {link.label}
//             </Link>
//           ))}
//         </nav>
//       </header>
//       <main className="p-8">
//         <p className="text-gray-400 text-sm">Client-side transition — no page reload</p>
//         <h1 className="text-2xl font-bold">You are on: {currentPath}</h1>
//       </main>
//     </div>
//   );
// }


// const NAV_LINKS = [
//   { href: '/', label: 'Home' },
//   { href: '/products', label: 'Products' },
//   { href: '/categories', label: 'Categories' },
//   { href: '/orders', label: 'Orders' },
//   { href: '/dashboard', label: 'Dashboard' },
// ];

// export default function App() {
//   const [currentPath, setCurrentPath] = useState('/products');
//   console.log(currentPath)

//   // const pathname = usePathname();
//   const pathname = currentPath

//   // TODO Step 2: return true when this link's href is the current path
//   const isActive = (href: any) => href === pathname;
//   console.log(pathname)

//   return (
//     <div className="font-sans">
//       <header className="flex items-center gap-6 border-b px-6 py-3">
//         <span className="font-bold text-lg">RevoShop</span>
//         <nav className="flex gap-4 text-sm">
//           {NAV_LINKS.map((link) => (
//             <a
//               key={link.href}
//               href={link.href}
//               onClick={(e) => { e.preventDefault(); setCurrentPath(link.href); }}
//               className={isActive(link.href)
//                 /* TODO Step 3: active classes (highlighted) */
//                 ? 'cursor-pointer font-semibold text-blue underline'
//                 /* inactive classes (muted) */
//                 : 'text-gray-500 hover:text-black cursor-pointer'}
//             >
//               {link.label}
//             </a>
//           ))}
//         </nav>
//       </header>
//       <main className="p-8">
//         <h1 className="text-2xl font-bold">{currentPath}</h1>
//         <p className="text-gray-500">Current section is highlighted in the nav above</p>
//       </main>
//     </div>
//   );
// }

// const PRODUCTS = [
//   { id: 1, name: 'Laptop Stand', price: 'Rp 250.000', inStock: true },
//   { id: 2, name: 'Wireless Mouse', price: 'Rp 150.000', inStock: true },
//   { id: 3, name: 'USB-C Hub', price: 'Rp 320.000', inStock: false },
// ];

// export default function App() {
//   // Simulated browser URL. router.push(x) sets it; useSearchParams reads from it.
//   const [url, setUrl] = useState('/products');
//   const [query, setQuery] = useState('');

//   // Stands in for: const router = useRouter(); router.push(target);
//   const navigate = (target: string) => setUrl(target);

//   // Stands in for: const params = useSearchParams(); params.get('search');
//   const searchParam = url.includes('?search=')
//     ? decodeURIComponent(url.split('?search=')[1])
//     : '';

//   const visible = searchParam
//     ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(searchParam.toLowerCase()))
//     : PRODUCTS;

//   const onKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter') {
//       // TODO Step 2: push to /products?search=<query>
//       navigate(`/products?search=${query}`);
//     }
//   };

//   return (
//     <div className="font-sans p-6">
//       <p className="text-gray-400 font-mono text-xs mb-3">localhost:3000{url}</p>
//       <input
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         onKeyDown={onKeyDown}
//         placeholder="Search products..."
//         className="w-full border rounded-lg px-3 py-2 mb-3"
//       />
//       {/* TODO Step 4: when searchParam is set, show a "Filtering by" label */}
//       <p>Filtering by {query}</p>
//       <div className="grid gap-3">
//         {visible.map((p) => (
//           <div key={p.id} className="border rounded-lg p-4">
//             <h2 className="font-semibold">{p.name}</h2>
//             <p className="text-gray-600 text-sm">{p.price}</p>
//             <span className={p.inStock
//               ? 'text-xs text-green-700 bg-green-100 rounded px-2 py-0.5'
//               : 'text-xs text-red-700 bg-red-100 rounded px-2 py-0.5'}>
//               {p.inStock ? 'In stock' : 'Out of stock'}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/categories', label: 'Categories' },
  { href: '/orders', label: 'Orders' },
  { href: '/dashboard', label: 'Dashboard' },
];

const PRODUCTS = [
  { id: 1, name: 'Laptop Stand', price: 'Rp 250.000', inStock: true },
  { id: 2, name: 'Wireless Mouse', price: 'Rp 150.000', inStock: true },
  { id: 3, name: 'USB-C Hub', price: 'Rp 320.000', inStock: false },
];

export default function App() {
  // Simulated browser URL: nav links + the SearchBar both update this.
  const [url, setUrl] = useState('/products');
  const [query, setQuery] = useState('');

  // Stands in for usePathname(): the path part of the url, without the query string.
  const pathname = url.split('?')[0];

  // Stands in for useSearchParams().get('search').
  const search = url.includes('?search=')
    ? decodeURIComponent(url.split('?search=')[1])
    : '';

  // TODO 1: const isActive = (href) => ... compare href to pathname
  const isActive = (href: string) => href === pathname

  // TODO 2: const visible = search ? PRODUCTS.filter(...) : PRODUCTS
  const visible = search ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : PRODUCTS

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // TODO 3: navigate to /products?search=<query>  (setUrl(...))
      setUrl(`/products?search=${query}`)
    }
  };

  return (
    <div className="font-sans">
      {/* TODO 4: NavBar — brand "RevoShop" + the five NAV_LINKS,
                  active link highlighted via isActive(link.href).
                  Clicking a link should setUrl(link.href). */}
      <header className="flex items-center gap-6 border-b px-6 py-3">
        <span className="font-bold text-lg">RevoShop</span>
        <nav className="flex gap-4 text-sm">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={(e) => { e.preventDefault(); setUrl(link.href); }}
              className={isActive(link.href)
                ? 'cursor-pointer font-semibold text-blue-600 underline'
                : 'text-gray-500 hover:text-black cursor-pointer'}>
              {link.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="p-6">
        <p className="text-gray-400 font-mono text-xs mb-3">localhost:3000{url}</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search products..."
          className="w-full border rounded-lg px-3 py-2 mb-3"
        />
        <p>Filtering by: {query}</p>

        {/* TODO 6: render a card for each product in "visible":
                    name, price, and an In stock / Out of stock badge */}
        {visible.map((p) => (
          <div key={p.id} className="border rounded-lg p-4">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-600 text-sm">{p.price}</p>
            <span className={p.inStock
              ? 'text-xs text-green-700 bg-green-100 rounded px-2 py-0.5'
              : 'text-xs text-red-700 bg-red-100 rounded px-2 py-0.5'}>
              {p.inStock ? 'In stock' : 'Out of stock'}
            </span>
          </div>
        ))}
      </main>
    </div >
  );
}