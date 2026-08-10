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

export type DependentType =
  | "Service"
  | "Application";

export interface ServiceDependent {
  id: string;
  name: string;
  type: DependentType;
  status: string;
  criticality: string;
  depth: number;
}
export interface ServiceOwner {
  id: string;
  name: string;
  email: string;
}
export interface BlastRadiusSummary {
  affectedComponents: number;
  affectedServices: number;
  affectedApplications: number;
  criticalComponents: number;
  maximumDepth: number;
}

export interface ServiceBlastRadius {
  service: Service;
  summary: BlastRadiusSummary;
  impactedComponents: ServiceDependent[];
}