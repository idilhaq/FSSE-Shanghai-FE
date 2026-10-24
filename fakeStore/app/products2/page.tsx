import { Product } from "@/services/dummyjson";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export const revalidate = 60; // rebuild at most once per 60s

export default async function ProductsPage() {
    const res = await fetch('https://dummyjson.com/products');
    const products: Product[] = await res.json();
    return (
        <ul>
            <p>p</p>
        </ul >
    );
}