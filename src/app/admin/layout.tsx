import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

// A leitura do cookie fica dentro do Suspense (exigência do Cache Components).
async function AdminGate({ children }: { children: React.ReactNode }) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col bg-neutral-100 text-neutral-800">
      <header className="flex items-center justify-between bg-white px-6 py-3 shadow">
        <nav className="flex gap-5 font-medium">
          <Link href="/admin">Painel</Link>
          <Link href="/admin/products">Produtos</Link>
          <Link href="/admin/appearance">Aparência</Link>
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span>{user.email}</span>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto w-full max-w-3xl flex-1 p-6">{children}</div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<p className="p-6">Carregando…</p>}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}
