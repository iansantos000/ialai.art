import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/site-settings";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  return {
    title: { default: s.siteName, template: `%s | ${s.siteName}` },
    description: s.tagline,
    icons: { icon: s.faviconUrl },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { colors } = await getSiteSettings();
  const theme = {
    "--primary": colors.primary,
    "--secondary": colors.secondary,
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--heading": colors.heading,
  } as React.CSSProperties;

  return (
    <html
      lang="pt-BR"
      style={theme}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
