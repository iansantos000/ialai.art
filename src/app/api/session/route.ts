import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE, SESSION_MAX_AGE_MS } from "@/lib/auth";

// Troca o ID token do Firebase (client) por um session cookie httpOnly.
export async function POST(request: Request) {
  const { idToken } = (await request.json().catch(() => ({}))) as { idToken?: string };
  if (!idToken) return NextResponse.json({ error: "idToken ausente" }, { status: 400 });

  try {
    const decoded = await adminAuth.verifyIdToken(idToken);
    // Exige login recente (evita roubo de token antigo)
    if (Date.now() / 1000 - decoded.auth_time > 5 * 60) {
      return NextResponse.json({ error: "Faça login novamente" }, { status: 401 });
    }
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });
    const res = NextResponse.json({ ok: true, admin: decoded.admin === true });
    res.cookies.set(SESSION_COOKIE, sessionCookie, {
      maxAge: SESSION_MAX_AGE_MS / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
