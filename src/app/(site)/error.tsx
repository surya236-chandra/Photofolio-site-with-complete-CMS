"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="display text-5xl font-bold">Something went wrong</p>
      <p className="mt-3 max-w-sm text-muted">An unexpected error occurred. Please try again.</p>
      <div className="mt-6 flex gap-3">
        <button onClick={reset} className="btn btn-accent">Try again</button>
        <Link href="/" className="btn btn-ghost">Back home</Link>
      </div>
    </div>
  );
}
