import {
  ArrowRight,
  Box,
} from "lucide-react";
import { Link } from "react-router";

import { StatusBadge } from "../../components/ui/StatusBadge";

import type { Service } from "./service.types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({
  service,
}: ServiceCardProps) {
  return (
    <Link
      to={`/services/${service.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-violet-400/20 hover:bg-white/[0.045]"
    >
     <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition group-hover:border-violet-400/20 group-hover:text-violet-300">
            <Box size={19} />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-white">
              {service.name}
            </h2>

            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {service.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="capitalize">
                {service.criticality}
              </span>

              <span>•</span>

              <span className="capitalize">
                {service.environment}
              </span>

              <span>•</span>

              <span>
                v{service.version}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-start">
          <StatusBadge
            status={service.status}
          />

          <ArrowRight
            size={17}
            className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-300"
          />
        </div>
      </div>
    </Link>
  );
}