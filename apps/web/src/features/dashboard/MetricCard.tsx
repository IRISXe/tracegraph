import type {
  LucideIcon,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/15 hover:bg-white/[0.04]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">
            {title}
          </p>

          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/10 bg-violet-500/10 text-violet-300">
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}