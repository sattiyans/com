import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://sattiyans.com",
  output: "hybrid", // Enable server-side rendering for API routes
  integrations: [mdx(), sitemap(), tailwind()],
});
