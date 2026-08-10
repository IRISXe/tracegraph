export type GraphNodeType =
  | "Application"
  | "Service"
  | "Database"
  | "ExternalAPI"
  | "Team"
  | "Incident";

export type GraphRelationshipType =
  | "DEPENDS_ON"
  | "USES"
  | "CALLS"
  | "OWNS"
  | "AFFECTED"
  | "CAUSED_BY";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  name: string;
  status: string | null;
  criticality: string | null;
  metadata: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: GraphRelationshipType;
}

export interface GraphTopology {
  nodes: GraphNode[];
  edges: GraphEdge[];
}