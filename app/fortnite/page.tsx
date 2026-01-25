import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/data/products";


export default function FortnitePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-4xl font-extrabold text-white">Fortnite</h1>
      <p className="mt-2 text-white/60">Select a service and customize your order.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {PRODUCTS.map((p) => (
          <ProductCard key={p.slug} p={p} />
        ))}
      </div>
    </div>
  );
}
