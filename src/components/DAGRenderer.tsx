"use client";
import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { Dialog } from "primereact/dialog";
import PrefilForm from "~/components/PrefilForm";
import type { Node, Edge, Connection } from "@xyflow/react";
import type { FormData, FormItem } from "~/types/FormTypes";
import type {
  ActionBlueprintGraphDescription,
  ActionBlueprintGraphNodeDescription,
  ActionFormDescription,
} from "~/types/ActionBlueprintGraphDescription";

const DAGRenderer: React.FC<{ graphData: ActionBlueprintGraphDescription }> = ({
  graphData,
}) => {
  const [isDiagVisible, setDiagVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({} as FormData);
  const [formFields, setFormFields] = useState([]);
  const [initialItems, setInitialItems] = useState<FormItem[]>(
    [] as FormItem[],
  );

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

  // id->node lookup table
  const nodesById = useMemo(() => {
    const map: Record<string, ActionBlueprintGraphNodeDescription> = {};
    graphData.nodes?.forEach((node) => {
      map[node.id] = node;
    });
    return map;
  }, [graphData.nodes]);

  // id->form lookup table
  const formsById = useMemo(() => {
    const map: Record<string, ActionFormDescription> = {};
    graphData.forms?.forEach((form) => {
      map[form.id] = form;
    });
    return map;
  }, [graphData.forms]);

  // walk the graph to find dependencies of a form node
  function getFormDeps(nodeId: string): string[] {
    const preReqIds = nodesById[nodeId]?.data.prerequisites ?? [];
    const formDeps = new Set<string>();
    for (const preReqId of preReqIds) {
      if (typeof preReqId === "string") {
        const depForms = getFormDeps(preReqId);
        depForms.forEach((depFormId) => formDeps.add(depFormId));
        formDeps.add(preReqId);
      }
    }
    return [...new Set(formDeps)];
  }

  // fetch and seperate direct & transient dependencies when a user clicks a node
  function genPrefillData(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const nodeId = (e.target as HTMLElement).getAttribute("data-id");
    if (!nodeId) return;
    // it was node click
    const node = nodesById[nodeId];
    if (!node) return;
    // we found the node's data
    const formId = node.data.component_id;
    const formFields = Object.keys(formsById[formId]!.field_schema.properties);
    const formDeps = getFormDeps(nodeId);
    const directDeps = node.data.prerequisites ?? [];
    const transDeps = formDeps.filter((id) => !directDeps.includes(id));

    const iterateDeps = (deps: string[]): Record<string, string[]> => {
      const depsMap: Record<string, string[]> = {};
      deps.forEach((depFormId) => {
        const node = nodesById[depFormId];
        if (!node) return;
        const nodeFormId = node.data.component_id;
        const formProps = formsById[nodeFormId]?.field_schema.properties;
        if (!formProps) return;
        const props = Object.keys(formProps);
        depsMap[node.data.name] = props;
      });
      return depsMap;
    };

    // maybe expose this via onNodeClick so parent can handle the UI...
    const prefillData = {
      name: node.data.name,
      fields: formFields,
      direct_dependencies: iterateDeps(directDeps),
      transient_dependencies: iterateDeps(transDeps),
    };

    setFormData(prefillData);
    setInitialItems(
      formFields.map((el) => {
        return { name: el, type: "unmapped", selected: false };
      }),
    );

    setDiagVisible(true);

    // logged to console for now. will use this to populate a UI in the next step
    console.log({ [prefillData.name]: prefillData.fields });
    console.log("Direct dependencies:");
    console.log(prefillData.direct_dependencies);
    console.log("Transitive dependencies:");
    console.log(prefillData.transient_dependencies);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        onClick={genPrefillData}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <Dialog
        header={`Prefill Mappings for ${formData.name}`}
        visible={isDiagVisible}
        style={{ width: "60vw" }}
        onHide={() => isDiagVisible && setDiagVisible(false)}
      >
        <PrefilForm formData={formData} initialItems={initialItems} />
      </Dialog>
    </div>
  );
};

export default DAGRenderer;
