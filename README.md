# IALAI.ART 2.0

Next.js 16 (App Router, `cacheComponents`) + Tailwind 4 + Firebase (Auth, Firestore, Storage, App Hosting).
Cursos são vendidos na Hotmart; o site só redireciona.

## Arquitetura
- **Tema dinâmico**: `settings/site` no Firestore → CSS variables em `src/app/layout.tsx`. Cache com tag `site-settings` (o admin deve invalidar ao salvar).
- **Admin**: usuários com custom claim `admin: true` (regras em `firestore.rules` / `storage.rules`).
- **Coleções**: `settings`, `products`, `posts`, `leads`, `memberContent`, `users`.
- **Deploy**: Firebase App Hosting (SSR, necessário para SEO de blog/produtos). `firebase.json` → backend `ialai-site`.

## Setup
1. Criar projeto no Firebase, ativar Auth, Firestore, Storage e App Hosting.
2. `cp .env.example .env.local` e preencher.
3. Local: `gcloud auth application-default login`, depois `npm run dev`.
4. `firebase deploy --only firestore:rules,storage`.

## Roadmap
- [ ] Auth + guard `/admin` (claim admin)
- [ ] Admin: aparência (cores, logos, favicon, WhatsApp)
- [ ] Admin/público: produtos (CRUD + redirect Hotmart com tracking)
- [ ] Admin/público: blog (editor markdown, SEO, sitemap)
- [ ] Leads (formulário + export) e botão WhatsApp
- [ ] Área de membros (webhook Hotmart → libera acesso)
- [ ] Migração de posts do WordPress + redirects 301
