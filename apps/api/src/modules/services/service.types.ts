export type ServiceStatus =
  | "healthy"
  | "degraded"
  | "critical"
  | "unknown";

export type ServiceCriticality =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Service {
  id: string;
  name: string;
  description: string;
  environment: string;
  status: ServiceStatus;
  criticality: ServiceCriticality;
  version: string;
}