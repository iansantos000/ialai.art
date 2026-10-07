// Uso: node scripts/set-admin.mjs email@dominio.com [senha-se-for-criar]
// Dá a claim admin ao usuário (cria o usuário se informar senha e ele não existir).
// Requer credenciais: `gcloud auth application-default login` ou GOOGLE_APPLICATION_CREDENTIALS.
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);

const [email, password] = process.argv.slice(2);
if (!email) {
  console.error("Informe o e-mail: node scripts/set-admin.mjs email@dominio.com");
  process.exit(1);
}

initializeApp({ projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID });
const auth = getAuth();

let user;
try {
  user = await auth.getUserByEmail(email);
} catch {
  if (!password) {
    console.error("Usuário não existe. Passe uma senha como 2º argumento para criá-lo.");
    process.exit(1);
  }
  user = await auth.createUser({ email, password, emailVerified: true });
  console.log("Usuário criado.");
}
await auth.setCustomUserClaims(user.uid, { admin: true });
console.log(`✔ ${email} agora é admin (uid ${user.uid}). Faça login novamente para a claim valer.`);
