import { useQuery } from "@tanstack/react-query";

import {
  fetchService,
  fetchServiceBlastRadius,
  fetchServiceDependencies,
  fetchServiceDependents,
  fetchServiceOwner,
} from "./service.api";

export function useServiceInspector(
  serviceId: string | undefined,
) {
  const enabled = Boolean(serviceId);

  const serviceQuery = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => fetchService(serviceId!),
    enabled,
  });

  const dependenciesQuery = useQuery({
    queryKey: [
      "service",
      serviceId,
      "dependencies",
    ],
    queryFn: () =>
      fetchServiceDependencies(serviceId!),
    enabled,
  });

  const dependentsQuery = useQuery({
    queryKey: [
      "service",
      serviceId,
      "dependents",
    ],
    queryFn: () =>
      fetchServiceDependents(serviceId!),
    enabled,
  });

  const ownerQuery = useQuery({
    queryKey: [
      "service",
      serviceId,
      "owner",
    ],
    queryFn: () =>
      fetchServiceOwner(serviceId!),
    enabled,
  });

  const blastRadiusQuery = useQuery({
    queryKey: [
      "service",
      serviceId,
      "blast-radius",
    ],
    queryFn: () =>
      fetchServiceBlastRadius(serviceId!),
    enabled,
  });

  const queries = [
    serviceQuery,
    dependenciesQuery,
    dependentsQuery,
    ownerQuery,
    blastRadiusQuery,
  ];

  return {
    service: serviceQuery.data,
    dependencies:
      dependenciesQuery.data ?? [],
    dependents:
      dependentsQuery.data ?? [],
    owner: ownerQuery.data,
    blastRadius:
      blastRadiusQuery.data,

    isLoading: queries.some(
      (query) => query.isLoading,
    ),

    isError: queries.some(
      (query) => query.isError,
    ),

    refetchAll: async () => {
      await Promise.all(
        queries.map((query) =>
          query.refetch(),
        ),
      );
    },
  };
}