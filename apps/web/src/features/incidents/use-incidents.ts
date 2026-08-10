import { useQuery } from "@tanstack/react-query";

import { fetchIncidents } from "./incident.api";

export function useIncidents() {
  return useQuery({
    queryKey: ["incidents"],
    queryFn: fetchIncidents,
  });
}