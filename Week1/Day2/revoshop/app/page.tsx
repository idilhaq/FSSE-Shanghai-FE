import Image from "next/image";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ProductCards } from "./components/Product";
import { PageSection } from "./components/PageSection";
import { Modal } from "./components/Modal";

export default function Home() {
  return (
    <main className="p-8">
      <Header />
      <PageSection title="Products" children={<ProductCards />} />
      <Modal header="Confirm order" children={<>Proceed to checkout?</>} />
      <Footer />
    </main>
  );
}
