import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

// /go/<slug>: conta o clique e redireciona para o checkout da Hotmart.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) return NextResponse.redirect(new URL("/cursos", request.url));

  const ref = adminDb.doc(`products/${slug}`);
  const snap = await ref.get();
  const data = snap.data();
  if (!snap.exists || data?.published !== true || !/^https:\/\//.test(data?.hotmartUrl ?? "")) {
    return NextResponse.redirect(new URL("/cursos", request.url));
  }

  // não bloqueia o redirecionamento se a contagem falhar
  await ref.update({ clicks: FieldValue.increment(1) }).catch(() => {});

  // repassa utm_* e src para a Hotmart
  const target = new URL(data.hotmartUrl);
  for (const [k, v] of new URL(request.url).searchParams) {
    if (k.startsWith("utm_") || k === "src") target.searchParams.set(k, v);
  }
  return NextResponse.redirect(target, 302);
}
