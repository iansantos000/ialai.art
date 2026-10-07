"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { PRODUCTS_TAG } from "@/lib/products";

const imageUrl = z
  .string()
  .max(2000)
  .refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "URL de imagem inválida");

const schema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: só letras minúsculas, números e hífen").max(80),
  title: z.string().min(1, "Informe o título").max(120),
  summary: z.string().max(300),
  description: z.string().max(20000),
  coverUrl: imageUrl,
  priceLabel: z.string().max(80),
  hotmartUrl: z.string().regex(/^https:\/\/.+/, "O link da Hotmart deve começar com https://").max(2000),
  published: z.boolean(),
  order: z.number().int().min(0).max(9999),
});

export type ActionResult = { ok: boolean; error?: string };

export async function saveProduct(input: unknown, isNew: boolean): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: "Não autorizado" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  const { slug, ...data } = parsed.data;
  const ref = adminDb.doc(`products/${slug}`);
  if (isNew && (await ref.get()).exists) return { ok: false, error: "Já existe um produto com esse slug" };

  // merge preserva o contador de cliques
  await ref.set(data, { merge: true });
  updateTag(PRODUCTS_TAG);
  return { ok: true };
}

export async function deleteProduct(slug: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return { ok: false, error: "Não autorizado" };
  if (!/^[a-z0-9-]+$/.test(slug)) return { ok: false, error: "Slug inválido" };
  await adminDb.doc(`products/${slug}`).delete();
  updateTag(PRODUCTS_TAG);
  return { ok: true };
}
