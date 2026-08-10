import type {
  GraphTopology,
} from "./graph.types";

import {
  findGraphTopology,
} from "./graph.repository";

export async function getGraphTopology(): Promise<GraphTopology> {
  return findGraphTopology();
}