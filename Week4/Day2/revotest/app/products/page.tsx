
export default function ProductsPage() {
    const products = [
        { id: 1, name: 'Laptop Stand', price: '$29.99' },
        { id: 2, name: 'Wireless Mouse', price: '$19.99' },
        { id: 3, name: 'Mechanical Keyboard', price: '$79.99' },
    ];

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
                <a href="/" className="text-xl font-bold text-blue-600">
                    RevoShop
                </a>

                <div className="flex gap-6">
                    <a href="/">Home</a>
                    <a href="/products" aria-current="page" className="font-semibold text-blue-600">
                        Products
                    </a>
                    <a href="/categories">Categories</a>
                    <a href="/login">Login</a>
                </div>
            </nav>

            <section className="mx-auto max-w-5xl px-6 py-12">
                <h1 className="text-3xl font-bold">Products</h1>

                <p className="mt-2 text-gray-600">
                    Explore our latest products.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <article
                            key={product.id}
                            data-testid="product-card"
                            className="rounded-xl border bg-white p-6 shadow-sm"
                        >
                            <h2 className="text-lg font-semibold">{product.name}</h2>
                            <p className="mt-2 text-gray-600">{product.price}</p>
                        </article>
                    ))}
                </div>

                <a
                    href="/"
                    className="mt-8 inline-block text-blue-600 hover:underline"
                >
                    Back to Home
                </a>
            </section>
        </main>
    );
}
