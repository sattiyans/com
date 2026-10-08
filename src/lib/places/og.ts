import { Resvg, initWasm } from "@resvg/resvg-wasm";
import wasmUrl from "@resvg/resvg-wasm/index_bg.wasm?url";
import yogaUrl from "satori/yoga.wasm?url";
import interSemiboldUrl from "@fontsource/inter/files/inter-latin-600-normal.woff?url";
import interRegularUrl from "@fontsource/inter/files/inter-latin-400-normal.woff?url";

// satori's ESM build reads a bare `__dirname` (undefined in ESM). Give it a harmless global
// before a dynamic import; a static import or createRequire isn't traced into the Vercel bundle.
type Satori = typeof import("satori/standalone");
let satoriModule: Promise<Satori> | null = null;
function loadSatori() {
  (globalThis as { __dirname?: string }).__dirname ??= "/";
  satoriModule ??= import("satori/standalone");
  return satoriModule;
}

// resvg throws if initialised twice (e.g. after a dev reload); treat that as success.
async function initResvg(wasm: ArrayBuffer) {
  try {
    await initWasm(wasm);
  } catch (error) {
    if (!(error instanceof Error && error.message.includes("Already initialized"))) throw error;
  }
}

// Assets are fetched from our own origin (Vite emits them as static files), so nothing
// depends on the serverless bundler tracing files inside node_modules.
let ready: Promise<{ regular: ArrayBuffer; semibold: ArrayBuffer }> | null = null;

function load(origin: string) {
  ready ??= (async () => {
    const get = async (path: string) => {
      const res = await fetch(new URL(path, origin));
      if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
      return res.arrayBuffer();
    };
    const [wasm, yoga, regular, semibold] = await Promise.all([
      get(wasmUrl),
      get(yogaUrl),
      get(interRegularUrl),
      get(interSemiboldUrl),
    ]);
    const { init: initSatori } = await loadSatori();
    await Promise.all([initResvg(wasm), initSatori(yoga)]);
    return { regular, semibold };
  })().catch((error) => {
    ready = null; // allow a retry on the next request
    throw error;
  });
  return ready;
}

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, props: Record<string, unknown>, ...children: unknown[]): Node => ({
  type,
  props: children.length === 0 ? props : { ...props, children: children.length === 1 ? children[0] : children },
});

// Site mark (public/mark.svg), inlined so the OG card needs no extra fetch.
const MARK_PATHS = [{"fill": "#fafafa", "stroke": "#121212", "strokeWidth": "1.25", "d": "M32 4c6 0 11 2.4 14.8 6.2L57.8 17.2C61.6 21 64 26 64 32s-2.4 11-6.2 14.8L46.8 53.8C43 57.6 38 60 32 60s-11-2.4-14.8-6.2L11.2 46.8C7.4 43 5 38 5 32s2.4-11 6.2-14.8L18.2 10.2C22 6.4 27 4 32 4z"}, {"fill": "#121212", "d": "M40.2 22.6c-1.8-2.4-4.9-3.9-8.6-3.9-6.1 0-10.1 3.4-10.1 8.2 0 4.1 2.5 6.4 8.3 8.1l3.3 1c4.4 1.3 6.2 2.8 6.2 5.4 0 3.2-2.9 5.3-7.3 5.3-3.8 0-6.7-1.5-8.5-4.1l-3.5 2.6c2.7 3.6 7.1 5.7 12.3 5.7 7.7 0 12.8-4.3 12.8-10.5 0-5-2.9-7.9-9.3-9.8l-3.2-1c-4.1-1.2-5.8-2.4-5.8-4.9 0-2.8 2.5-4.6 6.4-4.6 3 0 5.3 1.1 6.7 2.9l3.3-2.4z"}];
const mark = (size: number) =>
  h("svg", { width: size, height: size, viewBox: "0 0 64 64" }, ...MARK_PATHS.map((attrs) => h("path", attrs)));

const STAR = "M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z";
const PIN = "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z";

function stars(rating: number) {
  const rounded = Math.round(rating);
  return h(
    "div",
    { style: { display: "flex", gap: 6 } },
    ...[1, 2, 3, 4, 5].map((n) =>
      h(
        "svg",
        { width: 36, height: 36, viewBox: "0 0 20 20" },
        h("path", { d: STAR, fill: n <= rounded ? "#fbbf24" : "rgba(255,255,255,0.15)" }),
      ),
    ),
  );
}

// --- Map panel: stitch OpenStreetMap tiles around the pin, then grey + invert to match the site's dark maps.
const TILE = 256;
const MAP_W = 460;
const MAP_H = 630;

async function mapPanel(lat: number, lng: number, zoom = 16): Promise<string | null> {
  try {
    // Pure-JS PNG decode/encode: sharp's native binary isn't packaged into the Vercel function.
    const { PNG } = await import("pngjs");
    const n = 2 ** zoom;
    const latRad = (lat * Math.PI) / 180;
    const px = ((lng + 180) / 360) * n * TILE;
    const py = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n * TILE;

    const left = Math.round(px - MAP_W / 2);
    const top = Math.round(py - MAP_H / 2);
    const x0 = Math.floor(left / TILE);
    const y0 = Math.floor(top / TILE);
    const x1 = Math.floor((left + MAP_W - 1) / TILE);
    const y1 = Math.floor((top + MAP_H - 1) / TILE);

    const jobs: Promise<{ x: number; y: number; png: InstanceType<typeof PNG> }>[] = [];
    for (let x = x0; x <= x1; x++) {
      for (let y = y0; y <= y1; y++) {
        jobs.push(
          fetch(`https://tile.openstreetmap.org/${zoom}/${((x % n) + n) % n}/${y}.png`, {
            headers: { "User-Agent": "sattiyans.com places og-image (+https://sattiyans.com/places)" },
            signal: AbortSignal.timeout(5000),
          }).then(async (res) => {
            if (!res.ok) throw new Error(`tile ${res.status}`);
            return { x, y, png: PNG.sync.read(Buffer.from(await res.arrayBuffer())) };
          }),
        );
      }
    }
    const tiles = await Promise.all(jobs);

    // Copy each tile's overlap with the crop window, greyscale + invert + dim as we go
    // (same look as the on-site dark map).
    const out = new PNG({ width: MAP_W, height: MAP_H });
    for (const { x, y, png } of tiles) {
      const tileLeft = x * TILE - left;
      const tileTop = y * TILE - top;
      for (let ty = 0; ty < png.height; ty++) {
        const oy = tileTop + ty;
        if (oy < 0 || oy >= MAP_H) continue;
        for (let tx = 0; tx < png.width; tx++) {
          const ox = tileLeft + tx;
          if (ox < 0 || ox >= MAP_W) continue;
          const si = (ty * png.width + tx) * 4;
          const gray = 0.299 * png.data[si] + 0.587 * png.data[si + 1] + 0.114 * png.data[si + 2];
          const value = Math.round((255 - gray) * 0.75 + 4);
          const oi = (oy * MAP_W + ox) * 4;
          out.data[oi] = out.data[oi + 1] = out.data[oi + 2] = value;
          out.data[oi + 3] = 255;
        }
      }
    }

    return `data:image/png;base64,${PNG.sync.write(out).toString("base64")}`;
  } catch (error) {
    console.error("[places og] map panel skipped:", error);
    return null;
  }
}

export type PlaceOg = {
  name: string;
  avg: number | null;
  visits: number;
  review: string | null;
  lat: number | null;
  lng: number | null;
};

export async function renderPlaceOg(place: PlaceOg, origin: string): Promise<Uint8Array> {
  const [fonts, map] = await Promise.all([
    load(origin),
    place.lat !== null && place.lng !== null ? mapPanel(place.lat, place.lng) : Promise.resolve(null),
  ]);

  const textWidth = map ? 1200 - MAP_W - 72 * 2 : 1200 - 72 * 2;
  const reviewMax = map ? 110 : 150;
  const flat = place.review?.replace(/\s+/g, " ").trim() || null;
  // Cut on a word boundary so the excerpt doesn't end mid-word.
  const review =
    flat && flat.length > reviewMax ? `${flat.slice(0, reviewMax).replace(/\s+\S*$/, "").replace(/[,.;:!?-]+$/, "")}…` : flat;
  const meta = [place.avg !== null ? `${place.avg.toFixed(1)} avg` : null, `${place.visits} ${place.visits === 1 ? "visit" : "visits"}`]
    .filter(Boolean)
    .join("  ·  ");
  const nameSize = map ? (place.name.length > 24 ? 52 : place.name.length > 14 ? 64 : 76) : place.name.length > 32 ? 64 : 80;

  const content = h(
    "div",
    {
      style: {
        width: map ? 1200 - MAP_W : 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: "rgba(255,255,255,0.55)" } },
      h("svg", { width: 30, height: 30, viewBox: "0 0 24 24" }, h("path", { d: PIN, fill: "#fbbf24", fillRule: "evenodd" })),
      "Places",
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 26 } },
      h(
        "div",
        {
          style: {
            display: "flex",
            fontSize: nameSize,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            maxWidth: textWidth,
          },
        },
        place.name,
      ),
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 18 } },
        ...(place.avg !== null ? [stars(place.avg)] : []),
        h("div", { style: { display: "flex", fontSize: 28, color: "rgba(255,255,255,0.7)" } }, meta),
      ),
      ...(review
        ? [
            h(
              "div",
              { style: { display: "flex", fontSize: 28, lineHeight: 1.4, color: "rgba(255,255,255,0.6)", maxWidth: textWidth } },
              `“${review}”`,
            ),
          ]
        : []),
    ),
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 22,
          color: "rgba(255,255,255,0.45)",
          borderTop: "1px solid rgba(255,255,255,0.12)",
          paddingTop: 26,
        },
      },
      h(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 12, color: "#fff", fontWeight: 600 } },
        mark(36),
        "Sattiyan Selvarajah",
      ),
      h("div", { style: { display: "flex" } }, "sattiyans.com/places"),
    ),
  );

  const mapNode = map
    ? h(
        "div",
        { style: { position: "relative", display: "flex", width: MAP_W, height: 630 } },
        h("img", { src: map, width: MAP_W, height: 630, style: { position: "absolute", top: 0, left: 0 } }),
        // Fade the map into the card on its left edge.
        h("div", {
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 160,
            height: 630,
            backgroundImage: "linear-gradient(to right, #0a0a0a, rgba(10,10,10,0))",
          },
        }),
        // Pin: amber dot with a soft halo, dead centre (the tiles are centred on the coordinates).
        h("div", {
          style: {
            position: "absolute",
            left: MAP_W / 2 - 28,
            top: 630 / 2 - 28,
            width: 56,
            height: 56,
            borderRadius: 28,
            background: "rgba(251,191,36,0.25)",
          },
        }),
        h("div", {
          style: {
            position: "absolute",
            left: MAP_W / 2 - 12,
            top: 630 / 2 - 12,
            width: 24,
            height: 24,
            borderRadius: 12,
            background: "#fbbf24",
            border: "4px solid #0a0a0a",
          },
        }),
      )
    : null;

  const tree = h(
    "div",
    {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        background: "#0a0a0a",
        ...(map ? {} : { backgroundImage: "radial-gradient(circle at 85% 15%, rgba(251,191,36,0.14), transparent 45%)" }),
        color: "#fff",
        fontFamily: "Inter",
      },
    },
    ...(mapNode ? [content, mapNode] : [content]),
  );

  const { default: satori } = await loadSatori();
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fonts.regular, weight: 400, style: "normal" },
      { name: "Inter", data: fonts.semibold, weight: 600, style: "normal" },
    ],
  });

  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}
