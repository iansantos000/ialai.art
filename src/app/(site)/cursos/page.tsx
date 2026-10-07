import { getPublishedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const metadata = { title: "Cursos" };

export default async function CoursesPage() {
  const products = await getPublishedProducts();
  return (
    <main className="bg-stone-50 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold text-heading">Cursos</h1>
        {products.length === 0 ? (
          <p className="text-foreground">Em breve novos cursos.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </main>
  );
}
