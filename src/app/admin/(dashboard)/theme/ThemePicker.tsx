"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { THEMES } from "@/lib/themes";
import { setThemeAction } from "@/app/admin/actions";
import { SubmitButton } from "@/components/admin/ui";
import { cx } from "@/lib/utils";

export default function ThemePicker({
  initialTheme,
  initialAccent,
}: {
  initialTheme: string;
  initialAccent: string;
}) {
  const [theme, setTheme] = useState(initialTheme);
  const [accent, setAccent] = useState(initialAccent);

  // Live-preview on the whole admin page as you click around.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    if (accent) root.style.setProperty("--accent", accent);
    else root.style.removeProperty("--accent");
  }, [theme, accent]);

  // On submit, also clear any local visitor override so the admin sees the
  // new site theme when they open the public site in this browser.
  function onSubmitClear() {
    try {
      localStorage.removeItem("studio-theme");
    } catch {}
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(0,420px)]">
      {/* Picker */}
      <div>
        <div className="grid gap-4 sm:grid-cols-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cx(
                "surface relative overflow-hidden p-4 text-left transition-transform hover:-translate-y-0.5",
                theme === t.id && "ring-2 ring-[var(--accent)]"
              )}
            >
              {theme === t.id && (
                <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accentFg">
                  <Check size={14} />
                </span>
              )}
              <div className="flex gap-1.5">
                {[t.swatch.bg, t.swatch.surface, t.swatch.accent, t.swatch.text].map((c, i) => (
                  <span key={i} className="h-8 w-8 rounded-md border border-line" style={{ background: c }} />
                ))}
              </div>
              <p className="mt-3 font-semibold">{t.name}</p>
              <p className="text-sm text-muted">{t.description}</p>
            </button>
          ))}
        </div>

        <div className="surface mt-6 p-5">
          <h3 className="font-semibold">Accent colour</h3>
          <p className="mb-3 text-sm text-muted">Optional. Overrides the theme&apos;s default accent.</p>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={accent || THEMES.find((t) => t.id === theme)?.swatch.accent || "#6c5cff"}
              onChange={(e) => setAccent(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded border border-line bg-transparent"
            />
            <input
              type="text"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              placeholder="#hex (leave blank for default)"
              className="input flex-1"
            />
            {accent && (
              <button type="button" onClick={() => setAccent("")} className="btn btn-ghost !py-2" title="Reset accent">
                <RotateCcw size={15} />
              </button>
            )}
          </div>
        </div>

        <form action={setThemeAction} onSubmit={onSubmitClear} className="mt-6">
          <input type="hidden" name="theme" value={theme} />
          <input type="hidden" name="accent" value={accent} />
          <SubmitButton className="btn btn-accent">Save &amp; apply to site</SubmitButton>
        </form>
      </div>

      {/* Live preview card */}
      <div className="lg:sticky lg:top-8 lg:self-start">
        <p className="label">Live preview</p>
        <div className="surface overflow-hidden">
          <div className="p-6" style={{ background: "var(--bg)", backgroundImage: "var(--bg-image)" }}>
            <span className="chip">Photography &amp; Film</span>
            <h3 className="display mt-3 text-2xl font-bold leading-tight">
              We make images that move people.
            </h3>
            <p className="mt-2 text-sm text-muted">
              An independent studio for brands, artists and the curious.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="btn btn-accent !py-2">View work</span>
              <span className="btn btn-ghost !py-2">Contact</span>
            </div>
            <div className="surface mt-5 p-4">
              <p className="text-sm font-semibold">Sample card</p>
              <p className="text-sm text-muted">This is how surfaces look on this theme.</p>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted">
          Changes preview instantly here and across the admin. Click <strong>Save &amp; apply</strong> to make it live for visitors.
        </p>
      </div>
    </div>
  );
}
