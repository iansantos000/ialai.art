"use client";

import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="rounded border border-neutral-300 px-3 py-1"
      onClick={async () => {
        await fetch("/api/session", { method: "DELETE" });
        await signOut(auth);
        router.push("/login");
        router.refresh();
      }}
    >
      Sair
    </button>
  );
}
