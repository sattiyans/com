// Resolves a Google Maps share link to a name + coordinates without the Places API.
// Short links (maps.app.goo.gl) redirect to a full /maps/place/<Name>/@lat,lng URL,
// which carries everything we need in the path and data params.

export type ResolvedPlace = {
  name: string | null;
  lat: number | null;
  lng: number | null;
  // Google's feature id (e.g. 0x31cc49..:0x8c8c..). Stable per place, used for dedupe.
  placeRef: string | null;
  resolvedUrl: string;
};

const ALLOWED_HOSTS = new Set([
  "maps.app.goo.gl",
  "goo.gl",
  "g.co",
  "google.com",
  "www.google.com",
  "maps.google.com",
  "consent.google.com",
]);

const MAX_REDIRECTS = 6;

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (ALLOWED_HOSTS.has(host)) return true;
  // Country domains: www.google.com.my, maps.google.co.uk, ...
  return /^(www\.|maps\.)?google\.(com?\.)?[a-z]{2,3}$/.test(host);
}

function isGoogleMapsUrl(url: URL): boolean {
  if (!isAllowedHost(url.hostname)) return false;
  const host = url.hostname.toLowerCase();
  if (host === "maps.app.goo.gl" || host === "goo.gl" || host === "g.co") return true;
  return host.startsWith("maps.") || url.pathname.startsWith("/maps");
}

export function parseMapsInput(raw: string): URL | null {
  // Shared text from the Maps app often looks like "Place Name\nhttps://maps.app.goo.gl/xyz".
  const match = raw.match(/https?:\/\/\S+/);
  if (!match) return null;
  try {
    const url = new URL(match[0]);
    return isGoogleMapsUrl(url) ? url : null;
  } catch {
    return null;
  }
}

async function followRedirects(start: URL): Promise<URL> {
  let current = start;
  for (let hop = 0; hop < MAX_REDIRECTS; hop++) {
    // EU consent interstitial wraps the real target in ?continue=.
    if (current.hostname === "consent.google.com") {
      const next = current.searchParams.get("continue");
      if (!next) break;
      current = new URL(next);
      continue;
    }
    if (current.pathname.includes("/place/") || current.searchParams.has("q")) {
      if (!["maps.app.goo.gl", "goo.gl", "g.co"].includes(current.hostname)) return current;
    }

    const res = await fetch(current, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; sattiyans-places/1.0)" },
      signal: AbortSignal.timeout(6000),
    });
    const location = res.headers.get("location");
    if (res.status < 300 || res.status >= 400 || !location) return current;

    const next = new URL(location, current);
    if (!isAllowedHost(next.hostname)) {
      throw new Error("Link redirected outside Google Maps");
    }
    current = next;
  }
  return current;
}

function toNumber(value: string | undefined | null): number | null {
  if (!value) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function validCoords(lat: number | null, lng: number | null): [number, number] | null {
  if (lat === null || lng === null) return null;
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
  return [lat, lng];
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment.replace(/\+/g, " ")).trim();
  } catch {
    return segment.replace(/\+/g, " ").trim();
  }
}

const COORD_PAIR = /^\s*(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/;

export function extractFromUrl(url: URL): Omit<ResolvedPlace, "resolvedUrl"> {
  const full = decodeSegment(url.pathname) + " " + url.search;
  let name: string | null = null;
  let coords: [number, number] | null = null;

  const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
  if (placeMatch) {
    const candidate = decodeSegment(placeMatch[1]);
    // Dropped pins are named by their coordinates (3°08'20.0"N 101°41'12.0"E) — not a real name.
    if (!COORD_PAIR.test(candidate) && !candidate.includes("°")) name = candidate;
  }

  // !3d/!4d is the place pin itself; @lat,lng is just the map viewport centre.
  const pin = full.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (pin) coords = validCoords(toNumber(pin[1]), toNumber(pin[2]));

  if (!coords) {
    const viewport = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (viewport) coords = validCoords(toNumber(viewport[1]), toNumber(viewport[2]));
  }

  const q = url.searchParams.get("q") ?? url.searchParams.get("query");
  if (q) {
    const pair = q.match(COORD_PAIR);
    if (pair) {
      coords ??= validCoords(toNumber(pair[1]), toNumber(pair[2]));
    } else if (!name) {
      // Search-style links: "Restoran ABC, Jalan X, Kuala Lumpur" → keep the leading name.
      name = q.split(",")[0].trim() || null;
    }
  }

  if (!coords) {
    const ll = url.searchParams.get("ll")?.match(COORD_PAIR);
    if (ll) coords = validCoords(toNumber(ll[1]), toNumber(ll[2]));
  }

  const featureId =
    full.match(/!1s(0x[0-9a-f]+:0x[0-9a-f]+)/i)?.[1] ??
    url.searchParams.get("ftid") ??
    null;
  const cid = url.searchParams.get("cid");
  const placeRef = featureId ? featureId.toLowerCase() : cid ? `cid:${cid}` : null;

  return {
    name,
    lat: coords?.[0] ?? null,
    lng: coords?.[1] ?? null,
    placeRef,
  };
}

// Drop share/session tracking (skid, g_ep, entry, authuser) and pin to google.com.
function canonicalize(url: URL): string {
  const clean = new URL(url.pathname, "https://www.google.com");
  for (const key of ["q", "query", "ll", "cid", "ftid"]) {
    const value = url.searchParams.get(key);
    if (value) clean.searchParams.set(key, value);
  }
  return clean.toString();
}

// The Maps share sheet puts the place name on the line(s) before the link.
function nameFromShareText(raw: string): string | null {
  const before = raw.slice(0, raw.search(/https?:\/\//)).trim();
  const firstLine = before.split(/\r?\n/)[0]?.trim();
  return firstLine ? firstLine.slice(0, 120) : null;
}

export async function resolveMapsLink(raw: string): Promise<ResolvedPlace> {
  const start = parseMapsInput(raw);
  if (!start) throw new Error("That doesn't look like a Google Maps link");

  const resolved = await followRedirects(start);
  const extracted = extractFromUrl(resolved);
  return {
    ...extracted,
    name: extracted.name ?? nameFromShareText(raw),
    resolvedUrl: canonicalize(resolved),
  };
}
