import type { Metadata } from "next";
import { Mail, Phone, MapPin } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { getSettings } from "@/lib/settings";
import ContactForm from "@/components/site/ContactForm";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Contact",
    description: "Get in touch to start a photography or film project.",
    path: "/contact",
  });
}

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <div className="container-x pt-12 md:pt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <h1 className="display text-4xl font-bold md:text-6xl">Let&apos;s talk</h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Tell us what you&apos;re dreaming up. We read and reply to every message.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {s.contactEmail && (
              <a href={`mailto:${s.contactEmail}`} className="flex items-center gap-3 text-muted hover:text-fg">
                <span className="surface flex h-10 w-10 items-center justify-center"><Mail size={18} /></span>
                {s.contactEmail}
              </a>
            )}
            {s.phone && (
              <a href={`tel:${s.phone}`} className="flex items-center gap-3 text-muted hover:text-fg">
                <span className="surface flex h-10 w-10 items-center justify-center"><Phone size={18} /></span>
                {s.phone}
              </a>
            )}
            {s.address && (
              <p className="flex items-center gap-3 text-muted">
                <span className="surface flex h-10 w-10 items-center justify-center"><MapPin size={18} /></span>
                {s.address}
              </p>
            )}
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
