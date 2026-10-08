import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import ProjectCard from "@/components/site/ProjectCard";
import PostCard from "@/components/site/PostCard";
import Reveal from "@/components/site/Reveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();
  const [featured, recent, posts] = await Promise.all([
    prisma.project.findMany({
      where: { published: true, featured: true },
      include: { category: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  const h = settings.home;

  return (
    <div>
      {/* Hero */}
      <section className="container-x pt-12 md:pt-20">
        <p className="chip animate-fade-up" style={{ animationDelay: "0ms" }}>{settings.tagline}</p>
        <h1 className="display gradient-text mt-5 max-w-4xl text-4xl font-bold leading-[1.05] animate-fade-up sm:text-6xl md:text-7xl" style={{ animationDelay: "80ms" }}>
          {h.heroTitle}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted animate-fade-up" style={{ animationDelay: "200ms" }}>{h.heroSubtitle}</p>
        <div className="mt-8 flex flex-col gap-3 animate-fade-up sm:flex-row" style={{ animationDelay: "300ms" }}>
          <Link href="/work" className="btn btn-accent">
            View our work <ArrowRight size={18} />
          </Link>
          <Link href="/contact" className="btn btn-ghost">
            Start a project
          </Link>
        </div>
      </section>

      {/* Hero image */}
      {h.heroImage && (
        <section className="container-x mt-12">
          <div className="surface relative aspect-[16/9] w-full overflow-hidden">
            <Image src={h.heroImage} alt="" fill priority sizes="100vw" className="object-cover" />
          </div>
        </section>
      )}

      {/* Featured work */}
      {featured.length > 0 && (
        <section className="container-x mt-20 md:mt-28">
          <div className="flex items-end justify-between">
            <h2 className="display text-2xl font-bold md:text-4xl">Selected work</h2>
            <Link href="/work" className="link-underline hidden text-sm text-muted hover:text-fg sm:inline">
              All projects →
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProjectCard project={p} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* About blurb */}
      <section className="container-x mt-24 md:mt-32">
        <Reveal className="surface grid gap-8 p-8 md:grid-cols-2 md:p-14">
          <h2 className="display text-2xl font-bold leading-tight md:text-4xl">
            A studio built around light, story & craft.
          </h2>
          <div>
            <p className="text-lg text-muted">{h.aboutBlurb}</p>
            <Link href="/about" className="btn btn-ghost mt-6">
              More about us <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* More work grid */}
      {recent.length > 3 && (
        <section className="container-x mt-24">
          <h2 className="display text-2xl font-bold md:text-4xl">Recent projects</h2>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {recent.slice(3).map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Journal */}
      {posts.length > 0 && (
        <section className="container-x mt-24">
          <div className="flex items-end justify-between">
            <h2 className="display text-2xl font-bold md:text-4xl">From the journal</h2>
            <Link href="/blog" className="link-underline hidden text-sm text-muted hover:text-fg sm:inline">
              All posts →
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 90}>
                <PostCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-x mt-24">
        <Reveal className="surface flex flex-col items-center gap-6 p-10 text-center md:p-16">
          <h2 className="display max-w-2xl text-3xl font-bold md:text-5xl">{h.ctaTitle}</h2>
          <p className="max-w-md text-muted">{h.ctaText}</p>
          <Link href="/contact" className="btn btn-accent">
            Get in touch <ArrowRight size={18} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
