import {
  AlertTriangle,
} from "lucide-react";

interface GraphErrorProps {
  onRetry: () => void;
}

export function GraphError({
  onRetry,
}: GraphErrorProps) {
  return (
    <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-8">
      <AlertTriangle
        size={22}
        className="text-red-300"
      />

      <h2 className="mt-5 text-lg font-semibold text-white">
        Unable to load topology
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        TraceGraph could not retrieve the
        infrastructure graph.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Try again
      </button>
    </div>
  );
}