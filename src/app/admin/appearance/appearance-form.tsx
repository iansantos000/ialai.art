"use client";

import { useState, useTransition } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase/client";
import type { SiteSettings } from "@/lib/types";
import { saveSettings } from "./actions";

const COLOR_LABELS: Record<keyof SiteSettings["colors"], string> = {
  primary: "Cor primária (botões/destaques)",
  secondary: "Cor secundária",
  background: "Fundo do site",
  foreground: "Texto do corpo",
  heading: "Títulos",
};

type ImageKey = "logoUrl" | "logoDarkUrl" | "faviconUrl";
const IMAGE_LABELS: Record<ImageKey, string> = {
  logoUrl: "Logo",
  logoDarkUrl: "Logo (versão para fundo escuro)",
  faviconUrl: "Favicon",
};

export function AppearanceForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [uploading, setUploading] = useState<ImageKey | null>(null);
  const [pending, startTransition] = useTransition();

  async function upload(key: ImageKey, file: File) {
    setUploading(key);
    setMsg(null);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
      const r = ref(storage, `public/branding/${key}-${crypto.randomUUID()}.${ext}`);
      await uploadBytes(r, file, { contentType: file.type });
      const url = await getDownloadURL(r);
      setS((p) => ({ ...p, [key]: url }));
    } catch {
      setMsg({ ok: false, text: "Falha no upload (precisa estar logado como admin, máx. 10MB)." });
    } finally {
      setUploading(null);
    }
  }

  function save() {
    startTransition(async () => {
      const res = await saveSettings(s);
      setMsg(res.ok ? { ok: true, text: "Salvo! O site já usa as novas configurações." } : { ok: false, text: res.error ?? "Erro" });
    });
  }

  const input = "w-full rounded-lg border border-neutral-300 px-3 py-2";

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">Identidade</h2>
        <input className={input} placeholder="Nome do site" value={s.siteName} onChange={(e) => setS({ ...s, siteName: e.target.value })} />
        <input className={input} placeholder="Frase de apresentação (SEO)" value={s.tagline} onChange={(e) => setS({ ...s, tagline: e.target.value })} />
      </section>

      <section className="space-y-3 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">Cores</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(COLOR_LABELS) as (keyof SiteSettings["colors"])[]).map((k) => (
            <label key={k} className="flex items-center gap-3 text-sm">
              <input
                type="color"
                value={s.colors[k]}
                onChange={(e) => setS({ ...s, colors: { ...s.colors, [k]: e.target.value } })}
                className="h-10 w-12 cursor-pointer rounded border"
              />
              <span className="flex-1">{COLOR_LABELS[k]}</span>
              <code className="text-neutral-500">{s.colors[k]}</code>
            </label>
          ))}
        </div>
        <div
          className="rounded-lg p-4"
          style={{ background: s.colors.background, color: s.colors.foreground }}
        >
          <strong style={{ color: s.colors.heading }}>Pré-visualização do título</strong>
          <p>Texto do corpo sobre o fundo escolhido.</p>
          <span className="mt-2 inline-block rounded px-3 py-1 text-white" style={{ background: s.colors.primary }}>Primária</span>{" "}
          <span className="inline-block rounded px-3 py-1 text-black" style={{ background: s.colors.secondary }}>Secundária</span>
        </div>
      </section>

      <section className="space-y-4 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">Logos e favicon</h2>
        {(Object.keys(IMAGE_LABELS) as ImageKey[]).map((k) => (
          <div key={k} className="flex items-center gap-4">
            <div className="flex h-16 w-24 items-center justify-center rounded border bg-neutral-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {s[k] ? <img src={s[k]} alt="" className="max-h-14 max-w-20 object-contain" /> : <span className="text-xs text-neutral-400">vazio</span>}
            </div>
            <label className="flex-1 text-sm">
              {IMAGE_LABELS[k]} {uploading === k && "— enviando…"}
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full"
                onChange={(e) => e.target.files?.[0] && upload(k, e.target.files[0])}
              />
            </label>
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-xl bg-white p-5 shadow">
        <h2 className="font-semibold">Contato e redes</h2>
        <input className={input} placeholder="WhatsApp com DDI, só números (5511999999999)" value={s.whatsappNumber} onChange={(e) => setS({ ...s, whatsappNumber: e.target.value })} />
        {(["instagram", "youtube", "tiktok"] as const).map((k) => (
          <input key={k} className={input} placeholder={`URL do ${k}`} value={s.social[k] ?? ""} onChange={(e) => setS({ ...s, social: { ...s.social, [k]: e.target.value } })} />
        ))}
      </section>

      <div className="flex items-center gap-4">
        <button onClick={save} disabled={pending || uploading !== null} className="rounded-lg bg-primary px-6 py-2 font-semibold text-white disabled:opacity-60">
          {pending ? "Salvando…" : "Salvar"}
        </button>
        {msg && <p className={msg.ok ? "text-green-700" : "text-red-600"}>{msg.text}</p>}
      </div>
    </div>
  );
}
