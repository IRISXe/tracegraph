import { apiGet } from "../../lib/api";

import type {
  Service,
  ServiceBlastRadius,
  ServiceBlastRadiusResponse,
  ServiceDependenciesResponse,
  ServiceDependency,
  ServiceDependent,
  ServiceDependentsResponse,
  ServiceOwner,
  ServiceOwnerResponse,
  ServiceResponse,
  ServicesResponse,
} from "./service.types";

export async function fetchServices(): Promise<Service[]> {
  const response =
    await apiGet<ServicesResponse>(
      "/api/services",
    );

  return response.data;
}

export async function fetchService(
  serviceId: string,
): Promise<Service> {
  const response =
    await apiGet<ServiceResponse>(
      `/api/services/${serviceId}`,
    );

  return response.data;
}

export async function fetchServiceDependencies(
  serviceId: string,
): Promise<ServiceDependency[]> {
  const response =
    await apiGet<ServiceDependenciesResponse>(
      `/api/services/${serviceId}/dependencies`,
    );

  return response.data.dependencies;
}

export async function fetchServiceDependents(
  serviceId: string,
): Promise<ServiceDependent[]> {
  const response =
    await apiGet<ServiceDependentsResponse>(
      `/api/services/${serviceId}/dependents`,
    );

  return response.data.dependents;
}

export async function fetchServiceOwner(
  serviceId: string,
): Promise<ServiceOwner | null> {
  const response =
    await apiGet<ServiceOwnerResponse>(
      `/api/services/${serviceId}/owner`,
    );

  return response.data.owner;
}

export async function fetchServiceBlastRadius(
  serviceId: string,
): Promise<ServiceBlastRadius> {
  const response =
    await apiGet<ServiceBlastRadiusResponse>(
      `/api/services/${serviceId}/blast-radius`,
    );

  return response.data;
}