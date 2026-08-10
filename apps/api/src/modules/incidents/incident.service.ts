import { AppError } from "../../utils/app-error";

import type {
  IncidentDetail,
} from "./incident.types";

import {
  findAllIncidents,
  findIncidentAffectedServices,
  findIncidentById,
  findIncidentCause,
} from "./incident.repository";

export async function getIncidents() {
  return findAllIncidents();
}

export async function getIncidentById(
  incidentId: string,
): Promise<IncidentDetail> {
  const incident =
    await findIncidentById(incidentId);

  if (!incident) {
    throw new AppError(
      404,
      "INCIDENT_NOT_FOUND",
      `Incident '${incidentId}' was not found`,
    );
  }

  const [
    affectedServices,
    cause,
  ] = await Promise.all([
    findIncidentAffectedServices(incidentId),
    findIncidentCause(incidentId),
  ]);

  return {
    incident,
    affectedServices,
    cause,
  };
}