"use client";

import { useState } from "react";
import { ImagePlus, X, Link as LinkIcon } from "lucide-react";
import MediaPicker from "./MediaPicker";

/** Single image field. Submits its value under `name`. Browse the media library, upload, or paste a URL. */
export function ImageField({
  name,
  label,
  defaultValue = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [picker, setPicker] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  return (
    <div>
      <label className="label">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="surface relative flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden hover:border-[var(--accent)]"
          title="Choose image"
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-muted">
              <ImagePlus size={20} /> Choose
            </span>
          )}
          {value && (
            <span
              onClick={(e) => { e.stopPropagation(); setValue(""); }}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remove image"
            >
              <X size={13} />
            </span>
          )}
        </button>
        <div className="flex-1">
          <button type="button" onClick={() => setPicker(true)} className="btn btn-ghost">
            <ImagePlus size={16} /> {value ? "Change image" : "Choose / upload"}
          </button>
          <div>
            <button type="button" onClick={() => setShowUrl((s) => !s)} className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-fg">
              <LinkIcon size={12} /> {showUrl ? "Hide URL field" : "…or paste a URL"}
            </button>
            {showUrl && (
              <input
                type="url"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="https://..."
                className="input mt-1"
              />
            )}
          </div>
        </div>
      </div>
      <MediaPicker open={picker} onClose={() => setPicker(false)} onSelect={(url) => setValue(url)} />
    </div>
  );
}

/** Gallery field. Submits a JSON array string under `name`. */
export function GalleryField({
  name,
  label,
  defaultValue = "[]",
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  let initial: string[] = [];
  try {
    const arr = JSON.parse(defaultValue || "[]");
    if (Array.isArray(arr)) initial = arr.filter((x) => typeof x === "string");
  } catch {}

  const [items, setItems] = useState<string[]>(initial);
  const [picker, setPicker] = useState(false);

  function remove(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="label">{label}</label>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {items.map((src, i) => (
          <div key={i} className="surface relative aspect-square overflow-hidden !p-0">
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              aria-label="Remove"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setPicker(true)}
          className="surface flex aspect-square flex-col items-center justify-center gap-1 text-xs text-muted hover:border-[var(--accent)] hover:text-accent"
        >
          <ImagePlus size={18} /> Add
        </button>
      </div>
      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        onSelect={(url) => setItems((prev) => (prev.includes(url) ? prev : [...prev, url]))}
        multiple
      />
    </div>
  );
}
