import { prisma } from "./db";
import { DEFAULT_THEME } from "./themes";

export type NavLink = { label: string; href: string };
export type NavGroup = { heading: string; links: NavLink[] };
export type NavItem = {
  label: string;
  href: string;
  children: NavGroup[]; // non-empty => dropdown / mega menu
};
export type FooterColumn = { title: string; links: NavLink[] };

export type SiteSettings = {
  siteName: string;
  tagline: string;
  logoText: string; // text logo if no image
  logoUrl: string;
  faviconUrl: string; // browser tab icon
  contactEmail: string;
  phone: string;
  address: string;
  footerText: string;
  socials: {
    instagram: string;
    behance: string;
    vimeo: string;
    youtube: string;
    linkedin: string;
    x: string;
  };
  seo: {
    titleTemplate: string; // e.g. "%s — Studio"
    defaultTitle: string;
    defaultDescription: string;
    defaultOgImage: string;
    keywords: string;
  };
  theme: {
    active: string; // theme id from themes.ts
    accent: string; // optional accent override ("" = use preset)
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroImage: string;
    aboutBlurb: string;
    ctaTitle: string;
    ctaText: string;
  };
  nav: {
    header: NavItem[];
    footer: FooterColumn[];
  };
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Surya Chandra",
  tagline: "Photography & Film",
  logoText: "SURYA CHANDRA",
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "",
  phone: "",
  address: "",
  footerText: "Photography & film by Surya Chandra.",
  socials: {
    instagram: "",
    behance: "",
    vimeo: "",
    youtube: "",
    linkedin: "",
    x: "",
  },
  seo: {
    titleTemplate: "%s — Surya Chandra",
    defaultTitle: "Surya Chandra — Photography & Film",
    defaultDescription:
      "Photography and film portfolio by Surya Chandra.",
    defaultOgImage: "",
    keywords: "photography, film studio, video production, portrait, commercial",
  },
  theme: {
    active: DEFAULT_THEME,
    accent: "",
  },
  home: {
    heroTitle: "We make images that move people.",
    heroSubtitle:
      "An independent photography & film studio for brands, artists and the curious.",
    heroImage: "",
    aboutBlurb:
      "A photography and film portfolio by Surya Chandra.",
    ctaTitle: "Have a project in mind?",
    ctaText: "Tell us what you're dreaming up. We reply to every message.",
  },
  nav: {
    header: [
      {
        label: "Work",
        href: "/work",
        children: [
          {
            heading: "Browse",
            links: [
              { label: "All work", href: "/work" },
              { label: "Portrait", href: "/work?cat=portrait" },
              { label: "Commercial", href: "/work?cat=commercial" },
            ],
          },
          {
            heading: "Disciplines",
            links: [
              { label: "Film", href: "/work?cat=film" },
              { label: "Editorial", href: "/work?cat=editorial" },
            ],
          },
        ],
      },
      { label: "About", href: "/about", children: [] },
      { label: "Services", href: "/services", children: [] },
      { label: "Journal", href: "/blog", children: [] },
      { label: "Contact", href: "/contact", children: [] },
    ],
    footer: [
      {
        title: "Explore",
        links: [
          { label: "Work", href: "/work" },
          { label: "About", href: "/about" },
          { label: "Services", href: "/services" },
          { label: "Journal", href: "/blog" },
          { label: "Contact", href: "/contact" },
        ],
      },
    ],
  },
};

function deepMerge<T>(base: T, override: unknown): T {
  if (override === undefined) return base;
  // Arrays (e.g. navigation) are replaced wholesale, not merged element-by-element.
  if (Array.isArray(base) || Array.isArray(override)) {
    return (override as T) ?? base;
  }
  if (typeof base !== "object" || base === null) return (override as T) ?? base;
  if (typeof override !== "object" || override === null) return base;
  const out: Record<string, unknown> = { ...(base as object) };
  for (const key of Object.keys(base as object)) {
    out[key] = deepMerge(
      (base as Record<string, unknown>)[key],
      (override as Record<string, unknown>)[key]
    );
  }
  return out as T;
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.setting.findUnique({ where: { id: 1 } });
    if (!row) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(row.data || "{}");
    return deepMerge(DEFAULT_SETTINGS, parsed);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(next: SiteSettings) {
  const data = JSON.stringify(next);
  await prisma.setting.upsert({
    where: { id: 1 },
    update: { data },
    create: { id: 1, data },
  });
}
