export interface DashboardSummary {
  applications: number;
  services: number;
  databases: number;
  externalApis: number;
  activeIncidents: number;
  degradedServices: number;
  criticalServices: number;
}

export interface ServiceHealthItem {
  id: string;
  name: string;
  status: string;
  criticality: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  serviceHealth: ServiceHealthItem[];
}

export interface DashboardResponse {
  data: DashboardData;
}