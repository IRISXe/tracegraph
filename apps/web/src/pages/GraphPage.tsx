import {
  GitBranch,
} from "lucide-react";

import { GraphError } from "../features/graph/GraphError";
import { GraphExplorer } from "../features/graph/GraphExplorer";
import { GraphSkeleton } from "../features/graph/GraphSkeleton";
import { useGraph } from "../features/graph/use-graph";

export function GraphPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGraph();

  if (isLoading) {
    return <GraphSkeleton />;
  }

  if (isError || !data) {
    return (
      <GraphError
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-violet-400">
            Topology
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Dependency Graph
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore applications, services,
            databases, external APIs,
            ownership and incidents across the
            production environment.
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3">
          <GitBranch
            size={17}
            className="text-violet-300"
          />

          <div>
            <p className="text-sm font-medium text-white">
              {data.nodes.length} nodes
            </p>

            <p className="text-xs text-slate-500">
              {data.edges.length} relationships
            </p>
          </div>
        </div>
      </div>

      {data.nodes.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No topology available
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Graph nodes will appear here once
            infrastructure information is
            available.
          </p>
        </div>
      ) : (
        <div className="mt-8">
          <GraphExplorer
            topology={data}
          />
        </div>
      )}
    </section>
  );
}