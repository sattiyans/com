import type { APIRoute } from "astro";
import { isOwner } from "@lib/places/auth";
import { resolveMapsLink } from "@lib/places/maps";
import { addCheckin, createPlace, deleteCheckin, findExistingPlace } from "@lib/places/db";

export const prerender = false;

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(payload: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isOwner(cookies)) return json({ error: "Unauthorized" }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON payload" }, 400);
  }

  const link = `${body.link || ""}`.trim();
  const nameOverride = `${body.name || ""}`.trim().slice(0, 120);
  const review = `${body.review || ""}`.trim().slice(0, 5000);
  const rating = Number(body.rating);
  const visitedAt = body.visitedAt ? new Date(`${body.visitedAt}`) : new Date();

  if (!link) return json({ error: "Paste a Google Maps link" }, 400);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: "Rating must be 1–5" }, 400);
  }
  if (Number.isNaN(visitedAt.getTime()) || visitedAt.getTime() > Date.now() + 60_000) {
    return json({ error: "Invalid visit date" }, 400);
  }

  try {
    // Re-resolve server-side rather than trusting coordinates from the client.
    const resolved = await resolveMapsLink(link);
    const match = {
      placeRef: resolved.placeRef,
      lat: resolved.lat,
      lng: resolved.lng,
      mapsUrl: resolved.resolvedUrl,
    };

    let place = await findExistingPlace(match);
    if (!place) {
      const name = nameOverride || resolved.name;
      if (!name) return json({ error: "Couldn't read a name from the link — type one in" }, 400);
      place = await createPlace({ ...match, name });
    }

    const checkin = await addCheckin({ placeId: place.id, rating, review, visitedAt });
    return json({ place, checkin }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Check-in failed";
    return json({ error: message }, 422);
  }
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
  if (!isOwner(cookies)) return json({ error: "Unauthorized" }, 401);

  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id) || id < 1) return json({ error: "Invalid id" }, 400);

  await deleteCheckin(id);
  return json({ ok: true });
};
