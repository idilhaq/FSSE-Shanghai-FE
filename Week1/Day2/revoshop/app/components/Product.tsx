import { Badge } from "./Badge";
import { Card } from "./Card";

interface Product {
  id: number;
  name: string;
  price: number;
  in_stock: boolean;
  location?: string;
  originalPrice?: number;
}

interface ProductProps {
  product: Product;
  currency?: string;
  featured?: boolean;
}

function Product({ product, currency = "Rp", featured = false }: ProductProps) {
  return (
    <div className={"border border-gray-700 rounded-lg p-4 w-56 " + (featured ? "ring-2 ring-blue-500" : "")}>
      <div className="bg-gray-800 h-24 flex items-center justify-center rounded mb-3">
        img
      </div>
      <h3 className="font-bold">{product.name}</h3>
      {product.originalPrice && (
        <p className="text-gray-400 line-through">{currency} {product.originalPrice.toLocaleString("id-ID")}</p>
      )}
      <p className="text-gray-400">{currency} {product.price.toLocaleString("id-ID")}</p>
      <Badge variant={product.in_stock ? "in-stock" : "out-of-stock"} />
    </div>
  );
}

const products = [
  { id: 1, name: "Laptop Stand", price: 250000, in_stock: true },
  { id: 2, name: "Keyboard", price: 450000, in_stock: false },
  { id: 3, name: "Mouse", price: 150000, in_stock: true, originalPrice: 200000 },
];

export function ProductCards() {
  return (
    <div className="flex flex-wrap gap-4">
      <Card children=
        {products.map(prd => (
          <Product key={prd.id} product={prd} />
        ))}
      />
    </div>
  )
}