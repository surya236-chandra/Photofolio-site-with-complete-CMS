import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { updateUser } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  if (me.role !== "admin") redirect("/admin");

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) notFound();

  return (
    <div className="max-w-lg">
      <Link href="/admin/users" className="link-underline mb-4 inline-flex items-center gap-2 text-sm text-muted">
        <ArrowLeft size={16} /> Back to users
      </Link>
      <h1 className="display mb-6 text-2xl font-bold md:text-3xl">Edit user</h1>

      <form action={updateUser.bind(null, id)} className="surface space-y-4 p-5">
        <div>
          <label className="label">Email</label>
          <input value={user.email} disabled className="input opacity-60" />
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input id="name" name="name" required defaultValue={user.name} className="input" />
        </div>
        <div>
          <label className="label" htmlFor="role">Role</label>
          <select id="role" name="role" className="select" defaultValue={user.role}>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="password">New password</label>
          <input id="password" name="password" type="password" minLength={6} className="input" placeholder="Leave blank to keep current" />
        </div>
        <SubmitButton className="btn btn-accent w-full">Save changes</SubmitButton>
      </form>
    </div>
  );
}
