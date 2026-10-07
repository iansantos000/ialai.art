import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Painel</h1>
      <Link
        href="/admin/appearance"
        className="block rounded-xl bg-white p-5 shadow hover:shadow-md"
      >
        <strong>Aparência</strong>
        <p className="text-sm text-neutral-500">Cores, logos, favicon, WhatsApp e redes sociais.</p>
      </Link>
      <Link
        href="/admin/products"
        className="block rounded-xl bg-white p-5 shadow hover:shadow-md"
      >
        <strong>Produtos</strong>
        <p className="text-sm text-neutral-500">Cursos à venda, com redirecionamento para a Hotmart.</p>
      </Link>
      <p className="text-sm text-neutral-500">Blog: em breve.</p>
    </div>
  );
}
