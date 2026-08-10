export function GraphSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />

      <div className="mt-3 h-9 w-72 rounded bg-white/10" />

      <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />

      <div className="mt-8 h-[650px] rounded-2xl border border-white/10 bg-white/[0.025]" />
    </div>
  );
}