import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { adminDb } from "./firebase/admin";
import type { Product } from "./types";

export const PRODUCTS_TAG = "products";

function toProduct(id: string, d: FirebaseFirestore.DocumentData): Product {
  return {
    id,
    slug: id,
    title: d.title ?? "",
    summary: d.summary ?? "",
    description: d.description ?? "",
    coverUrl: d.coverUrl ?? "",
    priceLabel: d.priceLabel ?? "",
    hotmartUrl: d.hotmartUrl ?? "",
    published: d.published === true,
    order: typeof d.order === "number" ? d.order : 0,
  };
}

// ---- Público (cacheado; admin invalida a tag ao salvar) ----

export async function getPublishedProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");
  try {
    const snap = await adminDb.collection("products").where("published", "==", true).get();
    return snap.docs.map((d) => toProduct(d.id, d.data())).sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export async function getPublishedProduct(slug: string): Promise<Product | null> {
  "use cache";
  cacheTag(PRODUCTS_TAG);
  cacheLife("hours");
  try {
    const snap = await adminDb.doc(`products/${slug}`).get();
    if (!snap.exists || snap.data()?.published !== true) return null;
    return toProduct(snap.id, snap.data()!);
  } catch {
    return null;
  }
}

// ---- Admin (sem cache; chamar só após validar admin) ----

export async function getAllProducts(): Promise<(Product & { clicks: number })[]> {
  await connection(); // sempre em tempo de requisição
  const snap = await adminDb.collection("products").get();
  return snap.docs
    .map((d) => ({ ...toProduct(d.id, d.data()), clicks: Number(d.data().clicks ?? 0) }))
    .sort((a, b) => a.order - b.order);
}

export async function getProductForAdmin(id: string): Promise<Product | null> {
  await connection();
  const snap = await adminDb.doc(`products/${id}`).get();
  return snap.exists ? toProduct(snap.id, snap.data()!) : null;
}
