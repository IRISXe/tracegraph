import { useQuery } from "@tanstack/react-query";

import { fetchGraph } from "./graph.api";

export function useGraph() {
  return useQuery({
    queryKey: ["graph"],
    queryFn: fetchGraph,
  });
}