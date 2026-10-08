import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageField, GalleryField } from "@/components/admin/Uploader";
import { SubmitButton } from "@/components/admin/ui";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Project = {
  id: string;
  title: string;
  slug: string;
  client: string | null;
  year: string | null;
  role: string | null;
  excerpt: string | null;
  description: string | null;
  coverImage: string | null;
  videoUrl: string | null;
  gallery: string | null;
  categoryId: string | null;
  featured: boolean;
  published: boolean;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
};

type Cat = { id: string; name: string };

export default function ProjectForm({
  project,
  categories,
  action,
}: {
  project?: Project;
  categories: Cat[];
  action: (fd: FormData) => void | Promise<void>;
}) {
  const p = project;
  return (
    <div>
      <Link href="/admin/projects" className="link-underline mb-4 inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} /> Back to projects
      </Link>
      <h1 className="display mb-6 text-2xl font-bold md:text-3xl">{p ? "Edit project" : "New project"}</h1>

      <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6">
          <div className="surface space-y-4 p-5">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" required defaultValue={p?.title} className="input" placeholder="Project title" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="slug">Slug</label>
                <input id="slug" name="slug" defaultValue={p?.slug} className="input" placeholder="auto from title" />
              </div>
              <div>
                <label className="label" htmlFor="categoryId">Category</label>
                <select id="categoryId" name="categoryId" defaultValue={p?.categoryId || ""} className="select">
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="excerpt">Short description</label>
              <input id="excerpt" name="excerpt" defaultValue={p?.excerpt || ""} className="input" placeholder="One line shown on cards" />
            </div>
            <div>
              <label className="label">Full description</label>
              <RichTextEditor name="description" defaultValue={p?.description || ""} placeholder="Tell the story of this project…" />
            </div>
          </div>

          <div className="surface space-y-4 p-5">
            <ImageField name="coverImage" label="Cover image" defaultValue={p?.coverImage || ""} />
            <div>
              <label className="label" htmlFor="videoUrl">Video embed URL (optional)</label>
              <input id="videoUrl" name="videoUrl" defaultValue={p?.videoUrl || ""} className="input" placeholder="https://player.vimeo.com/video/..." />
            </div>
            <GalleryField name="gallery" label="Gallery" defaultValue={p?.gallery || "[]"} />
          </div>

          <div className="surface space-y-4 p-5">
            <h3 className="font-semibold">SEO</h3>
            <div>
              <label className="label" htmlFor="seoTitle">Meta title</label>
              <input id="seoTitle" name="seoTitle" defaultValue={p?.seoTitle || ""} className="input" placeholder="Defaults to project title" />
            </div>
            <div>
              <label className="label" htmlFor="seoDescription">Meta description</label>
              <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={p?.seoDescription || ""} className="textarea" placeholder="Defaults to short description" />
            </div>
            <ImageField name="ogImage" label="Social share image (OG)" defaultValue={p?.ogImage || ""} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="surface space-y-4 p-5">
            <label className="flex items-center justify-between gap-3">
              <span className="font-medium">Published</span>
              <input type="checkbox" name="published" defaultChecked={p ? p.published : true} className="h-5 w-5 accent-[var(--accent)]" />
            </label>
            <label className="flex items-center justify-between gap-3">
              <span className="font-medium">Featured on home</span>
              <input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-5 w-5 accent-[var(--accent)]" />
            </label>
            <div>
              <label className="label" htmlFor="order">Sort order</label>
              <input id="order" name="order" type="number" defaultValue={p?.order ?? 0} className="input" />
              <p className="mt-1 text-xs text-muted">Lower numbers show first.</p>
            </div>
          </div>

          <div className="surface space-y-4 p-5">
            <h3 className="font-semibold">Details</h3>
            <div>
              <label className="label" htmlFor="client">Client</label>
              <input id="client" name="client" defaultValue={p?.client || ""} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="role">Role</label>
              <input id="role" name="role" defaultValue={p?.role || ""} className="input" placeholder="Photography, Direction" />
            </div>
            <div>
              <label className="label" htmlFor="year">Year</label>
              <input id="year" name="year" defaultValue={p?.year || ""} className="input" placeholder="2025" />
            </div>
          </div>

          <div className="surface p-5">
            <SubmitButton className="btn btn-accent w-full">{p ? "Save changes" : "Create project"}</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
