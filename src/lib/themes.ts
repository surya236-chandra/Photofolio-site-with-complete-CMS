// Theme presets. The actual CSS variables for each live in globals.css under
// [data-theme="<id>"]. This file is the registry the admin UI uses to list,
// preview and select themes. Add a new theme by appending here and adding a
// matching [data-theme] block in globals.css.

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  // swatches shown in the admin theme picker (bg, surface, accent, text)
  swatch: { bg: string; surface: string; accent: string; text: string };
};

export const THEMES: ThemePreset[] = [
  {
    id: "minimal",
    name: "Minimal / Editorial",
    description: "Whitespace, large serif display, clean grid. Timeless.",
    swatch: { bg: "#ffffff", surface: "#f4f4f2", accent: "#111111", text: "#111111" },
  },
  {
    id: "dark",
    name: "Bold / Dark",
    description: "Dark canvas, electric accent, dramatic high contrast.",
    swatch: { bg: "#0a0a0b", surface: "#161618", accent: "#6c5cff", text: "#f5f5f7" },
  },
  {
    id: "warm",
    name: "Warm / Organic",
    description: "Soft cream palette, terracotta accent, rounded and friendly.",
    swatch: { bg: "#f6efe7", surface: "#efe5d8", accent: "#c2622d", text: "#2c241d" },
  },
  {
    id: "glass",
    name: "Glass / Modern",
    description: "Gradient canvas, blurred glass surfaces, futuristic.",
    swatch: { bg: "#0b1020", surface: "#141b33", accent: "#3ad6c5", text: "#eef2ff" },
  },
];

export const DEFAULT_THEME = "dark";

export function isValidTheme(id: string | undefined | null): id is string {
  return !!id && THEMES.some((t) => t.id === id);
}
