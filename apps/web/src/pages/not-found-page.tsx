import {
  ArrowLeft,
  GitBranch,
  Home,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router";

export function NotFoundPage() {
  const navigate =
    useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="w-full max-w-xl text-center">

        {/* Icon */}

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
          <GitBranch size={28} />
        </div>

        {/* Error code */}

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">
          Error 404
        </p>

        {/* Heading */}

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Page not found
        </h1>

        {/* Description */}

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400 sm:text-base">
          The infrastructure view you're looking for
          doesn't exist or may have moved.
        </p>

        {/* Actions */}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-[#080b12] sm:w-auto"
          >
            <Home size={17} />

            Return to Overview
          </Link>

          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20 sm:w-auto"
          >
            <ArrowLeft size={17} />

            Go back
          </button>
        </div>

        {/* Context */}

        <div className="mx-auto mt-10 max-w-md border-t border-white/10 pt-6">
          <p className="text-xs leading-5 text-slate-500">
            TraceGraph maps production services,
            dependencies, incidents and infrastructure
            relationships.
          </p>
        </div>
      </div>
    </div>
  );
}