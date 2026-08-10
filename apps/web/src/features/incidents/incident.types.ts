export type IncidentSeverity =
  | "SEV-1"
  | "SEV-2"
  | "SEV-3"
  | "SEV-4";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "resolved";

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  startedAt: string;
  resolvedAt: string | null;
}

export interface IncidentAffectedService {
  id: string;
  name: string;
  status: string;
  criticality: string;
}

export interface IncidentCause {
  id: string;
  name: string;
  type: "Service" | "Database";
  status: string;
  criticality: string;
}

export interface IncidentDetail {
  incident: Incident;
  affectedServices: IncidentAffectedService[];
  cause: IncidentCause | null;
}

export interface IncidentsResponse {
  data: Incident[];
}

export interface IncidentDetailResponse {
  data: IncidentDetail;
}