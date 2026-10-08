import { createPost } from "@/app/admin/actions";
import PostForm from "../PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return <PostForm action={createPost} />;
}
