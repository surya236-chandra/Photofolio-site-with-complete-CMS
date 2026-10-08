import { listMedia } from "@/lib/storage";
import MediaLibrary from "./MediaLibrary";

export const dynamic = "force-dynamic";

export default async function MediaAdminPage() {
  const initial = await listMedia();
  return <MediaLibrary initial={initial} />;
}
