import {
  AlertTriangle,
} from "lucide-react";

interface DashboardErrorProps {
  onRetry: () => void;
}

export function DashboardError({
  onRetry,
}: DashboardErrorProps) {
  return (
    <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-8">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
        <AlertTriangle size={20} />
      </div>

      <h2 className="mt-5 text-lg font-semibold text-white">
        Unable to load infrastructure
      </h2>

      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
        TraceGraph could not retrieve the latest
        infrastructure information.
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