import slugifyLib from "slugify";

export function slugify(input: string) {
  return slugifyLib(input, { lower: true, strict: true, trim: true });
}

export function formatDate(date: Date | string | null | undefined) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function parseGallery(gallery: string | null | undefined): string[] {
  if (!gallery) return [];
  try {
    const arr = JSON.parse(gallery);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function readingTime(content: string | null | undefined) {
  if (!content) return "1 min read";
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function excerptFrom(text: string | null | undefined, len = 160) {
  if (!text) return "";
  const clean = text.replace(/[#*_>`\-]/g, "").replace(/\s+/g, " ").trim();
  return clean.length > len ? clean.slice(0, len).trimEnd() + "…" : clean;
}
