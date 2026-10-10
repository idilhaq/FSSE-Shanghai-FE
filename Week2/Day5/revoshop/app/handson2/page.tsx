import { ProductList } from "./ProductList";

export interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    categoryId: number;
}

export interface Category {
    id: number;
    name: string;
}

const DB: Product[] = [
    { id: 1, name: 'Laptop Stand', price: 250000, inStock: true, categoryId: 2 },
    { id: 2, name: 'Mouse', price: 150000, inStock: true, categoryId: 1 },
    { id: 3, name: 'Keyboard', price: 450000, inStock: true, categoryId: 1 },
    { id: 4, name: 'USB-C Hub', price: 320000, inStock: true, categoryId: 2 },
    { id: 5, name: 'Webcam', price: 540000, inStock: true, categoryId: 1 },
];



export default function App() {
    // Simulates the Server Component parent passing the fetched list down as a prop.
    return <ProductList initialProducts={DB} />;
}