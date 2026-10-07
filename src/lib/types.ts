export type SiteSettings = {
  siteName: string;
  tagline: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    foreground: string; // texto do corpo
    heading: string; // títulos
  };
  logoUrl: string;
  logoDarkUrl: string;
  faviconUrl: string;
  whatsappNumber: string;
  social: { instagram?: string; youtube?: string; tiktok?: string };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "IALAI.ART",
  tagline: "",
  colors: {
    primary: "#7c3aed",
    secondary: "#f59e0b",
    background: "#683b1f",
    foreground: "#8c6f5f",
    heading: "#683b1f",
  },
  logoUrl: "",
  logoDarkUrl: "",
  faviconUrl: "/favicon.ico",
  whatsappNumber: "",
  social: {},
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string; // markdown
  coverUrl: string;
  priceLabel: string; // exibição apenas, ex: "12x de R$ 29,90"
  hotmartUrl: string;
  published: boolean;
  order: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // markdown
  coverUrl: string;
  tags: string[];
  published: boolean;
  publishedAt: string; // ISO
};

export type Lead = {
  name: string;
  email: string;
  phone?: string;
  source: string;
  createdAt: string;
};
