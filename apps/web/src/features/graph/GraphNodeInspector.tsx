import {
  Activity,
  ArrowUpRight,
  Box,
  Database,
  Globe2,
  Monitor,
  Users,
  X,
} from "lucide-react";
import { Link } from "react-router";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type {
  GraphNode,
} from "./graph.types";

interface GraphNodeInspectorProps {
  node: GraphNode;
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
  const value = node.metadata[key];

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
  onClose,
}: GraphNodeInspectorProps) {
  const Icon = nodeIcons[node.type];

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
    <aside className="absolute right-4 top-32 z-30 w-[340px] max-w-[calc(100%-2rem)] overflow-hidden rounded-2xl border border-white/10 bg-[#0d111b]/95 shadow-2xl backdrop-blur-xl lg:top-4">
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
          className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
          aria-label="Close inspector"
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
                status={node.status}
              />
            </div>
          </div>
        ) : null}

        {node.criticality ? (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Criticality
            </p>

            <p className="mt-1 text-sm capitalize text-slate-300">
              {node.criticality}
            </p>
          </div>
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

        <InspectorAction
          node={node}
        />
      </div>
    </aside>
  );
}

function MetadataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mt-5">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-300">
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
  let href: string | null = null;
  let label: string | null = null;

  if (node.type === "Service") {
    href = `/services/${node.id}`;
    label = "View full service details";
  }

  if (node.type === "Incident") {
    href = `/incidents/${node.id}`;
    label = "View incident details";
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