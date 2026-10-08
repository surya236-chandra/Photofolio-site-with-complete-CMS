import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-muted">
      <Loader2 className="animate-spin" size={28} />
    </div>
  );
}
