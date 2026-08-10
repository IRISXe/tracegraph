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
export type DependencyType =
  | "Service"
  | "Database"
  | "ExternalAPI";

export interface ServiceDependency {
  id: string;
  name: string;
  type: DependencyType;
  status: string;
  criticality: string;
  depth: number;
}