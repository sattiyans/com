import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional()
  }),
});

const work = defineCollection({
  type: "content",
  schema: z.object({
    company: z.string(),
    role: z.string(),
    dateStart: z.coerce.date(),
    dateEnd: z.union([z.coerce.date(), z.string()]),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().optional(),
    role: z.string().optional(), // Your role in the project (e.g., "Backend Developer", "Full-Stack Developer", "Frontend Developer")
    password: z.string().optional(), // Password to protect/lock this project page
    client: z.string().optional(), // Client name (if project was done for a client)
    projectOwner: z.string().optional(), // Project owner/employer (if project is owned by employer)
    projectURL: z.string().url().optional(), // Live project URL (new field)
    demoURL: z.string().url().optional(), // Live project URL (legacy field, kept for backward compatibility)
    repoURL: z.string().url().optional(), // GitHub repository URL
    techStack: z.array(z.string()).optional(), // Array of technologies used
    screenshots: z.array(z.string()).optional(), // Array of screenshot image paths/URLs
    thumbnail: z.string().optional(), // Thumbnail image for project listing (path or URL) - legacy, use featuredImage instead
    featuredImage: z.string().optional(), // Featured image for project listing page (path or URL)
  }),
});

export const collections = { blog, work, projects };
