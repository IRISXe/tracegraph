import {
  AlertTriangle,
  DatabaseZap,
  RefreshCw,
  ServerOff,
} from "lucide-react";

import {
  ApiError,
} from "../../lib/api";

interface ApiErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  title?: string;
}

export function ApiErrorState({
  error,
  onRetry,
  title,
}: ApiErrorStateProps) {
  let heading =
    title ??
    "Unable to load data";

  let message =
    "Something went wrong while loading this information.";

  let Icon =
    AlertTriangle;

  if (
    error instanceof ApiError
  ) {
    message = error.message;

    if (
      error.code ===
        "DATABASE_UNAVAILABLE" ||
      error.status === 503
    ) {
      heading =
        "Infrastructure data unavailable";

      message =
        "TraceGraph is running, but the graph database is temporarily unavailable.";

      Icon =
        DatabaseZap;
    } else if (
      error.code ===
        "API_UNAVAILABLE" ||
      error.status === 0
    ) {
      heading =
        "TraceGraph API unavailable";

      message =
        "The application cannot currently reach the TraceGraph API.";

      Icon =
        ServerOff;
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.04] px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
        <Icon size={22} />
      </div>

      <h2 className="mt-4 text-base font-semibold text-white">
        {heading}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
        {message}
      </p>

      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-violet-400"
        >
          <RefreshCw
            size={15}
          />

          Try again
        </button>
      ) : null}
    </div>
  );
}