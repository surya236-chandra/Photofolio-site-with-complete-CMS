"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Upload, Loader2, Check, ImageOff } from "lucide-react";
import { cx } from "@/lib/utils";

export type Media = { name: string; url: string; size?: number };

export default function MediaPicker({
  open,
  onClose,
  onSelect,
  multiple = false,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  multiple?: boolean;
}) {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const json = await res.json();
      setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setSelected([]);
      load();
    }
  }, [open, load]);

  async function upload(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) {
          alert(json.error || "Upload failed");
          continue;
        }
        if (!multiple) {
          onSelect(json.url);
          onClose();
          return;
        }
      }
      await load();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function pick(url: string) {
    if (multiple) {
      setSelected((s) => (s.includes(url) ? s.filter((u) => u !== url) : [...s, url]));
    } else {
      onSelect(url);
      onClose();
    }
  }

  function addSelected() {
    selected.forEach(onSelect);
    onClose();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="surface relative flex max-h-[85vh] w-full max-w-4xl flex-col overflow-hidden !p-0">
        <div className="flex items-center justify-between border-b border-line p-4">
          <h3 className="font-semibold">Media library</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-accent !py-2" disabled={uploading}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading…" : "Upload"}
            </button>
            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-[var(--radius)] hover:bg-surface2" aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-40 items-center justify-center text-muted"><Loader2 className="animate-spin" /></div>
          ) : items.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted">
              <ImageOff size={28} />
              <p>No images yet. Click Upload to add some.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
              {items.map((m) => {
                const isSel = selected.includes(m.url);
                return (
                  <button
                    key={m.url}
                    type="button"
                    onClick={() => pick(m.url)}
                    className={cx(
                      "surface group relative aspect-square overflow-hidden !p-0",
                      isSel && "ring-2 ring-[var(--accent)]"
                    )}
                  >
                    <img src={m.url} alt={m.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    {isSel && (
                      <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accentFg">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="flex items-center justify-between border-t border-line p-4">
            <span className="text-sm text-muted">{selected.length} selected</span>
            <button type="button" onClick={addSelected} disabled={!selected.length} className="btn btn-accent disabled:opacity-50">
              Add selected
            </button>
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/*" multiple={multiple} className="hidden" onChange={(e) => upload(e.target.files)} />
      </div>
    </div>
  );
}
