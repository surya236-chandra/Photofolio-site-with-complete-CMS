export default function Loading() {
  return (
    <div className="container-x pt-12 md:pt-16">
      <div className="h-10 w-56 animate-pulse rounded-[var(--radius)] bg-surface2" />
      <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded-[var(--radius)] bg-surface2" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface aspect-[4/3] animate-pulse !bg-surface2" />
        ))}
      </div>
    </div>
  );
}
