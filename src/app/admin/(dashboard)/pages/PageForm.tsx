import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SubmitButton } from "@/components/admin/ui";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Page = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export default function PageForm({
  page,
  action,
}: {
  page?: Page;
  action: (fd: FormData) => void | Promise<void>;
}) {
  const p = page;
  return (
    <div>
      <Link href="/admin/pages" className="link-underline mb-4 inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} /> Back to pages
      </Link>
      <h1 className="display mb-6 text-2xl font-bold md:text-3xl">{p ? "Edit page" : "New page"}</h1>

      <form action={action} className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="surface space-y-4 p-5">
          <div>
            <label className="label" htmlFor="title">Title</label>
            <input id="title" name="title" required defaultValue={p?.title} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="slug">Slug</label>
            <input id="slug" name="slug" defaultValue={p?.slug} className="input" placeholder="about, services, faq..." />
            <p className="mt-1 text-xs text-muted">
              &quot;about&quot; & &quot;services&quot; map to /about and /services. Others live at /p/&lt;slug&gt;.
            </p>
          </div>
          <div>
            <label className="label">Content</label>
            <RichTextEditor name="content" defaultValue={p?.content || ""} placeholder="Write your page…" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface space-y-4 p-5">
            <h3 className="font-semibold">SEO</h3>
            <div>
              <label className="label" htmlFor="seoTitle">Meta title</label>
              <input id="seoTitle" name="seoTitle" defaultValue={p?.seoTitle || ""} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="seoDescription">Meta description</label>
              <textarea id="seoDescription" name="seoDescription" rows={3} defaultValue={p?.seoDescription || ""} className="textarea" />
            </div>
          </div>
          <div className="surface p-5">
            <SubmitButton className="btn btn-accent w-full">{p ? "Save changes" : "Create page"}</SubmitButton>
          </div>
        </div>
      </form>
    </div>
  );
}
