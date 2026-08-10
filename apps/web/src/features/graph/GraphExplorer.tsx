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

import {
  GraphNodeInspector,
  type GraphFocusMode,
} from "./GraphNodeInspector";

import {
  GraphToolbar,
  type GraphFilter,
} from "./GraphToolbar";

import { InfrastructureNode } from "./InfrastructureNode";
import { transformGraphToFlow } from "./graph-layout";
import { useServiceBlastRadius } from "./use-service-blast-radius";

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
          typeof value ===
            "string" ||
          typeof value ===
            "number",
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
  ] = useState<
    string | null
  >(null);

  const [
    focusMode,
    setFocusMode,
  ] =
    useState<GraphFocusMode>(
      "connections",
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
   * Search + type filtering.
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
              activeFilter ===
                "All" ||
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
            (node) =>
              node.id,
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
        nodes:
          filteredNodes,

        edges:
          filteredEdges,
      };
    }, [
      topology,
      search,
      activeFilter,
    ]);

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

  const selectedServiceId =
    selectedNode?.type ===
    "Service"
      ? selectedNode.id
      : undefined;

  const blastRadiusEnabled =
    focusMode ===
      "blast-radius" &&
    Boolean(
      selectedServiceId,
    );

  const {
    data: blastRadius,
    isLoading:
      isBlastRadiusLoading,
    isError:
      isBlastRadiusError,
  } = useServiceBlastRadius(
    selectedServiceId,
    blastRadiusEnabled,
  );

  /*
   * Direct one-hop neighborhood.
   */
  const connectionState =
    useMemo(() => {
      if (!selectedNodeId) {
        return {
          nodeIds:
            new Set<string>(),

          edgeIds:
            new Set<string>(),
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
          nodeIds:
            new Set<string>(),

          edgeIds:
            new Set<string>(),
        };
      }

      const connectedEdges =
        getConnectedEdges(
          [selectedFlowNode],
          edges,
        );

      const nodeIds =
        new Set<string>([
          selectedNodeId,
        ]);

      const edgeIds =
        new Set<string>();

      connectedEdges.forEach(
        (edge) => {
          edgeIds.add(
            edge.id,
          );

          nodeIds.add(
            edge.source,
          );

          nodeIds.add(
            edge.target,
          );
        },
      );

      return {
        nodeIds,
        edgeIds,
      };
    }, [
      selectedNodeId,
      nodes,
      edges,
    ]);

  /*
   * Multi-hop blast radius.
   *
   * Blast radius only follows
   * DEPENDS_ON relationships.
   *
   * It intentionally excludes
   * ownership, incidents, databases
   * and external APIs from the
   * downstream impact chain.
   */
  const blastRadiusState =
    useMemo(() => {
      const nodeIds =
        new Set<string>();

      const edgeIds =
        new Set<string>();

      if (
        !selectedNodeId ||
        !blastRadius
      ) {
        return {
          nodeIds,
          edgeIds,
        };
      }

      nodeIds.add(
        selectedNodeId,
      );

      blastRadius
        .impactedComponents
        .forEach(
          (component) => {
            nodeIds.add(
              component.id,
            );
          },
        );

      topology.edges.forEach(
        (edge) => {
          const belongsToImpactChain =
            edge.type ===
              "DEPENDS_ON" &&
            nodeIds.has(
              edge.source,
            ) &&
            nodeIds.has(
              edge.target,
            );

          if (
            belongsToImpactChain
          ) {
            edgeIds.add(
              edge.id,
            );
          }
        },
      );

      return {
        nodeIds,
        edgeIds,
      };
    }, [
      selectedNodeId,
      blastRadius,
      topology.edges,
    ]);

  const blastRadiusActive =
    focusMode ===
      "blast-radius" &&
    Boolean(blastRadius);

  const activeNodeIds =
    blastRadiusActive
      ? blastRadiusState.nodeIds
      : connectionState.nodeIds;

  const activeEdgeIds =
    blastRadiusActive
      ? blastRadiusState.edgeIds
      : connectionState.edgeIds;

  /*
   * Apply focus styling.
   */
  const displayNodes =
    useMemo(() => {
      if (!selectedNodeId) {
        return nodes;
      }

      return nodes.map(
        (node) => {
          const active =
            activeNodeIds.has(
              node.id,
            );

          return {
            ...node,

            style: {
              ...node.style,

              opacity:
                active
                  ? 1
                  : 0.12,

              transition:
                "opacity 180ms ease",
            },
          };
        },
      );
    }, [
      nodes,
      selectedNodeId,
      activeNodeIds,
    ]);

  const displayEdges =
    useMemo(() => {
      if (!selectedNodeId) {
        return edges;
      }

      return edges.map(
        (edge) => {
          const active =
            activeEdgeIds.has(
              edge.id,
            );

          const blast =
            blastRadiusActive &&
            active;

          return {
            ...edge,

            animated: active,

            style: {
              ...edge.style,

              stroke: active
                ? blast
                  ? "#f59e0b"
                  : "#8b5cf6"
                : "#334155",

              strokeWidth:
                active
                  ? 2.5
                  : 1,

              opacity:
                active
                  ? 1
                  : 0.06,

              transition:
                "opacity 180ms ease",
            },

            labelStyle: {
              ...edge.labelStyle,

              fill: active
                ? blast
                  ? "#fcd34d"
                  : "#c4b5fd"
                : "#64748b",

              opacity:
                active
                  ? 1
                  : 0.06,

              fontSize: 9,
            },
          };
        },
      );
    }, [
      edges,
      selectedNodeId,
      activeEdgeIds,
      blastRadiusActive,
    ]);

  /*
   * Sync filtered topology with
   * controlled React Flow state.
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
      transformed.nodes
        .length === 0
    ) {
      return;
    }

    const frame =
      window
        .requestAnimationFrame(
          () => {
            void reactFlowInstance.fitView(
              {
                nodes:
                  transformed.nodes.map(
                    (node) => ({
                      id:
                        node.id,
                    }),
                  ),

                padding:
                  transformed.nodes
                    .length ===
                  1
                    ? 0.8
                    : 0.25,

                maxZoom:
                  transformed.nodes
                    .length ===
                  1
                    ? 1.15
                    : 0.9,

                duration: 350,
              },
            );
          },
        );

    return () => {
      window
        .cancelAnimationFrame(
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
   * Close selection if search/filter
   * hides the selected node.
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
      setSelectedNodeId(
        null,
      );

      setFocusMode(
        "connections",
      );
    }
  }, [
    selectedNodeId,
    filteredTopology.nodes,
  ]);

  /*
   * When blast-radius data arrives,
   * fit the entire impact chain.
   */
  useEffect(() => {
    if (
      focusMode !==
        "blast-radius" ||
      !blastRadius ||
      !reactFlowInstance ||
      blastRadiusState
        .nodeIds.size === 0
    ) {
      return;
    }

    const frame =
      window
        .requestAnimationFrame(
          () => {
            void reactFlowInstance.fitView(
              {
                nodes:
                  Array.from(
                    blastRadiusState
                      .nodeIds,
                  ).map(
                    (id) => ({
                      id,
                    }),
                  ),

                padding: 0.4,
                maxZoom: 0.95,
                duration: 450,
              },
            );
          },
        );

    return () => {
      window
        .cancelAnimationFrame(
          frame,
        );
    };
  }, [
    focusMode,
    blastRadius,
    blastRadiusState,
    reactFlowInstance,
  ]);

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

        setFocusMode(
          "connections",
        );

        if (
          !reactFlowInstance
        ) {
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

        window
          .requestAnimationFrame(
            () => {
              void reactFlowInstance.fitView(
                {
                  nodes:
                    Array.from(
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
      setSelectedNodeId(
        null,
      );

      setFocusMode(
        "connections",
      );
    }, []);

  const handleCloseInspector =
    useCallback(() => {
      setSelectedNodeId(
        null,
      );

      setFocusMode(
        "connections",
      );
    }, []);

  const handleReset =
    useCallback(() => {
      setSearch("");

      setActiveFilter(
        "All",
      );

      setSelectedNodeId(
        null,
      );

      setFocusMode(
        "connections",
      );
    }, []);

  const handleFocusModeChange =
    useCallback(
      (
        mode: GraphFocusMode,
      ) => {
        setFocusMode(mode);

        if (
          mode ===
          "blast-radius"
        ) {
          /*
           * Blast radius needs the
           * complete graph available,
           * so clear visual filters.
           */
          setSearch("");

          setActiveFilter(
            "All",
          );
        }
      },
      [],
    );

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
            focusMode={
              focusMode
            }
            blastRadiusSummary={
              blastRadius
                ?.summary
            }
            isBlastRadiusLoading={
              isBlastRadiusLoading
            }
            isBlastRadiusError={
              isBlastRadiusError
            }
            onFocusModeChange={
              handleFocusModeChange
            }
            onClose={
              handleCloseInspector
            }
          />

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 hidden -translate-x-1/2 rounded-full border border-white/10 bg-[#0d111b]/90 px-4 py-2 text-xs text-slate-400 shadow-xl backdrop-blur sm:block">
            {focusMode ===
              "blast-radius" &&
            isBlastRadiusLoading ? (
              <span className="text-amber-300">
                Calculating blast
                radius...
              </span>
            ) : blastRadiusActive &&
              blastRadius ? (
              <>
                <span className="font-medium text-amber-300">
                  Blast Radius:
                </span>{" "}
                {selectedNode.name}

                <span className="mx-2 text-slate-700">
                  •
                </span>

                {
                  blastRadius
                    .summary
                    .affectedComponents
                }{" "}
                affected

                <span className="mx-2 text-slate-700">
                  •
                </span>

                depth{" "}
                {
                  blastRadius
                    .summary
                    .maximumDepth
                }
              </>
            ) : (
              <>
                <span className="font-medium text-violet-300">
                  Focused:
                </span>{" "}
                {selectedNode.name}

                <span className="mx-2 text-slate-700">
                  •
                </span>

                {
                  connectionState
                    .edgeIds.size
                }{" "}
                direct relationships
              </>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}