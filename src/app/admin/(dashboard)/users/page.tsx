import Link from "next/link";
import { redirect } from "next/navigation";
import { Pencil, Shield, UserPlus } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { DeleteButton, SubmitButton } from "@/components/admin/ui";
import { createUser, deleteUser } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const me = await getCurrentUser();
  if (!me) redirect("/admin/login");
  if (me.role !== "admin") redirect("/admin");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-2xl font-bold md:text-3xl">Users</h1>
        <p className="mt-1 text-muted">Manage who can access the admin panel.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="surface divide-y divide-line overflow-hidden">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface2 font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 font-medium">
                  {u.name}
                  {u.role === "admin" && <Shield size={13} className="text-accent" />}
                  {u.id === me.id && <span className="chip">You</span>}
                </p>
                <p className="truncate text-sm text-muted">{u.email} · joined {formatDate(u.createdAt)}</p>
              </div>
              <span className="hidden text-xs capitalize text-muted sm:block">{u.role}</span>
              <Link href={`/admin/users/${u.id}`} className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface2 hover:text-fg" title="Edit">
                <Pencil size={16} />
              </Link>
              {u.id !== me.id && (
                <DeleteButton action={deleteUser.bind(null, u.id)} iconOnly confirm={`Delete ${u.name}?`} />
              )}
            </div>
          ))}
        </div>

        <div className="surface h-fit p-5">
          <h2 className="flex items-center gap-2 font-semibold"><UserPlus size={18} /> Add user</h2>
          <form action={createUser} className="mt-4 space-y-3">
            <div>
              <label className="label" htmlFor="name">Name</label>
              <input id="name" name="name" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className="input" />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={6} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="role">Role</label>
              <select id="role" name="role" className="select" defaultValue="editor">
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <SubmitButton className="btn btn-accent w-full">Create user</SubmitButton>
          </form>
        </div>
      </div>
    </div>
  );
}
