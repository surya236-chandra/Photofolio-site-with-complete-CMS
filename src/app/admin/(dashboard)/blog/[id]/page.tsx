import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updatePost } from "@/app/admin/actions";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();
  return <PostForm post={post} action={updatePost.bind(null, id)} />;
}
