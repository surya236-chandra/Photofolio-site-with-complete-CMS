import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { ImageField } from "@/components/admin/Uploader";
import { SubmitButton } from "@/components/admin/ui";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImage: string | null;
  tags: string | null;
  published: boolean;
  publishedAt: Date | null;
  seoTitle: string | null;
  seoDescription: string | null;
  ogImage: string | null;
};

function toLocalInput(d: Date | null) {
  if (!d) return "";
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
}

export default function PostForm({
  post,
  action,
}: {
  post?: Post;
  action: (fd: FormData) => void | Promise<void>;
}) {
  const p = post;
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href="/admin/blog" className="link-underline inline-flex items-center gap-2 text-sm text-muted">
          <ArrowLeft size={16} /> Back to journal
        </Link>
        {p?.published && (
          <Link href={`/blog/${p.slug}`} target="_blank" className="text-sm text-muted hover:text-fg">
            View live <ExternalLink size={13} className="inline" />
          </Link>
        )}
      </div>
      <h1 className="display mb-6 text-2xl font-bold md:text-3xl">{p ? "Edit post" : "New post"}</h1>

      <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div className="surface space-y-4 p-5">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input id="title" name="title" required defaultValue={p?.title} className="input" placeholder="Post title" />
            </div>
            <div>
              <label className="label" htmlFor="slug">Slug</label>
              <input id="slug" name="slug" defaultValue={p?.slug} className="input" placeholder="auto from title" />
            </div>
            <div>
              <label className="label" htmlFor="excerpt">Excerpt</label>
              <input id="excerpt" name="excerpt" defaultValue={p?.excerpt || ""} className="input" placeholder="Shown on cards & search results" />
            </div>
            <div>
              <label className="label">Content</label>
              <RichTextEditor name="content" defaultValue={p?.content || ""} placeholder="Write your post…" />
            </div>
          </div>

          <div className="surface space-y-4 p-5">
            <h3 className="font-semibold">SEO</h3>
            <div>
              <label className="label" htmlFor="seoTitle">Meta title</label>
              <input id="seoTitle" name="seoTitle" defaultValue={p?.seoTitle || ""} className="input" placeholder="Defaults to post title" />
            </div>
            <div>
              <label className="label" htmlFor="seoDescription">Meta description</label>
              <textarea id="seoDescription" name="seoDescription" rows={2} defaultValue={p?.seoDescription || ""} className="textarea" placeholder="Defaults to excerpt" />
            </div>
            <ImageField name="ogImage" label="Social share image (OG)" defaultValue={p?.ogImage || ""} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface space-y-4 p-5">
            <label className="flex items-center justify-between gap-3">
              <span className="font-medium">Published</span>
              <input type="checkbox" name="published" defaultChecked={p?.published} className="h-5 w-5 accent-[var(--accent)]" />
            </label>
            <div>
              <label className="label" htmlFor="publishedAt">Publish date</label>
              <input id="publishedAt" name="publishedAt" type="datetime-local" defaultValue={toLocalInput(p?.publishedAt ?? null)} className="input" />
              <p className="mt-1 text-xs text-muted">Leave blank to use now when publishing.</p>
            </div>
            <div>
              <label className="label" htmlFor="tags">Tags</label>
              <input id="tags" name="tags" defaultValue={p?.tags || ""} className="input" placeholder="film, process, tips" />
              <p className="mt-1 text-xs text-muted">Comma separated.</p>
            </div>
          </div>

          <div className="surface space-y-4 p-5">
            <ImageField name="coverImage" label="Cover image" defaultValue={p?.coverImage || ""} />
          </div>

          <div className="surface p-5">
            <SubmitButton className="btn btn-accent w-full">{p ? "Save changes" : "Create post"}</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
