import { useQuery } from "@tanstack/react-query";

import { fetchIncident } from "./incident.api";

export function useIncident(
  incidentId: string | undefined,
) {
  return useQuery({
    queryKey: [
      "incident",
      incidentId,
    ],

    queryFn: () =>
      fetchIncident(incidentId!),

    enabled: Boolean(incidentId),
  });
}