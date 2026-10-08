import Link from "next/link";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/ui";
import { deletePage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const RESERVED: Record<string, string> = { about: "/about", services: "/services" };

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display text-2xl font-bold md:text-3xl">Pages</h1>
          <p className="mt-1 text-muted">Editable content pages like About & Services.</p>
        </div>
        <Link href="/admin/pages/new" className="btn btn-accent"><Plus size={16} /> New</Link>
      </div>

      <div className="surface divide-y divide-line overflow-hidden">
        {pages.length === 0 && <p className="p-6 text-muted">No pages yet.</p>}
        {pages.map((pg) => {
          const url = RESERVED[pg.slug] || `/p/${pg.slug}`;
          return (
            <div key={pg.id} className="flex items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{pg.title}</p>
                <p className="truncate text-sm text-muted">{url}</p>
              </div>
              <Link href={url} target="_blank" className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-fg" title="View">
                <ExternalLink size={16} />
              </Link>
              <Link href={`/admin/pages/${pg.id}`} className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-fg" title="Edit">
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deletePage.bind(null, pg.id)} iconOnly confirm={`Delete "${pg.title}"?`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
