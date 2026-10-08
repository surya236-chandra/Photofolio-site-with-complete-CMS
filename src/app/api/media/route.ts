import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { listMedia, deleteMedia } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await listMedia();
  return NextResponse.json({ items });
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let url = "";
  try {
    const body = await req.json();
    url = body?.url || "";
  } catch {
    url = new URL(req.url).searchParams.get("url") || "";
  }
  if (!url) return NextResponse.json({ error: "No url provided" }, { status: 400 });
  await deleteMedia(url);
  return NextResponse.json({ ok: true });
}
