import "server-only";
import { cookies } from "next/headers";
import { adminAuth } from "./firebase/admin";

// Firebase Hosting/CDN só repassa o cookie com este nome exato.
export const SESSION_COOKIE = "__session";
export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000;

// Retorna o usuário logado (ou null). Lê cookies: usar dentro de <Suspense>.
export async function getSessionUser() {
  const cookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!cookie) return null;
  try {
    return await adminAuth.verifySessionCookie(cookie, true);
  } catch {
    return null;
  }
}

// Retorna o usuário somente se tiver a claim admin.
export async function getAdminUser() {
  const user = await getSessionUser();
  return user?.admin === true ? user : null;
}
