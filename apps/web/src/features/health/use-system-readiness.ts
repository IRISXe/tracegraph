import {
  useQuery,
} from "@tanstack/react-query";

import {
  getSystemReadiness,
} from "./health.api";

export function useSystemReadiness() {
  return useQuery({
    queryKey: [
      "system-readiness",
    ],

    queryFn:
      getSystemReadiness,

    /*
     * Check system readiness
     * every 30 seconds.
     */
    refetchInterval:
      30_000,

    /*
     * Health checks should fail
     * quickly rather than retrying
     * multiple times.
     */
    retry: false,

    /*
     * Recheck when the user
     * returns to TraceGraph.
     */
    refetchOnWindowFocus:
      true,
  });
}