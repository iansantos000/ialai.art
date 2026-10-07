import Link from "next/link";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/cursos/${product.slug}`} className="block aspect-video overflow-hidden bg-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {product.coverUrl && <img src={product.coverUrl} alt={product.title} className="h-full w-full object-cover transition group-hover:scale-105" />}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold text-heading">{product.title}</h3>
        <p className="flex-1 text-sm text-foreground">{product.summary}</p>
        {product.priceLabel && <p className="font-semibold text-heading">{product.priceLabel}</p>}
        <div className="mt-2 flex gap-2">
          <Link href={`/cursos/${product.slug}`} className="flex-1 rounded-lg border border-heading px-4 py-2 text-center text-sm font-semibold text-heading">
            Saiba mais
          </Link>
          <a href={`/go/${product.slug}`} className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-white">
            Comprar
          </a>
        </div>
      </div>
    </article>
  );
}
