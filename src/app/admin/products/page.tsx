import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export const metadata = { title: "Produtos" };

export default async function ProductsAdminPage() {
  const products = await getAllProducts();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <Link href="/admin/products/new" className="rounded-lg bg-primary px-4 py-2 font-semibold text-white">
          Novo produto
        </Link>
      </div>
      {products.length === 0 && <p className="text-neutral-500">Nenhum produto ainda.</p>}
      <ul className="space-y-2">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between rounded-xl bg-white p-4 shadow hover:shadow-md">
              <div>
                <strong>{p.title}</strong>
                <p className="text-sm text-neutral-500">/cursos/{p.slug} · {p.clicks} cliques na Hotmart</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${p.published ? "bg-green-100 text-green-800" : "bg-neutral-200 text-neutral-600"}`}>
                {p.published ? "Publicado" : "Rascunho"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
