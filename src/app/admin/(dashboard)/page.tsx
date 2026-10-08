import Link from "next/link";
import { Images, Newspaper, Mail, FileText, Plus, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [projects, posts, pages, messages, unread, recentMessages] = await Promise.all([
    prisma.project.count(),
    prisma.post.count(),
    prisma.page.count(),
    prisma.message.count(),
    prisma.message.count({ where: { read: false } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Projects", value: projects, href: "/admin/projects", icon: Images },
    { label: "Journal posts", value: posts, href: "/admin/blog", icon: Newspaper },
    { label: "Pages", value: pages, href: "/admin/pages", icon: FileText },
    { label: "Messages", value: messages, href: "/admin/messages", icon: Mail, badge: unread },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="display text-2xl font-bold md:text-3xl">Welcome back, {user?.name.split(" ")[0]}</h1>
        <p className="mt-1 text-muted">Here&apos;s what&apos;s happening with your studio.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="surface group p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <s.icon size={22} className="text-accent" />
              {!!s.badge && s.badge > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accentFg">{s.badge} new</span>
              )}
            </div>
            <p className="mt-4 text-3xl font-bold">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/admin/projects/new" className="btn btn-accent"><Plus size={16} /> New project</Link>
            <Link href="/admin/blog/new" className="btn btn-ghost"><Plus size={16} /> New post</Link>
            <Link href="/admin/pages/new" className="btn btn-ghost"><Plus size={16} /> New page</Link>
          </div>
        </div>

        <div className="surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent messages</h2>
            <Link href="/admin/messages" className="text-sm text-muted hover:text-fg">View all <ArrowRight size={14} className="inline" /></Link>
          </div>
          <div className="mt-4 space-y-3">
            {recentMessages.length === 0 && <p className="text-sm text-muted">No messages yet.</p>}
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-start justify-between gap-3 border-b border-line pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name} {!m.read && <span className="ml-1 inline-block h-2 w-2 rounded-full bg-accent align-middle" />}</p>
                  <p className="truncate text-sm text-muted">{m.subject || m.body}</p>
                </div>
                <span className="shrink-0 text-xs text-muted">{formatDate(m.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
