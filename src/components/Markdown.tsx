import { renderMarkdown, type MarkdownResult } from '@/util/markdown'
import type { Post } from 'content-collections'
import parse, { Element, type HTMLReactParserOptions } from 'html-react-parser'
import { useEffect, useState } from 'react'

type MarkdownProps = {
  className: string
  post: Post
}

export function Markdown({ post, className }: MarkdownProps) {
  const [result, setResult] = useState<MarkdownResult | null>(null)

  useEffect(() => {
    renderMarkdown(post?.content).then(setResult)
  }, [post?.content])

  if (!result) {
    return <div className={className}>Loading...</div>
  }

  const options: HTMLReactParserOptions = {
    replace: (domNode) => {
      if (domNode instanceof Element) {
        if (domNode.name === 'img') {
          // Add lazy loading to images
          return <img {...domNode.attribs} loading="lazy" />
        }
      }
    },
  }

  return (
    <>
      <div className="uppercase opacity-25 font-mono mb-4">
        Published {post.published.toLocaleDateString('en-US')}
      </div>
      <article className={className}>{parse(result.markup, options)}</article>
    </>
  )
}
