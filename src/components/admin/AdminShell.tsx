"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Images,
  ImageIcon,
  Newspaper,
  FileText,
  Mail,
  Users,
  Settings,
  Palette,
  Menu as MenuIcon,
  ExternalLink,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { cx } from "@/lib/utils";
import { logoutAction } from "@/app/admin/actions";

type NavItem = { href: string; label: string; icon: React.ElementType; adminOnly?: boolean };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Images },
  { href: "/admin/blog", label: "Journal", icon: Newspaper },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/navigation", label: "Navigation", icon: MenuIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/theme", label: "Theme", icon: Palette },
];

export default function AdminShell({
  user,
  unread,
  children,
}: {
  user: { name: string; role: string };
  unread: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const items = NAV.filter((i) => !i.adminOnly || user.role === "admin");

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-5">
        <Link href="/admin" className="display text-lg font-bold">Surya Chandra</Link>
        <button className="md:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cx(
              "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium",
              isActive(item.href) ? "bg-accent text-accentFg" : "text-muted hover:bg-surface2 hover:text-fg"
            )}
          >
            <item.icon size={18} />
            <span className="flex-1">{item.label}</span>
            {item.href === "/admin/messages" && unread > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accentFg">{unread}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="space-y-2 border-t border-line p-3">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm text-muted hover:text-fg">
          <ExternalLink size={18} /> View site
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface2 text-sm font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.name}</p>
            <p className="text-xs capitalize text-muted">{user.role}</p>
          </div>
        </div>
        <form action={logoutAction}>
          <button className="flex w-full items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-fg">
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface md:block">
        <div className="sticky top-0 h-screen">{SidebarInner}</div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 border-r border-line bg-surface">{SidebarInner}</aside>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/80 p-4 backdrop-blur md:hidden">
          <Link href="/admin" className="display font-bold">Surya Chandra</Link>
          <button onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
