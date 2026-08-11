import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  ServerOff,
} from "lucide-react";

import {
  ApiError,
} from "../lib/api";

import {
  useSystemReadiness,
} from "../features/health/use-system-readiness";

export function SystemStatus() {
  const {
    isPending,
    isError,
    error,
  } =
    useSystemReadiness();

  /*
   * Initial readiness check.
   */
  if (isPending) {
    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-white/10
          bg-white/[0.03]
          px-3
          py-2
          text-xs
          text-slate-400
        "
      >
        <LoaderCircle
          className="
            h-3.5
            w-3.5
            animate-spin
          "
        />

        <span>
          Checking system
        </span>
      </div>
    );
  }

  /*
   * Backend returned an error.
   */
  if (isError) {
    const databaseUnavailable =
      error instanceof ApiError &&
      error.status === 503;

    if (
      databaseUnavailable
    ) {
      return (
        <div
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-amber-500/20
            bg-amber-500/5
            px-3
            py-2
            text-xs
            text-amber-300
          "
        >
          <CircleAlert
            className="
              h-3.5
              w-3.5
            "
          />

          <span>
            Database unavailable
          </span>
        </div>
      );
    }

    return (
      <div
        className="
          flex
          items-center
          gap-2
          rounded-lg
          border
          border-red-500/20
          bg-red-500/5
          px-3
          py-2
          text-xs
          text-red-300
        "
      >
        <ServerOff
          className="
            h-3.5
            w-3.5
          "
        />

        <span>
          API unavailable
        </span>
      </div>
    );
  }

  /*
   * API and CognoDB are healthy.
   */
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-lg
        border
        border-emerald-500/20
        bg-emerald-500/5
        px-3
        py-2
        text-xs
        text-emerald-300
      "
    >
      <CheckCircle2
        className="
          h-3.5
          w-3.5
        "
      />

      <span>
        System operational
      </span>
    </div>
  );
}