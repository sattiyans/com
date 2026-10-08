import type { APIRoute } from "astro";
import { checkPassword, endSession, startSession } from "@lib/places/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect, url }) => {
  const form = await request.formData();

  if (form.get("action") === "logout") {
    endSession(cookies);
    return redirect("/places", 303);
  }

  const password = `${form.get("password") || ""}`;
  if (!checkPassword(password)) {
    // Slow down guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return redirect("/places/check-in?error=1", 303);
  }

  startSession(cookies, url.protocol === "https:");
  return redirect("/places/check-in", 303);
};
