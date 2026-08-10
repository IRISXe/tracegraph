import type {
  ReactNode,
} from "react";

interface PanelProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function Panel({
  title,
  description,
  children,
}: PanelProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-sm font-semibold text-white">
          {title}
        </h2>

        {description ? (
          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        ) : null}
      </div>

      <div className="p-5">
        {children}
      </div>
    </div>
  );
}