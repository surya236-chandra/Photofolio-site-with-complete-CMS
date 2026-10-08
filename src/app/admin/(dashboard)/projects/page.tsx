import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Star, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";
import { DeleteButton } from "@/components/admin/ui";
import { deleteProject } from "@/app/admin/actions";
import CategoryManager from "./CategoryManager";

export const dynamic = "force-dynamic";

export default async function ProjectsAdminPage() {
  const [projects, categories] = await Promise.all([
    prisma.project.findMany({ include: { category: true }, orderBy: { order: "asc" } }),
    prisma.category.findMany({ include: { _count: { select: { projects: true } } }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display text-2xl font-bold md:text-3xl">Projects</h1>
          <p className="mt-1 text-muted">Your portfolio work.</p>
        </div>
        <Link href="/admin/projects/new" className="btn btn-accent"><Plus size={16} /> New</Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="surface divide-y divide-line overflow-hidden">
          {projects.length === 0 && <p className="p-6 text-muted">No projects yet.</p>}
          {projects.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-3">
              <div className="surface relative h-14 w-20 shrink-0 overflow-hidden">
                {p.coverImage && <Image src={p.coverImage} alt="" fill sizes="80px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  <span className="truncate">{p.title}</span>
                  {p.featured && <Star size={14} className="text-accent" fill="currentColor" />}
                </p>
                <p className="truncate text-sm text-muted">
                  {[p.category?.name, p.client, p.year].filter(Boolean).join(" · ")}
                </p>
              </div>
              <span className="hidden items-center gap-1 text-xs text-muted sm:flex">
                {p.published ? <><Eye size={14} /> Live</> : <><EyeOff size={14} /> Draft</>}
              </span>
              <Link href={`/admin/projects/${p.id}`} className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-fg" title="Edit">
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deleteProject.bind(null, p.id)} iconOnly confirm={`Delete "${p.title}"?`} />
            </div>
          ))}
        </div>

        <CategoryManager categories={categories} />
      </div>
    </div>
  );
}
