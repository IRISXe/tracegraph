export function IncidentsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />

      <div className="mt-3 h-9 w-56 rounded bg-white/10" />

      <div className="mt-8 space-y-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="h-44 rounded-2xl border border-white/10 bg-white/[0.025]"
            />
          ),
        )}
      </div>
    </div>
  );
}