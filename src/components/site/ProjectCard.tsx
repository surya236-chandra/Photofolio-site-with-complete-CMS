import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

type Project = {
  slug: string;
  title: string;
  client?: string | null;
  year?: string | null;
  role?: string | null;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: { name: string } | null;
};

export default function ProjectCard({
  project,
  priority,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link href={`/work/${project.slug}`} className="group block">
      <div className="hover-zoom surface relative aspect-[4/3] w-full overflow-hidden">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">No image</div>
        )}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accentFg opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="display text-lg font-semibold leading-tight">{project.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {[project.category?.name, project.client].filter(Boolean).join(" · ")}
          </p>
        </div>
        {project.year && <span className="chip shrink-0">{project.year}</span>}
      </div>
    </Link>
  );
}
