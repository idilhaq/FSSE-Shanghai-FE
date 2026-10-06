
import Image from "next/image";
// import RootLayout from "./layout";
// import ProductsLayout from "./HandsOn12/products/layout";
import ProductDetailPage from "./HandsOn12/products/page";
import ProductsPage from "./products/page";
import ProductsLayout from "./products/layout";
import RootLayout from "./layout";

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


export default function App() {
  return (
    <Home />
  );
}

function Home() {
  return <h1>Home</h1>
}