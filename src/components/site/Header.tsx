"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { cx } from "@/lib/utils";
import type { NavItem } from "@/lib/settings";

export default function Header({
  logoText,
  logoUrl,
  items,
}: {
  logoText: string;
  logoUrl?: string;
  items: NavItem[];
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => {
    const base = href.split("?")[0];
    return base !== "/" && pathname.startsWith(base);
  };

  return (
    <header
      className={cx(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-line bg-bg/80 backdrop-blur-md" : "border-b border-transparent"
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={logoText} width={140} height={32} className="h-7 w-auto object-contain" />
          ) : (
            <span className="display text-xl font-bold tracking-tight md:text-2xl">{logoText}</span>
          )}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {items.map((item, i) =>
            item.children.length > 0 ? (
              <div
                key={i}
                className="relative"
                onMouseEnter={() => setMegaOpen(i)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <Link
                  href={item.href}
                  className={cx(
                    "flex items-center gap-1 text-sm font-medium",
                    isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
                  )}
                >
                  {item.label}
                  <ChevronDown size={14} className={cx("transition-transform", megaOpen === i && "rotate-180")} />
                </Link>

                {megaOpen === i && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                    <div
                      className="surface grid gap-6 p-5 shadow-2xl animate-fade-up"
                      style={{ gridTemplateColumns: `repeat(${Math.min(item.children.length, 4)}, minmax(150px, 1fr))` }}
                    >
                      {item.children.map((group, gi) => (
                        <div key={gi}>
                          {group.heading && <p className="label mb-2">{group.heading}</p>}
                          <ul className="space-y-1.5">
                            {group.links.map((l, li) => (
                              <li key={li}>
                                <Link href={l.href} className="block whitespace-nowrap text-sm text-muted transition-colors hover:text-accent">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={i}
                href={item.href}
                className={cx(
                  "link-underline text-sm font-medium",
                  isActive(item.href) ? "text-fg" : "text-muted hover:text-fg"
                )}
              >
                {item.label}
              </Link>
            )
          )}
          <Link href="/contact" className="btn btn-accent !py-2">
            Start a project
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-bg md:hidden">
          <nav className="container-x flex flex-col py-3">
            {items.map((item, i) => (
              <div key={i} className="border-b border-line last:border-0">
                <div className="flex items-center justify-between">
                  <Link href={item.href} className={cx("flex-1 py-3 text-lg font-medium", isActive(item.href) ? "text-accent" : "text-fg")}>
                    {item.label}
                  </Link>
                  {item.children.length > 0 && (
                    <button
                      onClick={() => setMobileExpanded((e) => (e === i ? null : i))}
                      className="p-2 text-muted"
                      aria-label="Expand"
                    >
                      <ChevronDown size={18} className={cx("transition-transform", mobileExpanded === i && "rotate-180")} />
                    </button>
                  )}
                </div>
                {item.children.length > 0 && mobileExpanded === i && (
                  <div className="space-y-3 pb-3 pl-3">
                    {item.children.map((group, gi) => (
                      <div key={gi}>
                        {group.heading && <p className="label">{group.heading}</p>}
                        {group.links.map((l, li) => (
                          <Link key={li} href={l.href} className="block py-1.5 text-muted">{l.label}</Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/contact" className="btn btn-accent mt-4">Start a project</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
