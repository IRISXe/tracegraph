import {
  Activity,
  ArrowUpRight,
  Box,
  Database,
  GitBranch,
  Globe2,
  Monitor,
  Network,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type {
  GraphNode,
} from "./graph.types";

export type GraphFocusMode =
  | "connections"
  | "blast-radius";

interface BlastRadiusSummary {
  affectedComponents: number;
  affectedServices: number;
  affectedApplications: number;
  maximumDepth: number;
}

interface GraphNodeInspectorProps {
  node: GraphNode;
  focusMode: GraphFocusMode;

  blastRadiusSummary?:
    BlastRadiusSummary;

  isBlastRadiusLoading?: boolean;
  isBlastRadiusError?: boolean;

  onFocusModeChange: (
    mode: GraphFocusMode,
  ) => void;

  onClose: () => void;
}

const nodeIcons = {
  Application: Monitor,
  Service: Box,
  Database,
  ExternalAPI: Globe2,
  Team: Users,
  Incident: Activity,
};

function getMetadataValue(
  node: GraphNode,
  key: string,
) {
  const value =
    node.metadata[key];

  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  return String(value);
}

export function GraphNodeInspector({
  node,
  focusMode,
  blastRadiusSummary,
  isBlastRadiusLoading,
  isBlastRadiusError,
  onFocusModeChange,
  onClose,
}: GraphNodeInspectorProps) {
  const Icon =
    nodeIcons[node.type];

  const description =
    getMetadataValue(
      node,
      "description",
    );

  const environment =
    getMetadataValue(
      node,
      "environment",
    );

  const version =
    getMetadataValue(
      node,
      "version",
    );

  const engine =
    getMetadataValue(
      node,
      "engine",
    );

  const provider =
    getMetadataValue(
      node,
      "provider",
    );

  const email =
    getMetadataValue(
      node,
      "email",
    );

  const severity =
    getMetadataValue(
      node,
      "severity",
    );

  const title =
    getMetadataValue(
      node,
      "title",
    );

  return (
    <aside className="absolute right-4 top-32 z-30 w-[340px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b]/95 shadow-2xl backdrop-blur-xl xl:top-4">
      <div className="flex items-start justify-between border-b border-white/10 p-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
            <Icon size={18} />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {node.name}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {node.type}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close inspector"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
        >
          <X size={17} />
        </button>
      </div>

      <div className="max-h-[calc(100vh-230px)] overflow-y-auto p-5">
        {node.status ? (
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Status
            </p>

            <div className="mt-2">
              <StatusBadge
                status={
                  node.status
                }
              />
            </div>
          </div>
        ) : null}

        {node.criticality ? (
          <MetadataRow
            label="Criticality"
            value={
              node.criticality
            }
            capitalize
          />
        ) : null}

        {description ? (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Description
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>
        ) : null}

        {environment ? (
          <MetadataRow
            label="Environment"
            value={environment}
            capitalize
          />
        ) : null}

        {version ? (
          <MetadataRow
            label="Version"
            value={version}
          />
        ) : null}

        {engine ? (
          <MetadataRow
            label="Engine"
            value={engine}
          />
        ) : null}

        {provider ? (
          <MetadataRow
            label="Provider"
            value={provider}
          />
        ) : null}

        {email ? (
          <MetadataRow
            label="Email"
            value={email}
          />
        ) : null}

        {severity ? (
          <MetadataRow
            label="Severity"
            value={severity}
          />
        ) : null}

        {title ? (
          <MetadataRow
            label="Incident"
            value={title}
          />
        ) : null}

        {node.type ===
        "Service" ? (
          <div className="mt-6 border-t border-white/[0.07] pt-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Graph Focus
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onFocusModeChange(
                    "connections",
                  );
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                  focusMode ===
                  "connections"
                    ? "border-violet-400/25 bg-violet-500/10 text-violet-200"
                    : "border-white/10 bg-white/[0.025] text-slate-500 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <GitBranch
                  size={14}
                />

                Direct
              </button>

              <button
                type="button"
                onClick={() => {
                  onFocusModeChange(
                    "blast-radius",
                  );
                }}
                className={[
                  "flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition",
                  focusMode ===
                  "blast-radius"
                    ? "border-amber-400/25 bg-amber-400/[0.08] text-amber-200"
                    : "border-white/10 bg-white/[0.025] text-slate-500 hover:bg-white/5 hover:text-white",
                ].join(" ")}
              >
                <Network size={14} />

                Blast Radius
              </button>
            </div>

            {focusMode ===
            "blast-radius" ? (
              <BlastRadiusState
                summary={
                  blastRadiusSummary
                }
                isLoading={
                  isBlastRadiusLoading
                }
                isError={
                  isBlastRadiusError
                }
              />
            ) : (
              <p className="mt-3 text-xs leading-5 text-slate-600">
                Highlights components
                directly connected to
                this service.
              </p>
            )}
          </div>
        ) : null}

        <InspectorAction
          node={node}
        />
      </div>
    </aside>
  );
}

function BlastRadiusState({
  summary,
  isLoading,
  isError,
}: {
  summary?:
    BlastRadiusSummary;
  isLoading?: boolean;
  isError?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mt-4 animate-pulse rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="h-3 w-28 rounded bg-white/10" />

        <div className="mt-3 h-7 w-16 rounded bg-white/10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-4 rounded-xl border border-red-400/15 bg-red-400/[0.04] p-4">
        <p className="text-xs font-medium text-red-300">
          Unable to calculate
          blast radius.
        </p>

        <p className="mt-1 text-[11px] leading-5 text-slate-600">
          Switch back to direct
          connections or try again
          later.
        </p>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="grid grid-cols-2 gap-2">
        <SummaryMetric
          value={
            summary.affectedComponents
          }
          label="Components"
        />

        <SummaryMetric
          value={
            summary.affectedApplications
          }
          label="Applications"
        />

        <SummaryMetric
          value={
            summary.affectedServices
          }
          label="Services"
        />

        <SummaryMetric
          value={
            summary.maximumDepth
          }
          label="Max depth"
        />
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-600">
        Shows downstream systems
        that could be affected if
        this service becomes
        unavailable.
      </p>
    </div>
  );
}

function SummaryMetric({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
      <p className="text-lg font-semibold text-white">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-slate-600">
        {label}
      </p>
    </div>
  );
}

function MetadataRow({
  label,
  value,
  capitalize = false,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <div className="mt-5">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p
        className={[
          "mt-1 break-words text-sm text-slate-300",
          capitalize
            ? "capitalize"
            : "",
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

function InspectorAction({
  node,
}: {
  node: GraphNode;
}) {
  let href: string | null =
    null;

  let label: string | null =
    null;

  if (node.type === "Service") {
    href =
      `/services/${node.id}`;

    label =
      "View full service details";
  }

  if (
    node.type === "Incident"
  ) {
    href =
      `/incidents/${node.id}`;

    label =
      "View incident details";
  }

  if (!href || !label) {
    return null;
  }

  return (
    <Link
      to={href}
      className="mt-6 flex items-center justify-between rounded-xl border border-violet-400/15 bg-violet-500/[0.07] px-4 py-3 text-sm font-medium text-violet-200 transition hover:bg-violet-500/10"
    >
      {label}

      <ArrowUpRight size={16} />
    </Link>
  );
}