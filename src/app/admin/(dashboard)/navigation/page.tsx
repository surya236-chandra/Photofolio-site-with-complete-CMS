import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import NavEditor from "./NavEditor";

export const dynamic = "force-dynamic";

const RESERVED: Record<string, string> = { about: "/about", services: "/services" };

export default async function NavigationAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [s, pages, categories] = await Promise.all([
    getSettings(),
    prisma.page.findMany({ orderBy: { title: "asc" } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const suggestions = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: "Journal", href: "/blog" },
    { label: "Contact", href: "/contact" },
    ...pages.map((p) => ({
      label: p.title,
      href: RESERVED[p.slug] || `/p/${p.slug}`,
    })),
    ...categories.map((c) => ({ label: `Work: ${c.name}`, href: `/work?cat=${c.slug}` })),
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-2xl font-bold md:text-3xl">Navigation</h1>
        <p className="mt-1 text-muted">
          Control the header menu (with dropdown / mega menus) and footer columns. Link to any page you&apos;ve created.
        </p>
      </div>

      {saved && (
        <div className="surface mb-6 flex items-center gap-2 border-l-4 border-l-accent p-4 text-sm">
          <CheckCircle2 size={18} className="text-accent" /> Navigation saved.
        </div>
      )}

      <NavEditor initialHeader={s.nav.header} initialFooter={s.nav.footer} suggestions={suggestions} />
    </div>
  );
}
