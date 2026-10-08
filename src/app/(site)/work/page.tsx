import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import ProjectCard from "@/components/site/ProjectCard";
import Reveal from "@/components/site/Reveal";
import { cx } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Work",
    description: "Selected photography and film projects from our studio.",
    path: "/work",
  });
}

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;

  const [categories, projects] = await Promise.all([
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({
      where: {
        published: true,
        ...(cat ? { category: { slug: cat } } : {}),
      },
      include: { category: true },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="container-x pt-12 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="display text-4xl font-bold md:text-6xl">Work</h1>
        <p className="mt-4 text-lg text-muted">
          A selection of photography and film we&apos;re proud of. Filter by discipline below.
        </p>
      </header>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/work" className={cx("chip", !cat && "!bg-accent !text-accentFg !border-transparent")}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/work?cat=${c.slug}`}
            className={cx("chip", cat === c.slug && "!bg-accent !text-accentFg !border-transparent")}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {projects.length === 0 ? (
        <p className="mt-16 text-muted">No projects here yet.</p>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <ProjectCard project={p} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
