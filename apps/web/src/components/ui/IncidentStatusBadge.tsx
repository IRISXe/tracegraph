interface IncidentStatusBadgeProps {
  status: string;
}

const classes: Record<string, string> = {
  investigating:
    "border-red-400/20 bg-red-400/10 text-red-300",

  identified:
    "border-orange-400/20 bg-orange-400/10 text-orange-300",

  monitoring:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",

  resolved:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
};

export function IncidentStatusBadge({
  status,
}: IncidentStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        classes[status] ??
          "border-slate-400/20 bg-slate-400/10 text-slate-300",
      ].join(" ")}
    >
      {status}
    </span>
  );
}