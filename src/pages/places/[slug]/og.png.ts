import type { APIRoute } from "astro";
import { getCheckins, getPlaceBySlug } from "@lib/places/db";
import { renderPlaceOg } from "@lib/places/og";

export const prerender = false;

export const GET: APIRoute = async ({ params, url }) => {
  const place = await getPlaceBySlug(params.slug ?? "");
  if (!place) return new Response("Not found", { status: 404 });

  const checkins = await getCheckins(place.id);
  if (checkins.length === 0) return new Response("Not found", { status: 404 });
  const avg = checkins.length ? checkins.reduce((n, c) => n + c.rating, 0) / checkins.length : null;

  try {
    const png = await renderPlaceOg(
      { name: place.name, avg, visits: checkins.length, review: checkins[0]?.review || null, lat: place.lat, lng: place.lng },
      url.origin,
    );
    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        // The page links this with ?v=<visits>-<last visit>, so a new check-in busts the cache.
        "Cache-Control": "public, max-age=3600, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[places og]", error);
    return Response.redirect(new URL("/og-image.png", url), 302);
  }
};
