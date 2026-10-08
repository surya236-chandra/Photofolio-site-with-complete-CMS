import { CheckCircle2 } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { saveSettingsAction } from "@/app/admin/actions";
import { ImageField } from "@/components/admin/Uploader";
import { SubmitButton } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const s = await getSettings();
  const { saved } = await searchParams;

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="display text-2xl font-bold md:text-3xl">Settings</h1>
        <p className="mt-1 text-muted">Site identity, contact details, SEO defaults and homepage content.</p>
      </div>

      {saved && (
        <div className="surface mb-6 flex items-center gap-2 border-l-4 border-l-accent p-4 text-sm">
          <CheckCircle2 size={18} className="text-accent" /> Settings saved.
        </div>
      )}

      <form action={saveSettingsAction} className="space-y-6">
        {/* Identity */}
        <section className="surface space-y-4 p-5">
          <h2 className="font-semibold">Brand</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="siteName">Site name</label>
              <input id="siteName" name="siteName" defaultValue={s.siteName} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="tagline">Tagline</label>
              <input id="tagline" name="tagline" defaultValue={s.tagline} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="logoText">Logo text</label>
              <input id="logoText" name="logoText" defaultValue={s.logoText} className="input" placeholder="Shown when no logo image" />
            </div>
            <div>
              <label className="label" htmlFor="footerText">Footer blurb</label>
              <input id="footerText" name="footerText" defaultValue={s.footerText} className="input" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ImageField name="logoUrl" label="Logo image (optional)" defaultValue={s.logoUrl} />
            <ImageField name="faviconUrl" label="Favicon (browser tab icon)" defaultValue={s.faviconUrl} />
          </div>
        </section>

        {/* Contact */}
        <section className="surface space-y-4 p-5">
          <h2 className="font-semibold">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="contactEmail">Email</label>
              <input id="contactEmail" name="contactEmail" type="email" defaultValue={s.contactEmail} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone</label>
              <input id="phone" name="phone" defaultValue={s.phone} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="label" htmlFor="address">Location / address</label>
              <input id="address" name="address" defaultValue={s.address} className="input" />
            </div>
          </div>
        </section>

        {/* Socials */}
        <section className="surface space-y-4 p-5">
          <h2 className="font-semibold">Social links</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              ["instagram", "Instagram"], ["vimeo", "Vimeo"], ["youtube", "YouTube"],
              ["behance", "Behance"], ["linkedin", "LinkedIn"], ["x", "X / Twitter"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label className="label" htmlFor={key}>{label}</label>
                <input id={key} name={key} defaultValue={s.socials[key]} className="input" placeholder="https://" />
              </div>
            ))}
          </div>
        </section>

        {/* SEO */}
        <section className="surface space-y-4 p-5">
          <h2 className="font-semibold">SEO defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="titleTemplate">Title template</label>
              <input id="titleTemplate" name="titleTemplate" defaultValue={s.seo.titleTemplate} className="input" placeholder="%s — Studio" />
              <p className="mt-1 text-xs text-muted">%s is replaced by each page&apos;s title.</p>
            </div>
            <div>
              <label className="label" htmlFor="defaultTitle">Default title</label>
              <input id="defaultTitle" name="defaultTitle" defaultValue={s.seo.defaultTitle} className="input" />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="defaultDescription">Default meta description</label>
            <textarea id="defaultDescription" name="defaultDescription" rows={2} defaultValue={s.seo.defaultDescription} className="textarea" />
          </div>
          <div>
            <label className="label" htmlFor="keywords">Keywords</label>
            <input id="keywords" name="keywords" defaultValue={s.seo.keywords} className="input" placeholder="comma, separated, keywords" />
          </div>
          <ImageField name="defaultOgImage" label="Default social share image" defaultValue={s.seo.defaultOgImage} />
        </section>

        {/* Home */}
        <section className="surface space-y-4 p-5">
          <h2 className="font-semibold">Homepage content</h2>
          <div>
            <label className="label" htmlFor="heroTitle">Hero title</label>
            <input id="heroTitle" name="heroTitle" defaultValue={s.home.heroTitle} className="input" />
          </div>
          <div>
            <label className="label" htmlFor="heroSubtitle">Hero subtitle</label>
            <textarea id="heroSubtitle" name="heroSubtitle" rows={2} defaultValue={s.home.heroSubtitle} className="textarea" />
          </div>
          <ImageField name="heroImage" label="Hero image (optional)" defaultValue={s.home.heroImage} />
          <div>
            <label className="label" htmlFor="aboutBlurb">About blurb</label>
            <textarea id="aboutBlurb" name="aboutBlurb" rows={3} defaultValue={s.home.aboutBlurb} className="textarea" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="ctaTitle">CTA title</label>
              <input id="ctaTitle" name="ctaTitle" defaultValue={s.home.ctaTitle} className="input" />
            </div>
            <div>
              <label className="label" htmlFor="ctaText">CTA text</label>
              <input id="ctaText" name="ctaText" defaultValue={s.home.ctaText} className="input" />
            </div>
          </div>
        </section>

        <div className="sticky bottom-4 flex justify-end">
          <SubmitButton className="btn btn-accent shadow-xl">Save settings</SubmitButton>
        </div>
      </form>
    </div>
  );
}
