import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="display text-7xl font-bold md:text-9xl">404</p>
      <h1 className="display mt-4 text-2xl font-bold">This page wandered off.</h1>
      <p className="mt-2 max-w-sm text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn btn-accent mt-6">Back home</Link>
    </div>
  );
}
