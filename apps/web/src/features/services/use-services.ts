import { useQuery } from "@tanstack/react-query";

import { fetchServices } from "./service.api";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
}