import {
  Activity,
  Boxes,
  Layers3,
  TriangleAlert,
} from "lucide-react";

import {
  ApiErrorState,
} from "../components/feedback/ApiErrorState";

import {
  StatusBadge,
} from "../components/ui/StatusBadge";

import {
  DashboardSkeleton,
} from "../features/dashboard/DashboardSkeleton";

import {
  MetricCard,
} from "../features/dashboard/MetricCard";

import {
  useDashboard,
} from "../features/dashboard/use-dashboard";

export function DashboardPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboard();

  /*
   * Loading state
   */
  if (isLoading) {
    return (
      <DashboardSkeleton />
    );
  }

  /*
   * API / CognoDB error state
   */
  if (isError) {
    return (
      <ApiErrorState
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  /*
   * Defensive fallback.
   *
   * Normally TanStack Query will provide
   * data here after loading succeeds,
   * but this prevents runtime errors if
   * the response is unexpectedly empty.
   */
  if (!data) {
    return (
      <ApiErrorState
        error={
          new Error(
            "Dashboard data is unavailable",
          )
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section>
      {/* Page heading */}

      <div>
        <p className="text-sm font-medium text-violet-400">
          Overview
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
          System Overview
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Monitor infrastructure health,
          dependencies and active incidents
          across the production environment.
        </p>
      </div>

      {/* Metrics */}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Services"
          value={
            data.summary.services
          }
          description="Production services monitored"
          icon={Boxes}
        />

        <MetricCard
          title="Applications"
          value={
            data.summary.applications
          }
          description="User-facing applications"
          icon={Layers3}
        />

        <MetricCard
          title="Active Incidents"
          value={
            data.summary.activeIncidents
          }
          description="Incidents requiring attention"
          icon={Activity}
        />

        <MetricCard
          title="Degraded Services"
          value={
            data.summary.degradedServices
          }
          description="Services outside healthy state"
          icon={TriangleAlert}
        />
      </div>

      {/* Service health */}

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="font-semibold text-white">
              Service Health
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Current health of
              production services
            </p>
          </div>

          <span className="text-xs text-slate-500">
            {
              data.serviceHealth
                .length
            }{" "}
            services
          </span>
        </div>

        {/* Empty state */}

        {data.serviceHealth.length ===
        0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-medium text-slate-300">
              No services available
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Service health
              information will appear
              here when available.
            </p>
          </div>
        ) : (
          <div>
            {data.serviceHealth.map(
              (service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-3">
                    {/* Status indicator */}

                    <span
                      aria-hidden="true"
                      className={[
                        "h-2.5 w-2.5 rounded-full",

                        service.status ===
                        "healthy"
                          ? "bg-emerald-400"
                          : service.status ===
                              "degraded"
                            ? "bg-amber-400"
                            : service.status ===
                                "critical"
                              ? "bg-red-400"
                              : "bg-slate-500",
                      ].join(" ")}
                    />

                    <div>
                      <p className="text-sm font-medium text-slate-200">
                        {
                          service.name
                        }
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-slate-500">
                        {
                          service.criticality
                        }{" "}
                        criticality
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={
                      service.status
                    }
                  />
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </section>
  );
}