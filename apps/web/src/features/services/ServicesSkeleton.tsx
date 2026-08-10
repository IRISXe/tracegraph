export function ServicesSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />

      <div className="mt-3 h-9 w-52 rounded bg-white/10" />

      <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />

      <div className="mt-8 space-y-3">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl border border-white/10 bg-white/[0.025]"
            />
          ),
        )}
      </div>
    </div>
  );
}