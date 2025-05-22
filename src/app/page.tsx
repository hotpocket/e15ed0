import React from "react";
import DAGRenderer from "~/components/DAGRenderer";
import type { ActionBlueprintGraphDescription } from "~/types/graphTypes";

export default async function HomePage() {
  // Add logging to debug the request
  console.log("Attempting to fetch graph data...");

  // For local development, we can use a relative URL
  // Next.js server components can make relative requests to the same origin
  const url =
    "http://localhost:3000/api/v1/1/actions/blueprints/bp_01jk766tckfwx84xjcxazggzyc/1/graph";
  console.log("Fetch URL:", url);

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch graph data: ${response.statusText}`);
    }

    const graphData =
      (await response.json()) as ActionBlueprintGraphDescription;
    console.log("Graph data received successfully");

    return (
      <div>
        <DAGRenderer graphData={graphData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching graph data:", error);
    return (
      <div>
        <h1>Error loading graph data</h1>
        <p>{error instanceof Error ? error.message : String(error)}</p>
      </div>
    );
  }
}
