import type { DashboardData } from "./dashboard.types";

import {
  getDashboardSummary,
  getServiceHealth,
} from "./dashboard.repository";

export async function getDashboardData(): Promise<DashboardData> {
  const summary = await getDashboardSummary();

  const serviceHealth = await getServiceHealth();

  return {
    summary,
    serviceHealth,
  };
}