"use client";
import React, { useCallback } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
} from "@xyflow/react";
import type { Node, Edge, Connection } from "@xyflow/react";
import type { ActionBlueprintGraphDescription } from "~/types/ActionBlueprintGraphDescription";
import "@xyflow/react/dist/style.css";

const DAGRenderer: React.FC<{ graphData: ActionBlueprintGraphDescription }> = ({
  graphData,
}) => {
  const initialNodes: Node[] =
    graphData.nodes?.map((node) => ({
      id: node.id,
      position: node.position,
      data: { label: node.data.name },
      // type: node.type,
    })) ?? [];

  const initialEdges: Edge[] =
    graphData.edges?.map((edge) => ({
      id: `e-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      animated: true,
    })) ?? [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onClick={() => {
          console.log(initialNodes);
          console.log(initialEdges);
          console.log(graphData);
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default DAGRenderer;
