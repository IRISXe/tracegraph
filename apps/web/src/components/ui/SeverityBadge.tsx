interface SeverityBadgeProps {
  severity: string;
}

const severityClasses: Record<
  string,
  string
> = {
  "SEV-1":
    "border-red-400/20 bg-red-400/10 text-red-300",

  "SEV-2":
    "border-orange-400/20 bg-orange-400/10 text-orange-300",

  "SEV-3":
    "border-amber-400/20 bg-amber-400/10 text-amber-300",

  "SEV-4":
    "border-slate-400/20 bg-slate-400/10 text-slate-300",
};

export function SeverityBadge({
  severity,
}: SeverityBadgeProps) {
  return (
    <span
      className={[
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold",
        severityClasses[severity] ??
          severityClasses["SEV-4"],
      ].join(" ")}
    >
      {severity}
    </span>
  );
}