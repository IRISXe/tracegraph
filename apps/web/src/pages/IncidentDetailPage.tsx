import {
  ArrowLeft,
  Clock3,
  Database,
  Server,
  TriangleAlert,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router";

import { IncidentStatusBadge } from "../components/ui/IncidentStatusBadge";
import { Panel } from "../components/ui/Panel";
import { SeverityBadge } from "../components/ui/SeverityBadge";
import { StatusBadge } from "../components/ui/StatusBadge";
import { IncidentsError } from "../features/incidents/IncidentsError";
import { IncidentsSkeleton } from "../features/incidents/IncidentsSkeleton";
import { useIncident } from "../features/incidents/use-incident";

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function IncidentDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useIncident(id);

  if (isLoading) {
    return <IncidentsSkeleton />;
  }

  if (isError || !data) {
    return (
      <IncidentsError
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const {
    incident,
    affectedServices,
    cause,
  } = data;

  return (
    <section>
      <Link
        to="/incidents"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />

        Back to Incidents
      </Link>

      <div className="mt-6">
        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge
            severity={incident.severity}
          />

          <IncidentStatusBadge
            status={incident.status}
          />

          <span className="text-sm font-medium text-slate-500">
            {incident.id}
          </span>
        </div>

        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-white">
          {incident.title}
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          {incident.description}
        </p>

        <div className="mt-5 flex flex-wrap gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Clock3 size={14} />

            Started{" "}
            {formatDate(
              incident.startedAt,
            )}
          </div>

          {incident.resolvedAt ? (
            <div>
              Resolved{" "}
              {formatDate(
                incident.resolvedAt,
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Root Cause"
          description="Component identified as the cause of this incident"
        >
          {cause ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                  {cause.type ===
                  "Database" ? (
                    <Database size={19} />
                  ) : (
                    <Server size={19} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {cause.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {cause.type} ·{" "}
                    {cause.criticality}
                  </p>
                </div>
              </div>

              <StatusBadge
                status={cause.status}
              />
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <TriangleAlert
                size={18}
                className="text-amber-300"
              />

              <p className="text-sm text-slate-500">
                Root cause has not yet been
                identified.
              </p>
            </div>
          )}
        </Panel>

        <Panel
          title="Impact Summary"
          description="Infrastructure affected by this incident"
        >
          <p className="text-3xl font-semibold text-white">
            {affectedServices.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            affected services
          </p>
        </Panel>

        <div className="xl:col-span-2">
          <Panel
            title="Affected Services"
            description="Production services impacted by this incident"
          >
            {affectedServices.length ===
            0 ? (
              <p className="text-sm text-slate-500">
                No affected services recorded.
              </p>
            ) : (
              <div>
                {affectedServices.map(
                  (service) => (
                    <Link
                      key={service.id}
                      to={`/services/${service.id}`}
                      className="flex items-center justify-between border-b border-white/[0.06] py-4 first:pt-0 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          {service.name}
                        </p>

                        <p className="mt-1 text-xs capitalize text-slate-500">
                          {
                            service.criticality
                          }{" "}
                          criticality
                        </p>
                      </div>

                      <StatusBadge
                        status={
                          service.status
                        }
                      />
                    </Link>
                  ),
                )}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </section>
  );
}