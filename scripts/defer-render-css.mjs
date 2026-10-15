/**
 * Convert Astro-emitted render-blocking <link rel="stylesheet"> tags into
 * preload + onload stylesheets so FCP/LCP aren't gated on the full CSS bundle.
 * Skips links that already use media="print" or live inside <noscript>.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const STATIC_DIR = ".vercel/output/static";

async function* htmlFiles(dir) {
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

const LINK_RE = /<link\b[^>]*>/gi;

function shouldDefer(tag) {
  if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) return false;
  if (/\bmedia\s*=\s*["']print["']/i.test(tag)) return false;
  if (/\bonload\s*=/i.test(tag)) return false;
  return true;
}

function toPreload(tag) {
  const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!href) return tag;
  return (
    `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">` +
    `<noscript><link rel="stylesheet" href="${href}"></noscript>`

  );
}

let files = 0;
let links = 0;

for await (const file of htmlFiles(STATIC_DIR)) {
  const original = await readFile(file, "utf8");
  // Mask noscript blocks so we don't touch fallback links
  const noscripts = [];
  const masked = original.replace(/<noscript\b[\s\S]*?<\/noscript>/gi, (block) => {
    noscripts.push(block);
    return `<!--NOSCRIPT_${noscripts.length - 1}-->`;
  });

  let changed = 0;
  const next = masked.replace(LINK_RE, (tag) => {
    if (!shouldDefer(tag)) return tag;
    changed++;
    return toPreload(tag);
  });

  if (!changed) continue;

  const restored = next.replace(/<!--NOSCRIPT_(\d+)-->/g, (_, i) => noscripts[Number(i)]);
  await writeFile(file, restored);
  files++;
  links += changed;
}

console.log(`[defer-render-css] deferred ${links} stylesheet(s) across ${files} html file(s)`);
