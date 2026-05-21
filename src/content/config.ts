import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    excerpt: z.string().optional(),
  }),
})

export const collections = { writing }
