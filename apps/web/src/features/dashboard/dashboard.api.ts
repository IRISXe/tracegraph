import { apiGet } from "../../lib/api";

import type {
  DashboardResponse,
} from "./dashboard.types";

export async function fetchDashboard() {
  const response =
    await apiGet<DashboardResponse>(
      "/api/dashboard",
    );

  return response.data;
}