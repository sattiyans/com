// Creates the Places tables. Safe to re-run.
// Usage: node --env-file=.env.local scripts/places-migrate.mjs
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Run `vercel env pull` first.");
  process.exit(1);
}

const sql = neon(url);

await sql`
  CREATE TABLE IF NOT EXISTS places (
    id          SERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    name        TEXT NOT NULL,
    maps_url    TEXT NOT NULL,
    place_ref   TEXT UNIQUE,
    lat         DOUBLE PRECISION,
    lng         DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS checkins (
    id          SERIAL PRIMARY KEY,
    place_id    INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,
    visited_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review      TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

await sql`CREATE INDEX IF NOT EXISTS checkins_place_visited_idx ON checkins (place_id, visited_at DESC)`;

console.log("Places schema ready.");
