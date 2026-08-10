interface StatusBadgeProps {
  status: string;
}

const statusClasses: Record<string, string> = {
  healthy:
    "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",

  degraded:
    "border-amber-400/20 bg-amber-400/10 text-amber-300",

  critical:
    "border-red-400/20 bg-red-400/10 text-red-300",

  unknown:
    "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

export function StatusBadge({
  status,
}: StatusBadgeProps) {
  const className =
    statusClasses[status] ??
    statusClasses.unknown;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        className,
      ].join(" ")}
    >
      {status}
    </span>
  );
}