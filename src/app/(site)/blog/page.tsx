import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { buildMetadata } from "@/lib/seo";
import PostCard from "@/components/site/PostCard";
import Reveal from "@/components/site/Reveal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Journal",
    description: "Notes on photography, film and the craft of making images.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-x pt-12 md:pt-16">
      <header className="max-w-2xl">
        <h1 className="display text-4xl font-bold md:text-6xl">Journal</h1>
        <p className="mt-4 text-lg text-muted">
          Notes on photography, film and the craft of making images.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-16 text-muted">No posts published yet.</p>
      ) : (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 90}>
              <PostCard post={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
