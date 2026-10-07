import Link from "next/link";
import { getSiteSettings } from "@/lib/site-settings";

async function Year() {
  "use cache";
  return new Date().getFullYear();
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = await getSiteSettings();
  const logo = s.logoDarkUrl || s.logoUrl;

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 text-stone-100">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {logo ? <img src={logo} alt={s.siteName} className="h-10 w-auto" /> : s.siteName}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/cursos" className="hover:text-secondary">Cursos</Link>
            <Link href="/blog" className="hover:text-secondary">Blog</Link>
            <Link href="/login" className="rounded-full border border-white/30 px-4 py-1.5 hover:bg-white/10">Entrar</Link>
          </nav>
        </div>
      </header>

      <div className="flex-1">{children}</div>

      <footer className="bg-background text-stone-300">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm sm:flex-row">
          <p>© <Year /> {s.siteName}. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            {s.social.instagram && <a href={s.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">Instagram</a>}
            {s.social.youtube && <a href={s.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">YouTube</a>}
            {s.social.tiktok && <a href={s.social.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-secondary">TikTok</a>}
          </div>
        </div>
      </footer>

      {s.whatsappNumber && (
        <a
          href={`https://wa.me/${s.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar no WhatsApp"
          className="fixed bottom-5 right-5 z-30 rounded-full bg-[#25d366] px-5 py-3 font-semibold text-white shadow-lg hover:scale-105"
        >
          WhatsApp
        </a>
      )}
    </>
  );
}
