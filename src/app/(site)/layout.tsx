import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import CursorGlow from "@/components/site/CursorGlow";
import JsonLd from "@/components/JsonLd";
import { getSettings } from "@/lib/settings";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sameAs = Object.values(settings.socials).filter(Boolean);
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: base,
    description: settings.seo.defaultDescription,
    ...(settings.logoUrl ? { logo: settings.logoUrl } : {}),
    ...(settings.contactEmail ? { email: settings.contactEmail } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };

  return (
    <>
      <JsonLd data={orgLd} />
      <CursorGlow />
      <Header logoText={settings.logoText || settings.siteName} logoUrl={settings.logoUrl} items={settings.nav.header} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </>
  );
}
