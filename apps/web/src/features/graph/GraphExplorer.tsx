import {
  useEffect,
  useMemo,
} from "react";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";

import type {
  InfrastructureFlowEdge,
  InfrastructureFlowNode,
} from "./graph-flow.types";

import { InfrastructureNode } from "./InfrastructureNode";
import { transformGraphToFlow } from "./graph-layout";

import type {
  GraphTopology,
} from "./graph.types";

interface GraphExplorerProps {
  topology: GraphTopology;
}

const nodeTypes = {
  infrastructure:
    InfrastructureNode,
};

export function GraphExplorer({
  topology,
}: GraphExplorerProps) {
  const transformed =
    useMemo(
      () =>
        transformGraphToFlow(
          topology,
        ),
      [topology],
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

  useEffect(() => {
    setNodes(transformed.nodes);
    setEdges(transformed.edges);
  }, [
    transformed,
    setNodes,
    setEdges,
  ]);

  return (
    <div className="h-[calc(100vh-190px)] min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-[#080b12]">
      <ReactFlow<
        InfrastructureFlowNode,
        InfrastructureFlowEdge
      >
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={
          onNodesChange
        }
        onEdgesChange={
          onEdgesChange
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
    </div>
  );
}