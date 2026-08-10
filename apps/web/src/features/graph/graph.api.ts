import { apiGet } from "../../lib/api";

import type {
  GraphResponse,
  GraphTopology,
} from "./graph.types";

export async function fetchGraph(): Promise<GraphTopology> {
  const response =
    await apiGet<GraphResponse>(
      "/api/graph",
    );

  return response.data;
}