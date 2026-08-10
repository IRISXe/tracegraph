import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Background,
  BackgroundVariant,
  Controls,
  getConnectedEdges,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from "@xyflow/react";

import type {
  InfrastructureFlowEdge,
  InfrastructureFlowNode,
} from "./graph-flow.types";

import { GraphNodeInspector } from "./GraphNodeInspector";
import {
  GraphToolbar,
  type GraphFilter,
} from "./GraphToolbar";
import { InfrastructureNode } from "./InfrastructureNode";
import { transformGraphToFlow } from "./graph-layout";

import type {
  GraphNode,
  GraphTopology,
} from "./graph.types";

interface GraphExplorerProps {
  topology: GraphTopology;
}

const nodeTypes = {
  infrastructure:
    InfrastructureNode,
};

function createSearchText(
  node: GraphNode,
) {
  const metadataValues =
    Object.values(node.metadata)
      .filter(
        (value) =>
          typeof value === "string" ||
          typeof value === "number",
      )
      .map(String);

  return [
    node.id,
    node.name,
    node.type,
    node.status,
    node.criticality,
    ...metadataValues,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function GraphExplorer({
  topology,
}: GraphExplorerProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    activeFilter,
    setActiveFilter,
  ] =
    useState<GraphFilter>("All");

  const [
    selectedNodeId,
    setSelectedNodeId,
  ] = useState<string | null>(
    null,
  );

  const [
    reactFlowInstance,
    setReactFlowInstance,
  ] =
    useState<
      ReactFlowInstance<
        InfrastructureFlowNode,
        InfrastructureFlowEdge
      > | null
    >(null);

  /*
   * Search + type filtering
   */
  const filteredTopology =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const filteredNodes =
        topology.nodes.filter(
          (node) => {
            const matchesType =
              activeFilter === "All" ||
              node.type ===
                activeFilter;

            if (!matchesType) {
              return false;
            }

            if (!query) {
              return true;
            }

            return createSearchText(
              node,
            ).includes(query);
          },
        );

      const visibleNodeIds =
        new Set(
          filteredNodes.map(
            (node) => node.id,
          ),
        );

      const filteredEdges =
        topology.edges.filter(
          (edge) =>
            visibleNodeIds.has(
              edge.source,
            ) &&
            visibleNodeIds.has(
              edge.target,
            ),
        );

      return {
        nodes: filteredNodes,
        edges: filteredEdges,
      };
    }, [
      topology,
      search,
      activeFilter,
    ]);

  /*
   * Transform backend graph into
   * React Flow nodes and edges.
   */
  const transformed =
    useMemo(
      () =>
        transformGraphToFlow(
          filteredTopology,
        ),
      [filteredTopology],
    );

  const [
    nodes,
    setNodes,
    onNodesChange,
  ] =
    useNodesState<InfrastructureFlowNode>(
      [],
    );

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] =
    useEdgesState<InfrastructureFlowEdge>(
      [],
    );

  /*
   * Find the original domain node
   * for the inspector.
   */
  const selectedNode =
    useMemo(() => {
      if (!selectedNodeId) {
        return null;
      }

      return (
        topology.nodes.find(
          (node) =>
            node.id ===
            selectedNodeId,
        ) ?? null
      );
    }, [
      selectedNodeId,
      topology.nodes,
    ]);

  /*
   * Determine direct neighborhood
   * of selected node.
   */
  const connectionState =
    useMemo(() => {
      if (!selectedNodeId) {
        return {
          connectedNodeIds:
            new Set<string>(),

          connectedEdgeIds:
            new Set<string>(),

          incomingCount: 0,
          outgoingCount: 0,
        };
      }

      const selectedFlowNode =
        nodes.find(
          (node) =>
            node.id ===
            selectedNodeId,
        );

      if (!selectedFlowNode) {
        return {
          connectedNodeIds:
            new Set<string>(),

          connectedEdgeIds:
            new Set<string>(),

          incomingCount: 0,
          outgoingCount: 0,
        };
      }

      const connectedEdges =
        getConnectedEdges(
          [selectedFlowNode],
          edges,
        );

      const connectedNodeIds =
        new Set<string>([
          selectedNodeId,
        ]);

      const connectedEdgeIds =
        new Set<string>();

      let incomingCount = 0;
      let outgoingCount = 0;

      connectedEdges.forEach(
        (edge) => {
          connectedEdgeIds.add(
            edge.id,
          );

          connectedNodeIds.add(
            edge.source,
          );

          connectedNodeIds.add(
            edge.target,
          );

          if (
            edge.target ===
            selectedNodeId
          ) {
            incomingCount += 1;
          }

          if (
            edge.source ===
            selectedNodeId
          ) {
            outgoingCount += 1;
          }
        },
      );

      return {
        connectedNodeIds,
        connectedEdgeIds,
        incomingCount,
        outgoingCount,
      };
    }, [
      selectedNodeId,
      nodes,
      edges,
    ]);

  /*
   * Apply visual focus without changing
   * the underlying graph state.
   */
  const displayNodes =
    useMemo(() => {
      if (!selectedNodeId) {
        return nodes;
      }

      return nodes.map((node) => {
        const isConnected =
          connectionState
            .connectedNodeIds
            .has(node.id);

        return {
          ...node,

          style: {
            ...node.style,

            opacity:
              isConnected
                ? 1
                : 0.14,

            transition:
              "opacity 180ms ease",
          },
        };
      });
    }, [
      nodes,
      selectedNodeId,
      connectionState,
    ]);

  const displayEdges =
    useMemo(() => {
      if (!selectedNodeId) {
        return edges;
      }

      return edges.map((edge) => {
        const isConnected =
          connectionState
            .connectedEdgeIds
            .has(edge.id);

        return {
          ...edge,

          animated:
            isConnected,

          style: {
            ...edge.style,

            stroke:
              isConnected
                ? "#8b5cf6"
                : "#334155",

            strokeWidth:
              isConnected
                ? 2.4
                : 1,

            opacity:
              isConnected
                ? 1
                : 0.07,

            transition:
              "opacity 180ms ease",
          },

          labelStyle: {
            ...edge.labelStyle,

            fill:
              isConnected
                ? "#c4b5fd"
                : "#64748b",

            opacity:
              isConnected
                ? 1
                : 0.08,

            fontSize: 9,
          },
        };
      });
    }, [
      edges,
      selectedNodeId,
      connectionState,
    ]);

  /*
   * Sync filtered topology into
   * React Flow state.
   */
  useEffect(() => {
    setNodes(
      transformed.nodes,
    );

    setEdges(
      transformed.edges,
    );

    if (
      !reactFlowInstance ||
      transformed.nodes.length ===
        0
    ) {
      return;
    }

    const frame =
      window.requestAnimationFrame(
        () => {
          void reactFlowInstance.fitView(
            {
              nodes:
                transformed.nodes.map(
                  (node) => ({
                    id: node.id,
                  }),
                ),

              padding:
                transformed.nodes
                  .length === 1
                  ? 0.8
                  : 0.25,

              maxZoom:
                transformed.nodes
                  .length === 1
                  ? 1.15
                  : 0.9,

              duration: 350,
            },
          );
        },
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, [
    transformed,
    setNodes,
    setEdges,
    reactFlowInstance,
  ]);

  /*
   * Close inspector if search/filter
   * removes the selected node.
   */
  useEffect(() => {
    if (!selectedNodeId) {
      return;
    }

    const stillVisible =
      filteredTopology.nodes.some(
        (node) =>
          node.id ===
          selectedNodeId,
      );

    if (!stillVisible) {
      setSelectedNodeId(null);
    }
  }, [
    selectedNodeId,
    filteredTopology.nodes,
  ]);

  /*
   * Select node and zoom to its
   * direct neighborhood.
   */
  const handleNodeClick =
    useCallback<
      NodeMouseHandler<
        InfrastructureFlowNode
      >
    >(
      (
        _event,
        node,
      ) => {
        setSelectedNodeId(
          node.id,
        );

        if (!reactFlowInstance) {
          return;
        }

        const connectedEdges =
          getConnectedEdges(
            [node],
            edges,
          );

        const neighborhoodIds =
          new Set<string>([
            node.id,
          ]);

        connectedEdges.forEach(
          (edge) => {
            neighborhoodIds.add(
              edge.source,
            );

            neighborhoodIds.add(
              edge.target,
            );
          },
        );

        window.requestAnimationFrame(
          () => {
            void reactFlowInstance.fitView(
              {
                nodes: Array.from(
                  neighborhoodIds,
                ).map(
                  (id) => ({
                    id,
                  }),
                ),

                padding: 0.45,
                maxZoom: 1,
                duration: 400,
              },
            );
          },
        );
      },
      [
        reactFlowInstance,
        edges,
      ],
    );

  const handlePaneClick =
    useCallback(() => {
      setSelectedNodeId(null);
    }, []);

  const handleReset =
    useCallback(() => {
      setSearch("");
      setActiveFilter("All");
      setSelectedNodeId(null);
    }, []);

  return (
    <div className="relative h-[calc(100vh-190px)] min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-[#080b12]">
      <ReactFlow<
        InfrastructureFlowNode,
        InfrastructureFlowEdge
      >
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={nodeTypes}
        onNodesChange={
          onNodesChange
        }
        onEdgesChange={
          onEdgesChange
        }
        onNodeClick={
          handleNodeClick
        }
        onPaneClick={
          handlePaneClick
        }
        onInit={
          setReactFlowInstance
        }
        fitView
        fitViewOptions={{
          padding: 0.15,
        }}
        minZoom={0.15}
        maxZoom={1.6}
        nodesConnectable={false}
        deleteKeyCode={null}
      >
        <Background
          variant={
            BackgroundVariant.Dots
          }
          gap={22}
          size={1}
        />

        <Controls />

        <MiniMap
          pannable
          zoomable
        />
      </ReactFlow>

      <GraphToolbar
        search={search}
        activeFilter={
          activeFilter
        }
        visibleCount={
          filteredTopology
            .nodes.length
        }
        totalCount={
          topology.nodes.length
        }
        onSearchChange={
          setSearch
        }
        onFilterChange={
          setActiveFilter
        }
        onReset={
          handleReset
        }
      />

      {filteredTopology.nodes
        .length === 0 ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6">
          <div className="mt-28 rounded-2xl border border-white/10 bg-[#0d111b]/90 px-8 py-7 text-center shadow-xl backdrop-blur">
            <p className="text-sm font-semibold text-slate-300">
              No matching nodes
            </p>

            <p className="mt-2 max-w-xs text-xs leading-5 text-slate-500">
              Try a different search
              term or choose another
              infrastructure type.
            </p>
          </div>
        </div>
      ) : null}

      {selectedNode ? (
        <>
          <GraphNodeInspector
            node={selectedNode}
            onClose={() => {
              setSelectedNodeId(
                null,
              );
            }}
          />

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-violet-400/15 bg-[#0d111b]/90 px-4 py-2 text-xs text-slate-400 shadow-xl backdrop-blur sm:block">
            <span className="font-medium text-violet-300">
              Focused:
            </span>{" "}
            {selectedNode.name}

            <span className="mx-2 text-slate-700">
              •
            </span>

            {
              connectionState
                .connectedEdgeIds
                .size
            }{" "}
            direct relationships
          </div>
        </>
      ) : null}
    </div>
  );
}