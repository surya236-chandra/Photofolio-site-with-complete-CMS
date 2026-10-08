"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, Loader2, Copy, Check, Trash2, ImageOff } from "lucide-react";
import type { Media } from "@/components/admin/MediaPicker";

export default function MediaLibrary({ initial }: { initial: Media[] }) {
  const [items, setItems] = useState<Media[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    const res = await fetch("/api/media");
    const json = await res.json();
    setItems(json.items || []);
  }

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const j = await res.json();
          alert(j.error || "Upload failed");
        }
      }
      await refresh();
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function copy(url: string) {
    const full = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Copy this URL:", full);
    }
  }

  async function remove(url: string) {
    if (!window.confirm("Delete this image? It may still be used on pages that reference it.")) return;
    setItems((prev) => prev.filter((m) => m.url !== url));
    await fetch("/api/media", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  }

  useEffect(() => {
    // keep in sync if something changed elsewhere
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display text-2xl font-bold md:text-3xl">Media</h1>
          <p className="mt-1 text-muted">All uploaded images. Upload, copy links, or delete.</p>
        </div>
        <button onClick={() => fileRef.current?.click()} className="btn btn-accent" disabled={uploading}>
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
      </div>

      {items.length === 0 ? (
        <div className="surface flex h-48 flex-col items-center justify-center gap-2 text-muted">
          <ImageOff size={30} />
          <p>No images yet. Click Upload to add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((m) => (
            <div key={m.url} className="surface overflow-hidden !p-0">
              <div className="relative aspect-square overflow-hidden bg-surface2">
                <img src={m.url} alt={m.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <button onClick={() => copy(m.url)} className="flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs text-muted hover:bg-surface2 hover:text-fg">
                  {copied === m.url ? <><Check size={13} className="text-accent" /> Copied</> : <><Copy size={13} /> Copy link</>}
                </button>
                <button onClick={() => remove(m.url)} className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-surface2 hover:text-red-500" aria-label="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
