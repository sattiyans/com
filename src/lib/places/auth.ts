import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";
import { env } from "./env";

// Single-owner auth: one password env var, one signed session cookie.
const COOKIE = "places_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

function secret(): string | null {
  return env("PLACES_ADMIN_PASSWORD") ?? null;
}

function sign(payload: string, key: string): string {
  return createHmac("sha256", key).update(`places:${payload}`).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function isAuthConfigured(): boolean {
  return Boolean(secret());
}

export function checkPassword(candidate: string): boolean {
  const key = secret();
  if (!key) return false;
  // Compare HMACs so lengths always match and nothing leaks via timing.
  return safeEqual(sign(candidate, key), sign(key, key));
}

export function startSession(cookies: AstroCookies, secure: boolean): void {
  const key = secret();
  if (!key) return;
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  cookies.set(COOKIE, `${expires}.${sign(String(expires), key)}`, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function endSession(cookies: AstroCookies): void {
  cookies.delete(COOKIE, { path: "/" });
}

export function isOwner(cookies: AstroCookies): boolean {
  const key = secret();
  const value = cookies.get(COOKIE)?.value;
  if (!key || !value) return false;

  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, sign(expires, key));
}
