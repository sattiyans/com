import { neon } from "@neondatabase/serverless";
import { env } from "./env";

export type Place = {
  id: number;
  slug: string;
  name: string;
  maps_url: string;
  place_ref: string | null;
  lat: number | null;
  lng: number | null;
  created_at: Date;
};

export type PlaceSummary = Place & {
  visit_count: number;
  avg_rating: number | null;
  last_visit: Date | null;
  last_review: string | null;
};

export type Checkin = {
  id: number;
  place_id: number;
  visited_at: Date;
  rating: number;
  review: string;
};

let client: ReturnType<typeof neon> | null = null;

function sql() {
  if (!client) {
    const url = env("DATABASE_URL");
    if (!url) throw new Error("DATABASE_URL is not set");
    client = neon(url);
  }
  return client;
}

async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  return (await sql().query(text, params)) as T[];
}

export async function listPlaces(): Promise<PlaceSummary[]> {
  return query<PlaceSummary>(`
    SELECT p.*,
           COUNT(c.id)::int AS visit_count,
           ROUND(AVG(c.rating)::numeric, 1)::float AS avg_rating,
           MAX(c.visited_at) AS last_visit,
           (SELECT review FROM checkins WHERE place_id = p.id ORDER BY visited_at DESC LIMIT 1) AS last_review
    FROM places p
    LEFT JOIN checkins c ON c.place_id = p.id
    GROUP BY p.id
    ORDER BY MAX(c.visited_at) DESC NULLS LAST, p.created_at DESC
  `);
}

export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const rows = await query<Place>(`SELECT * FROM places WHERE slug = $1`, [slug]);
  return rows[0] ?? null;
}

export async function getCheckins(placeId: number): Promise<Checkin[]> {
  return query<Checkin>(
    `SELECT * FROM checkins WHERE place_id = $1 ORDER BY visited_at DESC, id DESC`,
    [placeId],
  );
}

// ~30m tolerance: a re-pasted link for the same spot should land on the same place.
const COORD_TOLERANCE = 0.0003;

export async function findExistingPlace(match: {
  placeRef: string | null;
  lat: number | null;
  lng: number | null;
  mapsUrl: string;
}): Promise<Place | null> {
  if (match.placeRef) {
    const rows = await query<Place>(`SELECT * FROM places WHERE place_ref = $1`, [match.placeRef]);
    if (rows[0]) return rows[0];
  }
  if (match.lat !== null && match.lng !== null) {
    const rows = await query<Place>(
      `SELECT * FROM places
       WHERE ABS(lat - $1) < $3 AND ABS(lng - $2) < $3
       ORDER BY ABS(lat - $1) + ABS(lng - $2)
       LIMIT 1`,
      [match.lat, match.lng, COORD_TOLERANCE],
    );
    if (rows[0]) return rows[0];
  }
  const rows = await query<Place>(`SELECT * FROM places WHERE maps_url = $1`, [match.mapsUrl]);
  return rows[0] ?? null;
}

function slugify(name: string): string {
  return (
    name
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "place"
  );
}

export async function createPlace(input: {
  name: string;
  mapsUrl: string;
  placeRef: string | null;
  lat: number | null;
  lng: number | null;
}): Promise<Place> {
  // "check-in" is a real route under /places.
  const base = slugify(input.name) === "check-in" ? "check-in-place" : slugify(input.name);
  const taken = await query<{ slug: string }>(
    `SELECT slug FROM places WHERE slug = $1 OR slug LIKE $2`,
    [base, `${base}-%`],
  );
  const used = new Set(taken.map((r) => r.slug));
  let slug = base;
  for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;

  const rows = await query<Place>(
    `INSERT INTO places (slug, name, maps_url, place_ref, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [slug, input.name, input.mapsUrl, input.placeRef, input.lat, input.lng],
  );
  return rows[0];
}

export async function addCheckin(input: {
  placeId: number;
  rating: number;
  review: string;
  visitedAt: Date;
}): Promise<Checkin> {
  const rows = await query<Checkin>(
    `INSERT INTO checkins (place_id, rating, review, visited_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [input.placeId, input.rating, input.review, input.visitedAt],
  );
  return rows[0];
}

export async function listRecentCheckins(limit = 15): Promise<(Checkin & { place_name: string; place_slug: string })[]> {
  return query(
    `SELECT c.*, p.name AS place_name, p.slug AS place_slug
     FROM checkins c JOIN places p ON p.id = c.place_id
     ORDER BY c.visited_at DESC, c.id DESC
     LIMIT $1`,
    [limit],
  );
}

export async function deleteCheckin(id: number): Promise<void> {
  await query(`DELETE FROM checkins WHERE id = $1`, [id]);
}
