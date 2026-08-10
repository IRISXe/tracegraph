import {
  ArrowRight,
  Clock3,
} from "lucide-react";
import { Link } from "react-router";

import { IncidentStatusBadge } from "../../components/ui/IncidentStatusBadge";
import { SeverityBadge } from "../../components/ui/SeverityBadge";

import type {
  Incident,
} from "./incident.types";

interface IncidentCardProps {
  incident: Incident;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function IncidentCard({
  incident,
}: IncidentCardProps) {
  return (
    <Link
      to={`/incidents/${incident.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-violet-400/20 hover:bg-white/[0.045]"
    >
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge
              severity={incident.severity}
            />

            <IncidentStatusBadge
              status={incident.status}
            />

            <span className="text-xs font-medium text-slate-500">
              {incident.id}
            </span>
          </div>

          <h2 className="mt-4 text-base font-semibold text-white">
            {incident.title}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {incident.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600">
            <Clock3 size={14} />

            <span>
              Started {formatDate(incident.startedAt)}
            </span>
          </div>
        </div>

        <ArrowRight
          size={18}
          className="shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-300"
        />
      </div>
    </Link>
  );
}