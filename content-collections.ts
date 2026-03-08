import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const posts = defineCollection({
  name: 'posts',
  directory: 'src/writing',
  include: '**/*.md',
  schema: z.object({
    title: z.string(),
    published: z.coerce.date(),
    excerpt: z.string().optional(),
  }),
  transform: async (document) => {
    const post = {
      ...document,
      slug: document._meta.path,
    }
    console.log('post', post)
    return post
  },
})

export default defineConfig({
  content: [posts],
})
