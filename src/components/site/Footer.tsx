import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = 2026;
  const s = settings;
  const socials = [
    { href: s.socials.instagram, label: "Instagram" },
    { href: s.socials.vimeo, label: "Vimeo" },
    { href: s.socials.youtube, label: "YouTube" },
    { href: s.socials.behance, label: "Behance" },
    { href: s.socials.linkedin, label: "LinkedIn" },
    { href: s.socials.x, label: "X" },
  ].filter((x) => x.href);

  return (
    <footer className="mt-24 border-t border-line">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="display text-2xl font-bold">{s.logoText || s.siteName}</p>
          <p className="mt-3 max-w-sm text-muted">{s.footerText}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map((soc) => (
              <a
                key={soc.label}
                href={soc.href}
                target="_blank"
                rel="noreferrer"
                className="chip hover:text-accent"
              >
                {soc.label} <ArrowUpRight size={13} />
              </a>
            ))}
          </div>
        </div>

        {s.nav.footer.map((col, ci) => (
          <div key={ci}>
            <p className="label">{col.title}</p>
            <ul className="flex flex-col gap-2 text-sm">
              {col.links.map((l, li) => (
                <li key={li}><Link href={l.href} className="text-muted hover:text-fg">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="label">Get in touch</p>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {s.contactEmail && <li><a href={`mailto:${s.contactEmail}`} className="hover:text-fg">{s.contactEmail}</a></li>}
            {s.phone && <li><a href={`tel:${s.phone}`} className="hover:text-fg">{s.phone}</a></li>}
            {s.address && <li>{s.address}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted md:flex-row">
          <p>© {year} {s.siteName}. All rights reserved.</p>
          <p>
            <Link href="/admin" className="hover:text-fg">Admin</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
