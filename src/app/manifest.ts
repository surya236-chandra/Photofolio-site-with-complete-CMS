import type { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  const icon = s.faviconUrl || "/favicon.ico";
  return {
    name: s.siteName,
    short_name: s.logoText || s.siteName,
    description: s.seo.defaultDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [{ src: icon, sizes: "any", type: "image/png" }],
  };
}
