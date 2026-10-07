"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { SETTINGS_TAG } from "@/lib/site-settings";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Cor inválida");
const url = z.string().max(2000).refine((v) => v === "" || v.startsWith("/") || /^https:\/\//.test(v), "URL inválida");

const schema = z.object({
  siteName: z.string().min(1).max(80),
  tagline: z.string().max(200),
  colors: z.object({
    primary: hex,
    secondary: hex,
    background: hex,
    foreground: hex,
    heading: hex,
  }),
  logoUrl: url,
  logoDarkUrl: url,
  faviconUrl: url,
  whatsappNumber: z.string().regex(/^\d{0,15}$/, "Use só números, com DDI (ex: 5511999999999)"),
  social: z.object({ instagram: url, youtube: url, tiktok: url }),
});

export async function saveSettings(input: unknown): Promise<{ ok: boolean; error?: string }> {
  // Autoriza dentro da action: nunca confiar no cliente.
  if (!(await getAdminUser())) return { ok: false, error: "Não autorizado" };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };

  await adminDb.doc("settings/site").set(parsed.data);
  updateTag(SETTINGS_TAG);
  return { ok: true };
}
