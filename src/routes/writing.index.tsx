import { createFileRoute, Link } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import { motion } from 'motion/react'
import PageContainer from '../components/PageContainer'

export const Route = createFileRoute('/writing/')({
  component: BlogIndex,
})

function BlogIndex() {
  // Posts are sorted by published date
  const sortedPosts = allPosts.sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  )

  return (
    <PageContainer>
      <section>
        <h1 className="uppercase font-mono border-b-2 border-line mb-4">
          WRITING
        </h1>
        <motion.ul
          className="divide-y divide-line/50"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {sortedPosts.map((post) => (
            <motion.li
              key={post.slug}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0 },
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="py-8"
            >
              <Link to="/writing/$slug" params={{ slug: post.slug }}>
                <div className="transition-all space-y-1 hover:bg-background-darker p-4 rounded-lg">
                  <div className="text-foreground-lighter font-mono uppercase text-sm">
                    {post.published.toLocaleDateString('en-US')}
                  </div>
                  <h2 className="link md:text-2xl">{post.title}</h2>
                  <div className="text-foreground-lighter">{post.excerpt}</div>
                </div>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </section>
    </PageContainer>
  )
}
