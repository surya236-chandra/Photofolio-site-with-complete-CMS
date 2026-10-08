import { ImageResponse } from "next/og";
import { getSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Studio";

export default async function OgImage() {
  const s = await getSettings();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1020 0%, #161618 55%, #1a1340 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, letterSpacing: 4, opacity: 0.85, textTransform: "uppercase" }}>
          {s.logoText || s.siteName}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, maxWidth: 950 }}>
            {s.seo.defaultTitle || s.siteName}
          </div>
          <div style={{ fontSize: 34, opacity: 0.8, maxWidth: 850 }}>{s.tagline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, opacity: 0.7 }}>
          <div style={{ width: 56, height: 8, background: "#6c5cff", borderRadius: 8 }} />
          {(process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^https?:\/\//, "") || "studio"}
        </div>
      </div>
    ),
    { ...size }
  );
}
