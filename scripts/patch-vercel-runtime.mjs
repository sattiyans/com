// @astrojs/vercel (Astro 4) only knows Node 18/20 and falls back to "nodejs18.x",
// which Vercel has retired. Point every generated function at the Node version we build with.
// Remove once the project is on Astro 5 + a current adapter.
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const FUNCTIONS_DIR = ".vercel/output/functions";
const runtime = `nodejs${process.versions.node.split(".")[0]}.x`;

async function* configs(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* configs(path);
    else if (entry.name === ".vc-config.json") yield path;
  }
}

let patched = 0;
for await (const file of configs(FUNCTIONS_DIR)) {
  const config = JSON.parse(await readFile(file, "utf8"));
  if (config.runtime?.startsWith("nodejs") && config.runtime !== runtime) {
    config.runtime = runtime;
    await writeFile(file, JSON.stringify(config, null, 2));
    patched++;
  }
}

console.log(`[patch-vercel-runtime] set ${patched} function(s) to ${runtime}`);
