import { useIncidents } from "../features/incidents/use-incidents";
import { IncidentCard } from "../features/incidents/IncidentCard";
import { IncidentsError } from "../features/incidents/IncidentsError";
import { IncidentsSkeleton } from "../features/incidents/IncidentsSkeleton";

export function IncidentsPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useIncidents();

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

  const activeIncidents =
    data.filter(
      (incident) =>
        incident.status !== "resolved",
    ).length;

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-violet-400">
            Operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Incidents
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Investigate production incidents,
            affected services and root causes.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          {activeIncidents} active ·{" "}
          {data.length} total
        </div>
      </div>

      {data.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No incidents recorded
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Production incidents will appear
            here when recorded.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {data.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
            />
          ))}
        </div>
      )}
    </section>
  );
}