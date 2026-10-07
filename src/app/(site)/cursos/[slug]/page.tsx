import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getPublishedProduct } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPublishedProduct(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    openGraph: { title: p.title, description: p.summary, images: p.coverUrl ? [p.coverUrl] : [] },
  };
}

async function Course({ params }: Props) {
  const { slug } = await params;
  const p = await getPublishedProduct(slug);
  if (!p) notFound();

  return (
    <main className="bg-stone-50 px-5 py-16">
      <article className="mx-auto max-w-3xl space-y-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.coverUrl && <img src={p.coverUrl} alt={p.title} className="w-full rounded-2xl shadow-md" />}
        <h1 className="text-4xl font-bold text-heading">{p.title}</h1>
        <p className="text-lg text-foreground">{p.summary}</p>
        <div className="space-y-4 leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-heading [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-heading">
          <ReactMarkdown>{p.description}</ReactMarkdown>
        </div>
        <div className="sticky bottom-4 flex items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-xl">
          <span className="font-bold text-heading">{p.priceLabel}</span>
          <a href={`/go/${p.slug}`} className="rounded-lg bg-primary px-8 py-3 font-semibold text-white hover:brightness-110">
            Quero este curso
          </a>
        </div>
      </article>
    </main>
  );
}

export default function CoursePage(props: Props) {
  return (
    <Suspense fallback={<main className="p-16 text-center">Carregando…</main>}>
      <Course {...props} />
    </Suspense>
  );
}
