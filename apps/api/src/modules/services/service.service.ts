import { AppError } from "../../utils/app-error";

import {
  findAllServices,
  findServiceById,
  findServiceDependencies,
  findServiceDependents,
  findServiceOwner,
} from "./service.repository";

import type {
  ServiceBlastRadius,
} from "./service.types";


export async function getServices() {
  return findAllServices();
}

export async function getServiceById(serviceId: string) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new AppError(
      404,
      "SERVICE_NOT_FOUND",
      `Service '${serviceId}' was not found`,
    );
  }

  return service;
}
export async function getServiceDependencies(
  serviceId: string,
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new AppError(
      404,
      "SERVICE_NOT_FOUND",
      `Service '${serviceId}' was not found`,
    );
  }

  const dependencies =
    await findServiceDependencies(serviceId);

  return {
    service,
    dependencies,
  };
}
export async function getServiceDependents(
  serviceId: string,
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new AppError(
      404,
      "SERVICE_NOT_FOUND",
      `Service '${serviceId}' was not found`,
    );
  }

  const dependents =
    await findServiceDependents(serviceId);

  return {
    service,
    dependents,
  };
}
export async function getServiceOwner(
  serviceId: string,
) {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new AppError(
      404,
      "SERVICE_NOT_FOUND",
      `Service '${serviceId}' was not found`,
    );
  }

  const owner = await findServiceOwner(serviceId);

  return {
    service,
    owner,
  };
}
export async function getServiceBlastRadius(
  serviceId: string,
): Promise<ServiceBlastRadius> {
  const service = await findServiceById(serviceId);

  if (!service) {
    throw new AppError(
      404,
      "SERVICE_NOT_FOUND",
      `Service '${serviceId}' was not found`,
    );
  }

  const impactedComponents =
    await findServiceDependents(serviceId);

  const affectedServices =
    impactedComponents.filter(
      (component) => component.type === "Service",
    ).length;

  const affectedApplications =
    impactedComponents.filter(
      (component) => component.type === "Application",
    ).length;

  const criticalComponents =
    impactedComponents.filter(
      (component) =>
        component.criticality === "critical",
    ).length;

  const maximumDepth =
    impactedComponents.length === 0
      ? 0
      : Math.max(
          ...impactedComponents.map(
            (component) => component.depth,
          ),
        );

  return {
    service,

    summary: {
      affectedComponents: impactedComponents.length,
      affectedServices,
      affectedApplications,
      criticalComponents,
      maximumDepth,
    },

    impactedComponents,
  };
}