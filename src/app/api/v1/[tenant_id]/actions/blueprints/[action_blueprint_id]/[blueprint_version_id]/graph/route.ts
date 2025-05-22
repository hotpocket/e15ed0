import { type NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'

const projRoot = process.cwd()
const graphJsonFile = 'graph.json';
const graphJsonFullPath = path.join(projRoot, 'public', graphJsonFile);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{
    tenant_id: string,
    action_blueprint_id: string,
    blueprint_version_id: string
  }> }
) {
  // logged in the server log to show we could use them if we wanted to...
  console.log('GET params: ', {...(await params)});

  try {
    if (!fs.existsSync(graphJsonFullPath)) {
      console.log(`File not found: ${graphJsonFullPath}`);
      return Response.json({ error: `${graphJsonFile} not found!` }, { status: 404 });
    }

    const fileContents = fs.readFileSync(graphJsonFullPath, 'utf8');

    return new Response(fileContents, {headers:{'Content-Type': 'application/json'}});
  } catch (error) {
    console.error(`Error loading ${graphJsonFile}:`, error);
    return Response.json({ error: `Failed to load ${graphJsonFile}` }, { status: 500 });
  }
}
