import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/ui";
import { deletePost } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const posts = await prisma.post.findMany({
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display text-2xl font-bold md:text-3xl">Journal</h1>
          <p className="mt-1 text-muted">Blog posts for SEO and storytelling.</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-accent"><Plus size={16} /> New</Link>
      </div>

      <div className="surface divide-y divide-line overflow-hidden">
        {posts.length === 0 && <p className="p-6 text-muted">No posts yet.</p>}
        {posts.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-3">
            <div className="surface relative h-14 w-20 shrink-0 overflow-hidden">
              {p.coverImage && <Image src={p.coverImage} alt="" fill sizes="80px" className="object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{p.title}</p>
              <p className="truncate text-sm text-muted">
                {p.published ? formatDate(p.publishedAt) : "Draft"}{p.author ? ` · ${p.author.name}` : ""}
              </p>
            </div>
            <span className="hidden items-center gap-1 text-xs text-muted sm:flex">
              {p.published ? <><Eye size={14} /> Live</> : <><EyeOff size={14} /> Draft</>}
            </span>
            <Link href={`/admin/blog/${p.id}`} className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-fg" title="Edit">
              <Pencil size={16} />
            </Link>
            <DeleteButton action={deletePost.bind(null, p.id)} iconOnly confirm={`Delete "${p.title}"?`} />
          </div>
        ))}
      </div>
    </div>
  );
}
