import {
  AlertTriangle,
} from "lucide-react";

interface IncidentsErrorProps {
  onRetry: () => void;
}

export function IncidentsError({
  onRetry,
}: IncidentsErrorProps) {
  return (
    <div className="rounded-2xl border border-red-400/15 bg-red-400/[0.04] p-8">
      <AlertTriangle
        size={22}
        className="text-red-300"
      />

      <h2 className="mt-5 text-lg font-semibold text-white">
        Unable to load incidents
      </h2>

      <p className="mt-2 text-sm text-slate-400">
        TraceGraph could not retrieve incident
        information.
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
      >
        Try again
      </button>
    </div>
  );
}