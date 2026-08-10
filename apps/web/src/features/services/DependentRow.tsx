import {
  Box,
  Monitor,
} from "lucide-react";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type {
  ServiceDependent,
} from "./service.types";

interface DependentRowProps {
  dependent: ServiceDependent;
}

export function DependentRow({
  dependent,
}: DependentRowProps) {
  const Icon =
    dependent.type === "Application"
      ? Monitor
      : Box;

  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400">
          <Icon size={16} />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-200">
            {dependent.name}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {dependent.type} · Depth{" "}
            {dependent.depth}
          </p>
        </div>
      </div>

      <StatusBadge
        status={dependent.status}
      />
    </div>
  );
}