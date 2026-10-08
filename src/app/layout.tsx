import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { isValidTheme, DEFAULT_THEME } from "@/lib/themes";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
};

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    metadataBase: new URL(base),
    title: {
      default: s.seo.defaultTitle || s.siteName,
      template: s.seo.titleTemplate || `%s — ${s.siteName}`,
    },
    description: s.seo.defaultDescription,
    keywords: s.seo.keywords ? s.seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: {
      title: s.seo.defaultTitle || s.siteName,
      description: s.seo.defaultDescription,
      siteName: s.siteName,
      type: "website",
      images: s.seo.defaultOgImage ? [{ url: s.seo.defaultOgImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: s.seo.defaultTitle || s.siteName,
      description: s.seo.defaultDescription,
    },
    icons: {
      icon: s.faviconUrl || "/favicon.ico",
      shortcut: s.faviconUrl || "/favicon.ico",
      apple: s.faviconUrl || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const s = await getSettings();
  const theme = isValidTheme(s.theme.active) ? s.theme.active : DEFAULT_THEME;
  const accentStyle = s.theme.accent ? ({ ["--accent" as string]: s.theme.accent } as React.CSSProperties) : undefined;

  return (
    <html
      lang="en"
      data-theme={theme}
      style={accentStyle}
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${grotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
