import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminDb } from "./firebase/admin";
import { DEFAULT_SETTINGS, type SiteSettings } from "./types";

export const SETTINGS_TAG = "site-settings";

// Lê settings/site do Firestore (cacheado); o admin invalida a tag ao salvar.
// Se falhar (sem credenciais/dev), usa o padrão.
export async function getSiteSettings(): Promise<SiteSettings> {
  "use cache";
  cacheTag(SETTINGS_TAG);
  cacheLife("hours");
  try {
    const snap = await adminDb.doc("settings/site").get();
    if (!snap.exists) return DEFAULT_SETTINGS;
    const data = snap.data() as Partial<SiteSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...data,
      colors: { ...DEFAULT_SETTINGS.colors, ...data.colors },
      social: { ...DEFAULT_SETTINGS.social, ...data.social },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
