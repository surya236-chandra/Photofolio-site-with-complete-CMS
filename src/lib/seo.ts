import type { Metadata } from "next";
import { getSettings } from "./settings";

type SeoInput = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
  path?: string; // e.g. "/work/northern-light"
  type?: "website" | "article";
};

export async function buildMetadata(input: SeoInput): Promise<Metadata> {
  const s = await getSettings();
  const title = input.title || s.seo.defaultTitle;
  const description = input.description || s.seo.defaultDescription;
  const image = input.image || s.seo.defaultOgImage || undefined;
  const url = input.path || "/";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: input.type || "website",
      siteName: s.siteName,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
