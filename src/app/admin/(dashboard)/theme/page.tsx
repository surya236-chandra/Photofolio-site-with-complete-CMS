import { CheckCircle2 } from "lucide-react";
import { getSettings } from "@/lib/settings";
import ThemePicker from "./ThemePicker";

export const dynamic = "force-dynamic";

export default async function ThemeAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const s = await getSettings();
  const { saved } = await searchParams;

  return (
    <div>
      <div className="mb-6">
        <h1 className="display text-2xl font-bold md:text-3xl">Theme</h1>
        <p className="mt-1 text-muted">
          Choose how your whole site looks. Pick a preset, tweak the accent, preview it, then apply.
        </p>
      </div>

      {saved && (
        <div className="surface mb-6 flex items-center gap-2 border-l-4 border-l-accent p-4 text-sm">
          <CheckCircle2 size={18} className="text-accent" /> Theme applied to your live site.
        </div>
      )}

      <ThemePicker initialTheme={s.theme.active} initialAccent={s.theme.accent} />
    </div>
  );
}
