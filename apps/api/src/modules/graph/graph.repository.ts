import { driver } from "../../db/cognodb";

import type {
  GraphEdge,
  GraphNode,
  GraphTopology,
} from "./graph.types";

export async function findGraphTopology(): Promise<GraphTopology> {
  const session = driver.session();

  try {
    const nodeResult = await session.run(`
      MATCH (node)

      WHERE
        node:Application
        OR node:Service
        OR node:Database
        OR node:ExternalAPI
        OR node:Team
        OR node:Incident

      RETURN
        node,
        labels(node) AS labels

      ORDER BY
        coalesce(node.name, node.title, node.id),
        node.id
    `);

    const nodes: GraphNode[] =
      nodeResult.records.map((record) => {
        const node = record.get("node");

        const labels =
          record.get("labels") as string[];

        const properties =
          node.properties as Record<
            string,
            unknown
          >;

        const {
          id,
          name,
          status,
          criticality,
          ...metadata
        } = properties;

        /*
         * Most graph nodes use "name".
         *
         * Incidents use "title" instead,
         * so fall back to title before id.
         */
        const displayName =
          name ??
          properties.title ??
          id;

        return {
          id: String(id),

          type:
            labels[0] as GraphNode["type"],

          name: String(displayName),

          status:
            status === undefined ||
            status === null
              ? null
              : String(status),

          criticality:
            criticality === undefined ||
            criticality === null
              ? null
              : String(criticality),

          metadata,
        };
      });

    const edgeResult =
      await session.run(`
        MATCH
          (source)-[relationship]->(target)

        WHERE
          source.id IS NOT NULL
          AND target.id IS NOT NULL

        RETURN
          source.id AS source,
          target.id AS target,
          type(relationship) AS relationshipType

        ORDER BY
          source,
          target
      `);

    const edges: GraphEdge[] =
      edgeResult.records.map(
        (record, index) => {
          const source = String(
            record.get("source"),
          );

          const target = String(
            record.get("target"),
          );

          const type = String(
            record.get(
              "relationshipType",
            ),
          ) as GraphEdge["type"];

          return {
            id: `${source}-${type}-${target}-${index}`,
            source,
            target,
            type,
          };
        },
      );

    return {
      nodes,
      edges,
    };
  } finally {
    await session.close();
  }
}