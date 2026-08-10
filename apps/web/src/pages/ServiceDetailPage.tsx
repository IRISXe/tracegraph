import {
  ArrowLeft,
  Box,
  GitBranch,
  Mail,
  Network,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  Link,
  useParams,
} from "react-router";

import { Panel } from "../components/ui/Panel";
import { StatusBadge } from "../components/ui/StatusBadge";
import { DependencyRow } from "../features/services/DependencyRow";
import { DependentRow } from "../features/services/DependentRow";
import { ServiceInspectorSkeleton } from "../features/services/ServiceInspectorSkeleton";
import { ServicesError } from "../features/services/ServicesError";
import { useServiceInspector } from "../features/services/use-service-inspector";

export function ServiceDetailPage() {
  const { id } = useParams<{
    id: string;
  }>();

  const {
    service,
    dependencies,
    dependents,
    owner,
    blastRadius,
    isLoading,
    isError,
    refetchAll,
  } = useServiceInspector(id);

  if (isLoading) {
    return <ServiceInspectorSkeleton />;
  }

  if (
    isError ||
    !service ||
    !blastRadius
  ) {
    return (
      <ServicesError
        onRetry={() => {
          void refetchAll();
        }}
      />
    );
  }

  return (
    <section>
      <Link
        to="/services"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
      >
        <ArrowLeft size={16} />

        Back to Services
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-6 xl:flex-row xl:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
              <Box size={20} />
            </div>

            <div>
              <p className="text-sm font-medium text-violet-400">
                Service
              </p>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
                {service.name}
              </h1>
            </div>
          </div>

          <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-400">
            {service.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <StatusBadge
              status={service.status}
            />

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs capitalize text-slate-400">
              {service.criticality} criticality
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs capitalize text-slate-400">
              {service.environment}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
              v{service.version}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <Network
            size={18}
            className="text-violet-300"
          />

          <p className="mt-5 text-2xl font-semibold text-white">
            {dependencies.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Dependencies
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <GitBranch
            size={18}
            className="text-violet-300"
          />

          <p className="mt-5 text-2xl font-semibold text-white">
            {dependents.length}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Dependent systems
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <ShieldAlert
            size={18}
            className="text-amber-300"
          />

          <p className="mt-5 text-2xl font-semibold text-white">
            {
              blastRadius.summary
                .affectedComponents
            }
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Blast radius
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
          <Users
            size={18}
            className="text-violet-300"
          />

          <p className="mt-5 truncate text-sm font-semibold text-white">
            {owner?.name ?? "Unassigned"}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Service owner
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Panel
          title="Dependencies"
          description="Components this service relies on"
        >
          {dependencies.length === 0 ? (
            <p className="text-sm text-slate-500">
              This service has no recorded
              dependencies.
            </p>
          ) : (
            dependencies.map(
              (dependency) => (
                <DependencyRow
                  key={dependency.id}
                  dependency={dependency}
                />
              ),
            )
          )}
        </Panel>

        <Panel
          title="Blast Radius"
          description="Potential impact if this service becomes unavailable"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-2xl font-semibold text-white">
                {
                  blastRadius.summary
                    .affectedComponents
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Components
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-2xl font-semibold text-white">
                {
                  blastRadius.summary
                    .affectedApplications
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Applications
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-2xl font-semibold text-white">
                {
                  blastRadius.summary
                    .affectedServices
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Services
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <p className="text-2xl font-semibold text-white">
                {
                  blastRadius.summary
                    .maximumDepth
                }
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Max depth
              </p>
            </div>
          </div>

          {blastRadius.summary
            .criticalComponents > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-300"
                />

                <div>
                  <p className="text-sm font-medium text-amber-200">
                    {
                      blastRadius.summary
                        .criticalComponents
                    }{" "}
                    critical components may be
                    affected
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Review dependent systems
                    before performing maintenance
                    on this service.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </Panel>

        <Panel
          title="Dependent Systems"
          description="Applications and services that rely on this service"
        >
          {dependents.length === 0 ? (
            <p className="text-sm text-slate-500">
              No systems currently depend on
              this service.
            </p>
          ) : (
            dependents.map(
              (dependent) => (
                <DependentRow
                  key={dependent.id}
                  dependent={dependent}
                />
              ),
            )
          )}
        </Panel>

        <Panel
          title="Ownership"
          description="Operational responsibility for this service"
        >
          {owner ? (
            <div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                <Users size={19} />
              </div>

              <p className="mt-4 text-sm font-semibold text-white">
                {owner.name}
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                <Mail size={15} />

                <span className="break-all">
                {owner.email}
               </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              No owner has been assigned to
              this service.
            </p>
          )}
        </Panel>
      </div>
    </section>
  );
}