export function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />

      <div className="mt-3 h-9 w-72 rounded bg-white/10" />

      <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-40 rounded-2xl border border-white/10 bg-white/[0.025]"
            />
          ),
        )}
      </div>

      <div className="mt-8 h-80 rounded-2xl border border-white/10 bg-white/[0.025]" />
    </div>
  );
}