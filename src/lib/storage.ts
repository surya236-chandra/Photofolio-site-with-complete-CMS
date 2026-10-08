import "server-only";
import { writeFile, mkdir, readdir, unlink, stat } from "fs/promises";
import path from "path";

export type MediaItem = { name: string; url: string; size?: number };

/**
 * Universal upload storage.
 *
 *  - ONLINE  (Vercel / hosted): if SUPABASE_URL + a key are set, files go to a
 *    Supabase Storage bucket and a public URL is returned. Works on read-only
 *    serverless filesystems.
 *  - OFFLINE (local dev): otherwise files are written to /public/uploads and a
 *    same-origin URL (/uploads/<name>) is returned.
 *
 * Either way the API returns { url } and the image fields work identically.
 */

export type StoredFile = { url: string; backend: "supabase" | "local" };

function supabaseConfigured() {
  return Boolean(
    process.env.SUPABASE_URL &&
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  );
}

/** Where uploads will go, for diagnostics / UI hints. */
export function storageBackend(): "supabase" | "local" {
  return supabaseConfigured() ? "supabase" : "local";
}

export async function saveUpload(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<StoredFile> {
  if (supabaseConfigured()) {
    return saveToSupabase(buffer, fileName, contentType);
  }
  return saveToLocal(buffer, fileName);
}

async function saveToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<StoredFile> {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL as string;
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY) as string;
  const bucket = process.env.SUPABASE_BUCKET || "uploads";

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  const objectPath = `media/${fileName}`;
  const { error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buffer, { contentType, upsert: false });

  if (error) {
    throw new Error(
      `Supabase upload failed: ${error.message}. ` +
        `Make sure a PUBLIC bucket named "${bucket}" exists.`
    );
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);
  return { url: data.publicUrl, backend: "supabase" };
}

async function saveToLocal(buffer: Buffer, fileName: string): Promise<StoredFile> {
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);
  return { url: `/uploads/${fileName}`, backend: "local" };
}

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|svg)$/i;

/** List all uploaded media, newest first. */
export async function listMedia(): Promise<MediaItem[]> {
  if (supabaseConfigured()) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string,
      { auth: { persistSession: false } }
    );
    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const { data, error } = await supabase.storage
      .from(bucket)
      .list("media", { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
    if (error || !data) return [];
    return data
      .filter((f) => IMAGE_RE.test(f.name))
      .map((f) => {
        const objectPath = `media/${f.name}`;
        const { data: pub } = supabase.storage.from(bucket).getPublicUrl(objectPath);
        return { name: f.name, url: pub.publicUrl, size: f.metadata?.size as number | undefined };
      });
  }

  // local
  const dir = path.join(process.cwd(), "public", "uploads");
  try {
    const names = await readdir(dir);
    const items = await Promise.all(
      names
        .filter((n) => IMAGE_RE.test(n))
        .map(async (n) => {
          let size: number | undefined;
          try {
            size = (await stat(path.join(dir, n))).size;
          } catch {}
          return { name: n, url: `/uploads/${n}`, size };
        })
    );
    // names are prefixed with a timestamp, so reverse-sort = newest first
    return items.sort((a, b) => b.name.localeCompare(a.name));
  } catch {
    return [];
  }
}

/** Delete a media item by its URL. */
export async function deleteMedia(url: string): Promise<void> {
  if (supabaseConfigured()) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL as string,
      (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY) as string,
      { auth: { persistSession: false } }
    );
    const bucket = process.env.SUPABASE_BUCKET || "uploads";
    const marker = "/object/public/" + bucket + "/";
    const idx = url.indexOf(marker);
    const objectPath = idx >= 0 ? url.slice(idx + marker.length) : url;
    await supabase.storage.from(bucket).remove([objectPath]);
    return;
  }

  // local — only allow deleting inside public/uploads
  const fileName = path.basename(url.split("?")[0]);
  if (!fileName || fileName.includes("..")) return;
  const target = path.join(process.cwd(), "public", "uploads", fileName);
  try {
    await unlink(target);
  } catch {}
}
