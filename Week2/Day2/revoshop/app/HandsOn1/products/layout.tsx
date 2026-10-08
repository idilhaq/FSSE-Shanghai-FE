export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    // TODO: render breadcrumb "RevoShop › Products", then {children}
    return (
        <section>
            <nav className="px-6 pt-3 text-sm text-gray-500">RevoShop › Products</nav>
            {children}
        </section>
    );
}