import { apiGet } from "../../lib/api";

import type {
  Incident,
  IncidentDetail,
  IncidentDetailResponse,
  IncidentsResponse,
} from "./incident.types";

export async function fetchIncidents(): Promise<
  Incident[]
> {
  const response =
    await apiGet<IncidentsResponse>(
      "/api/incidents",
    );

  return response.data;
}

export async function fetchIncident(
  incidentId: string,
): Promise<IncidentDetail> {
  const response =
    await apiGet<IncidentDetailResponse>(
      `/api/incidents/${incidentId}`,
    );

  return response.data;
}