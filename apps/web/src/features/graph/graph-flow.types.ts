import type {
  Edge,
  Node,
} from "@xyflow/react";

import type {
  GraphNodeType,
} from "./graph.types";

export interface InfrastructureNodeData
  extends Record<string, unknown> {
  label: string;
  nodeType: GraphNodeType;
  status: string | null;
  criticality: string | null;
  metadata: Record<string, unknown>;
}

export type InfrastructureFlowNode =
  Node<
    InfrastructureNodeData,
    "infrastructure"
  >;

export type InfrastructureFlowEdge =
  Edge;