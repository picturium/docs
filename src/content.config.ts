import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // breadcrumb trail above the title, excluding "Docs" and this page
    crumbs: z.array(z.object({ label: z.string(), href: z.string() })).default([]),
    // config-keys style: section headings are TOML table names, set in mono
    monoHeadings: z.boolean().default(false),
  }),
});

export const collections = { docs };
