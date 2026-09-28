function Product({ name, price }: { name: string; price: number }) {
  return (
    <div className="border border-gray-700 rounded p-4 w-56">
      <div className="bg-gray-800 h-24 flex items-center justify-center rounded mb-3">
        img
      </div>
      <h3 className="font-bold">{name}</h3>
      <p className="text-gray-400">Rp {price.toLocaleString("id-ID")}</p>
    </div>
  );
}

const products = [
  { id: 1, name: "Product A", price: 120000 },
  { id: 2, name: "Product B", price: 85000 },
  { id: 3, name: "Product C", price: 200000 },
  { id: 4, name: "Product D", price: 500000 },
];

export function ProductCards() {
  return (
    <div className="flex flex-wrap gap-4">
      {products.map(product => (
        <Product key={product.id} name={product.name} price={product.price}/>
      ))}
    </div>
  )
}