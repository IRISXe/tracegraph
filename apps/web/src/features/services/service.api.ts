import { apiGet } from "../../lib/api";

import type {
  Service,
  ServicesResponse,
} from "./service.types";

export async function fetchServices(): Promise<Service[]> {
  const response =
    await apiGet<ServicesResponse>(
      "/api/services",
    );

  return response.data;
}