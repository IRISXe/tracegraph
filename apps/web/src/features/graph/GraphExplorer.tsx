import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type NodeMouseHandler,
} from "@xyflow/react";

import type {
  InfrastructureFlowEdge,
  InfrastructureFlowNode,
} from "./graph-flow.types";

import { GraphNodeInspector } from "./GraphNodeInspector";
import { InfrastructureNode } from "./InfrastructureNode";
import { transformGraphToFlow } from "./graph-layout";

import type {
  GraphTopology,
} from "./graph.types";

interface GraphExplorerProps {
  topology: GraphTopology;
}

const nodeTypes = {
  infrastructure: InfrastructureNode,
};

export function GraphExplorer({
  topology,
}: GraphExplorerProps) {
  const transformed = useMemo(
    () => transformGraphToFlow(topology),
    [topology],
  );

  const [
    nodes,
    setNodes,
    onNodesChange,
  ] = useNodesState<InfrastructureFlowNode>(
    [],
  );

  const [
    edges,
    setEdges,
    onEdgesChange,
  ] = useEdgesState<InfrastructureFlowEdge>(
    [],
  );

  const [
    selectedNodeId,
    setSelectedNodeId,
  ] = useState<string | null>(null);

  const selectedNode = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }

    return (
      topology.nodes.find(
        (node) =>
          node.id === selectedNodeId,
      ) ?? null
    );
  }, [
    selectedNodeId,
    topology.nodes,
  ]);

  useEffect(() => {
    setNodes(transformed.nodes);
    setEdges(transformed.edges);
  }, [
    transformed,
    setNodes,
    setEdges,
  ]);

  const handleNodeClick: NodeMouseHandler<
    InfrastructureFlowNode
  > = (
    _event,
    node,
  ) => {
    setSelectedNodeId(node.id);
  };

  function handlePaneClick() {
    setSelectedNodeId(null);
  }

  return (
    <div className="relative h-[calc(100vh-190px)] min-h-[620px] overflow-hidden rounded-2xl border border-white/10 bg-[#080b12]">
      <ReactFlow<
        InfrastructureFlowNode,
        InfrastructureFlowEdge
      >
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
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
          variant={BackgroundVariant.Dots}
          gap={22}
          size={1}
        />

        <Controls />

        <MiniMap
          pannable
          zoomable
        />
      </ReactFlow>

      {selectedNode ? (
        <GraphNodeInspector
          node={selectedNode}
          onClose={() => {
            setSelectedNodeId(null);
          }}
        />
      ) : null}
    </div>
  );
}