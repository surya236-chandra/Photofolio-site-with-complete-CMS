import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

type Post = {
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  publishedAt?: Date | string | null;
  tags?: string | null;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="hover-zoom surface relative aspect-[16/10] w-full overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">No image</div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-muted">
          {formatDate(post.publishedAt)}
        </p>
        <h3 className="display mt-1 text-xl font-semibold leading-snug transition-colors group-hover:text-accent">
          {post.title}
        </h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted">{post.excerpt}</p>}
      </div>
    </Link>
  );
}
