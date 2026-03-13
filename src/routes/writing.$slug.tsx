import { Markdown } from '@/components/Markdown'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allPosts } from 'content-collections'
import PageContainer from '../components/PageContainer'

export const Route = createFileRoute('/writing/$slug')({
  loader: ({ params }) => {
    const post = allPosts.find((p) => p.slug === params.slug)
    if (!post) {
      throw notFound()
    }
    return post
  },
  component: BlogPost,
})

const proseClasses = [
  'prose',
  'lg:prose-xl',
  'prose-p:text-foreground',
  'prose-a:no-underline',
  'prose-headings:text-accent',
  'prose-a:text-accent',
  'prose-a:hover:text-accent-hover',
  'prose-blockquote:border-line',
  'prose-blockquote:mx-4',
  'prose-blockquote:my-12',
  'prose-blockquote:prose-p:text-foreground-lighter',
  'prose-h1:text-3xl',
  'prose-h2:text-2xl',
  'prose-h3:text-xl',
  'prose-h4:text-xl',
  'prose-h5:text-xl',
  'prose-code:background-color-background-darker',
  'prose-code:font-normal',
]

function BlogPost() {
  const post = Route.useLoaderData()
  return (
    <PageContainer>
      <Markdown className={proseClasses.join(' ')} post={post} />
      <footer className="pb-64 mt-16 max-w-2xl mx-auto flex flex-row items-baseline space-x-8 py-4 text-lg font-mono uppercase justify-center">
        <Link to="/">Back to home</Link>
      </footer>
    </PageContainer>
  )
}
