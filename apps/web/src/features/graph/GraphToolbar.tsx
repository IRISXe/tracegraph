import {
  RotateCcw,
  Search,
  X,
} from "lucide-react";

import type {
  GraphNodeType,
} from "./graph.types";

export type GraphFilter =
  | "All"
  | GraphNodeType;

interface GraphToolbarProps {
  search: string;
  activeFilter: GraphFilter;
  visibleCount: number;
  totalCount: number;

  onSearchChange: (
    value: string,
  ) => void;

  onFilterChange: (
    filter: GraphFilter,
  ) => void;

  onReset: () => void;
}

const filters: {
  label: string;
  value: GraphFilter;
}[] = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "Apps",
    value: "Application",
  },
  {
    label: "Services",
    value: "Service",
  },
  {
    label: "Databases",
    value: "Database",
  },
  {
    label: "APIs",
    value: "ExternalAPI",
  },
  {
    label: "Teams",
    value: "Team",
  },
  {
    label: "Incidents",
    value: "Incident",
  },
];

export function GraphToolbar({
  search,
  activeFilter,
  visibleCount,
  totalCount,
  onSearchChange,
  onFilterChange,
  onReset,
}: GraphToolbarProps) {
  const hasFilters =
    search.trim().length > 0 ||
    activeFilter !== "All";

  return (
    <div className="absolute left-4 right-4 top-4 z-20 sm:right-auto sm:w-[610px]">
      <div className="rounded-2xl border border-white/10 bg-[#0d111b]/95 p-3 shadow-xl backdrop-blur-xl">
        <div className="flex gap-2">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => {
                onSearchChange(
                  event.target.value,
                );
              }}
              placeholder="Search infrastructure..."
              aria-label="Search infrastructure"
              className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.035] pl-9 pr-9 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-400/30 focus:bg-white/[0.055]"
            />

            {search ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onSearchChange("");
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={14} />
              </button>
            ) : null}
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
            >
              <RotateCcw size={14} />

              <span className="hidden sm:inline">
                Reset
              </span>
            </button>
          ) : null}
        </div>

        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-max gap-1.5">
            {filters.map((filter) => {
              const active =
                activeFilter ===
                filter.value;

              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    onFilterChange(
                      filter.value,
                    );
                  }}
                  className={[
                    "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                    active
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-200",
                  ].join(" ")}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <p className="text-[11px] text-slate-600">
            Showing{" "}
            <span className="font-medium text-slate-400">
              {visibleCount}
            </span>{" "}
            of {totalCount} nodes
          </p>

          {hasFilters ? (
            <p className="text-[11px] text-violet-400">
              Filtered view
            </p>
          ) : (
            <p className="text-[11px] text-slate-600">
              Full topology
            </p>
          )}
        </div>
      </div>
    </div>
  );
}