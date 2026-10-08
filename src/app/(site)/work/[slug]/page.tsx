import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import { parseGallery } from "@/lib/utils";
import Markdown from "@/components/Markdown";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return prisma.project.findFirst({
    where: { slug, published: true },
    include: { category: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return buildMetadata({
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.excerpt,
    image: project.ogImage || project.coverImage,
    path: `/work/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const gallery = parseGallery(project.gallery);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const workLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.seoDescription || project.excerpt || undefined,
    image: project.ogImage || project.coverImage || undefined,
    dateCreated: project.year || undefined,
    url: `${base}/work/${project.slug}`,
    ...(project.client ? { creator: { "@type": "Organization", name: project.client } } : {}),
  };

  return (
    <article className="container-x pt-8 md:pt-12">
      <JsonLd data={workLd} />
      <Link href="/work" className="link-underline inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} /> Back to work
      </Link>

      <header className="mt-8 max-w-4xl">
        {project.category && <p className="chip">{project.category.name}</p>}
        <h1 className="display mt-4 text-4xl font-bold leading-tight md:text-6xl">{project.title}</h1>
        {project.excerpt && <p className="mt-4 text-lg text-muted">{project.excerpt}</p>}
      </header>

      {/* Meta */}
      <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-line py-6 sm:grid-cols-4">
        {project.client && (
          <div><dt className="label">Client</dt><dd className="font-medium">{project.client}</dd></div>
        )}
        {project.role && (
          <div><dt className="label">Role</dt><dd className="font-medium">{project.role}</dd></div>
        )}
        {project.year && (
          <div><dt className="label">Year</dt><dd className="font-medium">{project.year}</dd></div>
        )}
        {project.category && (
          <div><dt className="label">Discipline</dt><dd className="font-medium">{project.category.name}</dd></div>
        )}
      </dl>

      {/* Cover */}
      {project.coverImage && (
        <div className="surface relative mt-10 aspect-[16/9] w-full overflow-hidden">
          <Image src={project.coverImage} alt={project.title} fill priority sizes="100vw" className="object-cover" />
        </div>
      )}

      {/* Video embed */}
      {project.videoUrl && (
        <div className="surface relative mt-6 aspect-video w-full overflow-hidden">
          <iframe
            src={project.videoUrl}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={project.title}
          />
        </div>
      )}

      {/* Description */}
      {project.description && (
        <div className="mx-auto mt-12 max-w-3xl">
          <Markdown>{project.description}</Markdown>
        </div>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {gallery.map((src, i) => (
            <div key={i} className="surface relative aspect-[4/3] w-full overflow-hidden">
              <Image src={src} alt={`${project.title} ${i + 1}`} fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-16 flex justify-center">
        <Link href="/contact" className="btn btn-accent">Start a project like this</Link>
      </div>
    </article>
  );
}
