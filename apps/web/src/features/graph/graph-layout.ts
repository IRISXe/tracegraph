import {
  MarkerType,
} from "@xyflow/react";

import type {
  InfrastructureFlowEdge,
  InfrastructureFlowNode,
} from "./graph-flow.types";

import type {
  GraphNode,
  GraphNodeType,
  GraphTopology,
  GraphRelationshipType,
} from "./graph.types";

interface LayoutConfig {
  x: number;
  startY: number;
  gap: number;
}

const relationshipLabels: Record<
  GraphRelationshipType,
  string
> = {
  DEPENDS_ON: "depends on",
  USES: "uses",
  CALLS: "calls",
  OWNS: "owns",
  AFFECTED: "affected",
  CAUSED_BY: "caused by",
};

const layout: Record<
  GraphNodeType,
  LayoutConfig
> = {
  Application: {
    x: 0,
    startY: 0,
    gap: 150,
  },

  Team: {
    x: 0,
    startY: 520,
    gap: 150,
  },

  Incident: {
    x: 0,
    startY: 1160,
    gap: 160,
  },

  Service: {
    x: 420,
    startY: 0,
    gap: 160,
  },

  Database: {
    x: 840,
    startY: 0,
    gap: 160,
  },

  ExternalAPI: {
    x: 840,
    startY: 900,
    gap: 160,
  },
};

function createPositions(
  graphNodes: GraphNode[],
) {
  const counters: Record<
    GraphNodeType,
    number
  > = {
    Application: 0,
    Service: 0,
    Database: 0,
    ExternalAPI: 0,
    Team: 0,
    Incident: 0,
  };

  return graphNodes.map((node) => {
    const config =
      layout[node.type];

    const index =
      counters[node.type]++;

    return {
      node,

      position: {
        x: config.x,

        y:
          config.startY +
          index * config.gap,
      },
    };
  });
}

export function transformGraphToFlow(
  topology: GraphTopology,
): {
  nodes: InfrastructureFlowNode[];
  edges: InfrastructureFlowEdge[];
} {
  const positionedNodes =
    createPositions(topology.nodes);

  const nodes: InfrastructureFlowNode[] =
    positionedNodes.map(
      ({
        node,
        position,
      }) => ({
        id: node.id,

        type: "infrastructure",

        position,

        data: {
          label: node.name,
          nodeType: node.type,
          status: node.status,
          criticality:
            node.criticality,
          metadata:
            node.metadata,
        },
      }),
    );

  const edges: InfrastructureFlowEdge[] =
    topology.edges.map(
      (edge) => ({
        id: edge.id,

        source:
          edge.source,

        target:
          edge.target,

        type: "smoothstep",

        label:
          relationshipLabels[
            edge.type
          ],

        markerEnd: {
          type:
            MarkerType.Arrow,
        },

        style: {
          strokeWidth: 1.2,
        },

        labelStyle: {
          fontSize: 9,
        },
      }),
    );

  return {
    nodes,
    edges,
  };
}