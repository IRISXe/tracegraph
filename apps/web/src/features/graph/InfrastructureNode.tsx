import {
  Activity,
  Box,
  Database,
  Globe2,
  Monitor,
  Users,
} from "lucide-react";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import type {
  InfrastructureFlowNode,
} from "./graph-flow.types";

const typeStyles = {
  Application: {
    icon: Monitor,
    classes:
      "border-sky-400/20 bg-sky-400/[0.07] text-sky-300",
  },

  Service: {
    icon: Box,
    classes:
      "border-violet-400/20 bg-violet-400/[0.07] text-violet-300",
  },

  Database: {
    icon: Database,
    classes:
      "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-300",
  },

  ExternalAPI: {
    icon: Globe2,
    classes:
      "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-300",
  },

  Team: {
    icon: Users,
    classes:
      "border-slate-400/20 bg-slate-400/[0.07] text-slate-300",
  },

  Incident: {
    icon: Activity,
    classes:
      "border-red-400/20 bg-red-400/[0.07] text-red-300",
  },
};

function getStatusDot(status: string | null) {
  switch (status) {
    case "healthy":
    case "resolved":
      return "bg-emerald-400";

    case "degraded":
    case "monitoring":
      return "bg-amber-400";

    case "critical":
    case "investigating":
      return "bg-red-400";

    case "identified":
      return "bg-orange-400";

    default:
      return "bg-slate-500";
  }
}

export function InfrastructureNode({
  data,
  selected,
}: NodeProps<InfrastructureFlowNode>) {
  const config =
    typeStyles[data.nodeType];

  const Icon = config.icon;

  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2 !w-2 !border-0 !bg-slate-500"
      />

      <div
        className={[
          "w-56 rounded-2xl border bg-[#0d111b]/95 p-4 shadow-xl backdrop-blur transition",
          selected
            ? "border-violet-400/60 ring-2 ring-violet-400/15"
            : "border-white/10",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border",
              config.classes,
            ].join(" ")}
          >
            <Icon size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {data.label}
            </p>

            <div className="mt-1 flex items-center gap-2">
              {data.status ? (
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    getStatusDot(
                      data.status,
                    ),
                  ].join(" ")}
                />
              ) : null}

              <span className="text-[11px] text-slate-500">
                {data.nodeType}
              </span>
            </div>
          </div>
        </div>

        {data.criticality ? (
          <div className="mt-3 border-t border-white/[0.06] pt-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-600">
              Criticality
            </p>

            <p className="mt-1 text-xs capitalize text-slate-400">
              {data.criticality}
            </p>
          </div>
        ) : null}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2 !w-2 !border-0 !bg-slate-500"
      />
    </>
  );
}