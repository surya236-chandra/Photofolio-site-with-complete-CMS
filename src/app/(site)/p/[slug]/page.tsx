import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

// Reserved slugs handled by their own routes
const RESERVED = new Set(["about", "services"]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return {};
  return buildMetadata({
    title: page.seoTitle || page.title,
    description: page.seoDescription,
    path: `/p/${slug}`,
  });
}

export default async function CustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) notFound();
  return (
    <div className="container-x pt-12 md:pt-16">
      <h1 className="display max-w-3xl text-4xl font-bold md:text-6xl">{page.title}</h1>
      <div className="mt-10 max-w-3xl">
        {page.content && <Markdown>{page.content}</Markdown>}
      </div>
    </div>
  );
}
