// FILE: src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders'; // 👈 Native Astro 6 loader module

const blog = defineCollection({
  // Enforces Astro v6 architecture to safely scan files inside src/content/blog/
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    category: z.string(),
    author: z.string().default('WSM Terminal Admin'),
    currentPrice: z.string().optional(),
  }),
});

export const collections = { blog };
