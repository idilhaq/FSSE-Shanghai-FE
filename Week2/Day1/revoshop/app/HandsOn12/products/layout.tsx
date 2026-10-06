export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <section>
            <nav className="text-sm text-gray-500">RevoShop › Products</nav>
            {children}
        </section>
    );
}
