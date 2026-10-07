import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";
import { getPublishedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export default async function Home() {
  const [s, products] = await Promise.all([getSiteSettings(), getPublishedProducts()]);
  return (
    <main>
      <section className="bg-background px-5 py-24 text-center text-stone-100">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold sm:text-6xl">{s.siteName}</h1>
          {s.tagline && <p className="text-lg text-stone-300">{s.tagline}</p>}
          <Link href="/cursos" className="inline-block rounded-full bg-secondary px-8 py-3 font-semibold text-black hover:brightness-110">
            Ver cursos
          </Link>
        </div>
      </section>

      <section className="bg-stone-50 px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-3xl font-bold text-heading">Cursos</h2>
          {products.length === 0 ? (
            <p className="text-foreground">Em breve novos cursos.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
