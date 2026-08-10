export function ServiceInspectorSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 w-32 rounded bg-white/10" />

      <div className="mt-6 h-10 w-80 max-w-full rounded bg-white/10" />

      <div className="mt-3 h-4 w-96 max-w-full rounded bg-white/10" />

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.025]" />

        <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.025]" />

        <div className="h-40 rounded-2xl border border-white/10 bg-white/[0.025]" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-2xl border border-white/10 bg-white/[0.025]" />

        <div className="h-80 rounded-2xl border border-white/10 bg-white/[0.025]" />
      </div>
    </div>
  );
}