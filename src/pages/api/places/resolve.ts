import type { APIRoute } from "astro";
import { isOwner } from "@lib/places/auth";
import { resolveMapsLink } from "@lib/places/maps";
import { findExistingPlace } from "@lib/places/db";

export const prerender = false;

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

// Preview step: turn a pasted Maps link into a name + coords, and say whether it's a revisit.
export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isOwner(cookies)) return json({ error: "Unauthorized" }, 401);

  let link = "";
  try {
    link = `${(await request.json()).link || ""}`.trim();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }
  if (!link) return json({ error: "Paste a Google Maps link" }, 400);

  try {
    const resolved = await resolveMapsLink(link);
    const existing = await findExistingPlace({
      placeRef: resolved.placeRef,
      lat: resolved.lat,
      lng: resolved.lng,
      mapsUrl: resolved.resolvedUrl,
    });
    return json({ resolved, existing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read that link";
    return json({ error: message }, 422);
  }
};
