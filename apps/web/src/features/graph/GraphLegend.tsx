import {
  Activity,
  Box,
  Database,
  Globe2,
  Monitor,
  Users,
} from "lucide-react";

const nodeTypes = [
  {
    label: "Application",
    icon: Monitor,
    className:
      "bg-sky-400/10 text-sky-300",
  },
  {
    label: "Service",
    icon: Box,
    className:
      "bg-violet-400/10 text-violet-300",
  },
  {
    label: "Database",
    icon: Database,
    className:
      "bg-emerald-400/10 text-emerald-300",
  },
  {
    label: "External API",
    icon: Globe2,
    className:
      "bg-cyan-400/10 text-cyan-300",
  },
  {
    label: "Team",
    icon: Users,
    className:
      "bg-slate-400/10 text-slate-300",
  },
  {
    label: "Incident",
    icon: Activity,
    className:
      "bg-red-400/10 text-red-300",
  },
];

export function GraphLegend() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d111b]/95 p-4 shadow-xl backdrop-blur-xl">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
        Node Types
      </p>

      <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3">
        {nodeTypes.map(
          ({
            label,
            icon: Icon,
            className,
          }) => (
            <div
              key={label}
              className="flex items-center gap-2"
            >
              <div
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-lg",
                  className,
                ].join(" ")}
              >
                <Icon size={13} />
              </div>

              <span className="text-[11px] text-slate-400">
                {label}
              </span>
            </div>
          ),
        )}
      </div>

      <div className="mt-4 border-t border-white/[0.07] pt-4">
        <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-600">
          Focus
        </p>

        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-violet-400" />

            <span className="text-[11px] text-slate-500">
              Direct connection
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-0.5 w-5 rounded bg-amber-400" />

            <span className="text-[11px] text-slate-500">
              Blast-radius path
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}