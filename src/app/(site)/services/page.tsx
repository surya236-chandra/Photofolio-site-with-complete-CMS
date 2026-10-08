import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findUnique({ where: { slug: "services" } });
  return buildMetadata({
    title: page?.seoTitle || page?.title || "Services",
    description: page?.seoDescription,
    path: "/services",
  });
}

export default async function ServicesPage() {
  const page = await prisma.page.findUnique({ where: { slug: "services" } });
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
