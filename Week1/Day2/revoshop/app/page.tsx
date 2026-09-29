import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCards } from "./components/Product";

export default function Home() {
  return (
    <main className="p-8">
      <Header />
      <ProductCards />
      <Footer />
    </main>
  );
}
