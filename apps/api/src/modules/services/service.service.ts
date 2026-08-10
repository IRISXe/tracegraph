import { AppError } from "../../utils/app-error";

import {
  findAllServices,
  findServiceById,
  findServiceDependencies,
} from "./service.repository";


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