import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { formatDate, readingTime } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.post.findFirst({
    where: { slug, published: true },
    include: { author: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    image: post.ogImage || post.coverImage,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const tags = (post.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || undefined,
    image: post.ogImage || post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    mainEntityOfPage: `${base}/blog/${post.slug}`,
  };

  return (
    <article className="container-x pt-8 md:pt-12">
      <JsonLd data={articleLd} />
      <Link href="/blog" className="link-underline inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} /> Back to journal
      </Link>

      <header className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-sm uppercase tracking-wide text-muted">
          {formatDate(post.publishedAt)} · {readingTime(post.content)}
          {post.author ? ` · ${post.author.name}` : ""}
        </p>
        <h1 className="display mt-4 text-3xl font-bold leading-tight md:text-5xl">{post.title}</h1>
      </header>

      {post.coverImage && (
        <div className="surface relative mx-auto mt-10 aspect-[16/9] w-full max-w-4xl overflow-hidden">
          <Image src={post.coverImage} alt={post.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      <div className="mx-auto mt-12 max-w-3xl">
        {post.content && <Markdown>{post.content}</Markdown>}

        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
            {tags.map((t) => (
              <span key={t} className="chip">#{t}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
