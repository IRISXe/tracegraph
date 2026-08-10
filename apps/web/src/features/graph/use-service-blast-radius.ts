import { useQuery } from "@tanstack/react-query";

import {
  fetchServiceBlastRadius,
} from "../services/service.api";

export function useServiceBlastRadius(
  serviceId: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [
      "service",
      serviceId,
      "blast-radius",
    ],

    queryFn: () =>
      fetchServiceBlastRadius(
        serviceId!,
      ),

    enabled:
      Boolean(serviceId) &&
      enabled,
  });
}