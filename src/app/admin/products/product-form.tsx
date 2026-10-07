"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import type { Product } from "@/lib/types";
import { deleteProduct, saveProduct } from "./actions";

const EMPTY: Product = {
  id: "",
  slug: "",
  title: "",
  summary: "",
  description: "",
  coverUrl: "",
  priceLabel: "",
  hotmartUrl: "",
  published: false,
  order: 0,
};

function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({ initial }: { initial?: Product }) {
  const router = useRouter();
  const isNew = !initial;
  const [p, setP] = useState<Product>(initial ?? EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  async function uploadCover(file: File) {
    setUploading(true);
    setError("");
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const r = ref(storage, `public/products/${crypto.randomUUID()}.${ext}`);
      await uploadBytes(r, file, { contentType: file.type });
      const url = await getDownloadURL(r);
      setP((prev) => ({ ...prev, coverUrl: url }));
    } catch {
      setError("Falha no upload da capa (máx. 10MB).");
    } finally {
      setUploading(false);
    }
  }

  function save() {
    setError("");
    startTransition(async () => {
      const { id: _id, ...data } = p;
      void _id;
      const res = await saveProduct(data, isNew);
      if (!res.ok) return setError(res.error ?? "Erro ao salvar");
      router.push("/admin/products");
      router.refresh();
    });
  }

  function remove() {
    if (!confirm("Excluir este produto definitivamente?")) return;
    startTransition(async () => {
      const res = await deleteProduct(p.slug);
      if (!res.ok) return setError(res.error ?? "Erro ao excluir");
      router.push("/admin/products");
      router.refresh();
    });
  }

  const input = "w-full rounded-lg border border-neutral-300 px-3 py-2";

  return (
    <div className="space-y-4 rounded-xl bg-white p-5 shadow">
      <label className="block text-sm">
        Título
        <input
          className={input}
          value={p.title}
          onChange={(e) => {
            const title = e.target.value;
            setP((prev) => ({ ...prev, title, slug: isNew && !slugTouched ? slugify(title) : prev.slug }));
          }}
        />
      </label>
      <label className="block text-sm">
        Slug (endereço: /cursos/…) {!isNew && <em className="text-neutral-500">— não editável</em>}
        <input
          className={input}
          value={p.slug}
          disabled={!isNew}
          onChange={(e) => {
            setSlugTouched(true);
            setP({ ...p, slug: slugify(e.target.value) });
          }}
        />
      </label>
      <label className="block text-sm">
        Resumo (aparece no card)
        <textarea className={input} rows={2} value={p.summary} onChange={(e) => setP({ ...p, summary: e.target.value })} />
      </label>
      <label className="block text-sm">
        Descrição completa (Markdown)
        <textarea className={`${input} font-mono`} rows={12} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} />
      </label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-32 items-center justify-center overflow-hidden rounded border bg-neutral-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.coverUrl ? <img src={p.coverUrl} alt="" className="h-full w-full object-cover" /> : <span className="text-xs text-neutral-400">sem capa</span>}
        </div>
        <label className="flex-1 text-sm">
          Capa {uploading && "— enviando…"}
          <input type="file" accept="image/*" className="mt-1 block w-full" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0])} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          Preço exibido (só texto)
          <input className={input} placeholder="12x de R$ 29,90" value={p.priceLabel} onChange={(e) => setP({ ...p, priceLabel: e.target.value })} />
        </label>
        <label className="block text-sm">
          Ordem (menor aparece primeiro)
          <input className={input} type="number" min={0} value={p.order} onChange={(e) => setP({ ...p, order: Number(e.target.value) || 0 })} />
        </label>
      </div>
      <label className="block text-sm">
        Link de checkout da Hotmart
        <input className={input} placeholder="https://pay.hotmart.com/..." value={p.hotmartUrl} onChange={(e) => setP({ ...p, hotmartUrl: e.target.value })} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={p.published} onChange={(e) => setP({ ...p, published: e.target.checked })} />
        Publicado (visível no site)
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex items-center justify-between">
        <button onClick={save} disabled={pending || uploading} className="rounded-lg bg-primary px-6 py-2 font-semibold text-white disabled:opacity-60">
          {pending ? "Salvando…" : "Salvar"}
        </button>
        {!isNew && (
          <button onClick={remove} disabled={pending} className="text-sm text-red-600 underline">
            Excluir
          </button>
        )}
      </div>
    </div>
  );
}
