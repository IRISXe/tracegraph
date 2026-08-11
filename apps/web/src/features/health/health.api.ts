import {
  apiGet,
} from "../../lib/api";

import type {
  ReadinessResponse,
} from "./health.types";

export function getSystemReadiness() {
  return apiGet<ReadinessResponse>(
    "/ready",
  );
}