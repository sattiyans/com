import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { TOOLS } from "../data/tools";

export const GET: APIRoute = async () => {
  const now = new Date().toISOString();

  const staticUrls: { loc: string; changefreq: string; priority: string; lastmod?: string }[] = [
    { loc: "https://sattiyans.com/", changefreq: "weekly", priority: "1.0" },
    { loc: "https://sattiyans.com/hire", changefreq: "monthly", priority: "0.9" },
    { loc: "https://sattiyans.com/work", changefreq: "monthly", priority: "0.8" },
    { loc: "https://sattiyans.com/projects", changefreq: "monthly", priority: "0.8" },
    { loc: "https://sattiyans.com/blog", changefreq: "weekly", priority: "0.75" },
    { loc: "https://sattiyans.com/tools", changefreq: "weekly", priority: "0.95" },
    { loc: "https://sattiyans.com/cv", changefreq: "monthly", priority: "0.7" },
    { loc: "https://sattiyans.com/uses", changefreq: "monthly", priority: "0.4" },
    { loc: "https://sattiyans.com/ask", changefreq: "monthly", priority: "0.5" },
  ];

  const toolUrls = TOOLS.map((tool) => ({
    loc: `https://sattiyans.com${tool.href}`,
    changefreq: "monthly",
    priority: "0.9",
  }));

  const blogPosts = (await getCollection("blog")).filter((p) => !p.data.draft);
  const blogUrls = blogPosts.map((post) => ({
    loc: `https://sattiyans.com/blog/${post.slug}`,
    changefreq: "monthly",
    priority: "0.7",
    lastmod: post.data.date.toISOString(),
  }));

  const projects = (await getCollection("projects")).filter((p) => !p.data.draft);
  const projectUrls = projects.map((project) => ({
    loc: `https://sattiyans.com/projects/${project.slug}`,
    changefreq: "monthly",
    priority: "0.75",
    lastmod: project.data.date.toISOString(),
  }));

  const urls = [...staticUrls, ...toolUrls, ...blogUrls, ...projectUrls];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${"lastmod" in u && u.lastmod ? u.lastmod : now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
