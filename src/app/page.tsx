import React from "react";
import DAGRenderer from "~/components/DAGRenderer";
import type { ActionBlueprintGraphDescription } from "~/types/ActionBlueprintGraphDescription";

async function fetchGraphData() {
  const response = await fetch(
    "http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/1/graph",
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch graph data: ${response.statusText}`);
  }

  return response.json() as Promise<ActionBlueprintGraphDescription>;
}

export default async function HomePage() {
  const graphData = await fetchGraphData().catch((error) => {
    console.error("Error fetching graph data:", error);
    return null;
  });

  if (!graphData) {
    return (
      <div>
        <h1>Error loading graph data</h1>
        <p>Failed to load graph data</p>
      </div>
    );
  }

  return <DAGRenderer graphData={graphData} />;
}
