# SEO & Content Audit Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all SEO and content issues identified in the site audit: Open Graph meta, sitemap, canonical URLs, structured data, semantic HTML, footer, and page-level content improvements.

**Architecture:** All changes are in the Astro static site at `/Users/adam/dev/adamhp.io`. Meta/SEO changes flow through `Base.astro` (shared layout); page-specific changes go directly into each page. Sitemap generation is added via the `@astrojs/sitemap` Astro integration. JSON-LD is threaded through Base via an optional `jsonLD` string prop.

**Tech Stack:** Astro 5, Tailwind CSS 4, static output, `@astrojs/sitemap`

---

## File Map

| File | Change |
|---|---|
| `astro.config.mjs` | Add `site: 'https://adamhp.io'`, add sitemap integration |
| `package.json` | Add `@astrojs/sitemap` dependency (via npm install) |
| `public/manifest.json` | Fix `apple-touch-icon.png.png` → `apple-touch-icon.png` |
| `public/robots.txt` | Add `Sitemap:` directive |
| `src/layouts/Base.astro` | Add OG/Twitter meta, canonical link, optional JSON-LD |
| `src/pages/index.astro` | Add `<h1>`, pass description + JSON-LD |
| `src/pages/writing/[slug].astro` | Pass description, add `<h1>`, `<time>`, back link, JSON-LD |
| `src/pages/writing/index.astro` | Wrap dates in `<time datetime="">` |
| `src/pages/resume.astro` | Add description, download link, fallback text |
| `src/pages/contact.astro` | Add description |
| `src/components/Footer.astro` | Add copyright and social links |

---

### Task 1: Install sitemap integration and add site URL to config

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install @astrojs/sitemap**

```bash
cd /Users/adam/dev/adamhp.io && npm install @astrojs/sitemap
```

Expected: Package added to `package.json` dependencies.

- [ ] **Step 2: Update astro.config.mjs**

Replace the full contents of `astro.config.mjs` with:

```js
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://adamhp.io',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } }],
    ],
  },
})
```

- [ ] **Step 3: Verify build succeeds**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -20
```

Expected: Build completes with no errors. Output folder contains `sitemap-index.xml` and `sitemap-0.xml`.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add astro.config.mjs package.json package-lock.json && git commit -m "feat: add @astrojs/sitemap and site URL to config"
```

---

### Task 2: Fix manifest.json typo and add sitemap to robots.txt

**Files:**
- Modify: `public/manifest.json`
- Modify: `public/robots.txt`

- [ ] **Step 1: Fix manifest.json apple-touch-icon path**

In `public/manifest.json`, change line 21 from:
```json
      "src": "apple-touch-icon.png.png",
```
to:
```json
      "src": "apple-touch-icon.png",
```

- [ ] **Step 2: Update robots.txt**

Replace the full contents of `public/robots.txt` with:

```
# https://www.robotstxt.org/robotstxt.html
User-agent: *
Disallow:
Sitemap: https://adamhp.io/sitemap-index.xml
```

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add public/manifest.json public/robots.txt && git commit -m "fix: manifest apple-touch-icon extension typo, add sitemap to robots.txt"
```

---

### Task 3: Add Open Graph, Twitter Card, canonical URL, and JSON-LD to Base layout

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1: Replace Base.astro with the full updated version**

```astro
---
import { ClientRouter } from 'astro:transitions'
import Footer from '../components/Footer.astro'
import Header from '../components/Header.astro'
import '../styles.css'

interface Props {
  title?: string
  description?: string
  ogType?: string
  jsonLD?: string
}

const {
  title = 'adamhp.io',
  description = 'Personal website of Adam Pearce, a full-stack software engineer and creative technologist.',
  ogType = 'website',
  jsonLD,
} = Astro.props

const canonicalURL = new URL(Astro.url.pathname, Astro.site)
const fullTitle = title === 'adamhp.io' ? title : title
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={ogType} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:site_name" content="adamhp.io" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />

    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />

    {jsonLD && <script type="application/ld+json" set:html={jsonLD} />}

    <ClientRouter />
  </head>
  <body>
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -20
```

Expected: No errors.

- [ ] **Step 3: Spot-check OG tags in built output**

```bash
grep -A2 'og:title' /Users/adam/dev/adamhp.io/dist/index.html
```

Expected: Lines showing `<meta property="og:title" content="adamhp.io" />` and surrounding tags.

- [ ] **Step 4: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/layouts/Base.astro && git commit -m "feat: add OG tags, Twitter Card, canonical URL, and JSON-LD slot to Base layout"
```

---

### Task 4: Homepage — add h1, description prop, and Person JSON-LD

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace index.astro with the updated version**

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
import WorkList from '../components/WorkList.astro'
import { currentWork, pastWork } from '../data/work'

const description =
  'Personal website of Adam Pearce, a full-stack software engineer and creative technologist based in the US.'

const jsonLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Adam Pearce',
  url: 'https://adamhp.io',
  jobTitle: 'Full-Stack Software Engineer',
  sameAs: ['https://github.com/adamhp', 'https://linkedin.com/in/adamhp'],
})
---

<Base description={description} jsonLD={jsonLD}>
  <PageContainer>
    <section>
      <h1 class="uppercase font-mono border-b-2 border-line mb-8">Adam Pearce</h1>
      <div class="space-y-4 text-xl">
        <p>
          Hey, I&apos;m Adam! I&apos;m a full-stack software engineer, and I&apos;ve spent the last
          ten years building software products and pursuing creativity.
        </p>
        <p>
          I like <a href="/writing" class="link">writing</a> and taking <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://adamhp.photos">photos</a
          >, and I&apos;m always open for a chat about software, creativity, or anything in between,
          so feel free to <a
            class="link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://cal.com/adamhp">reach out.</a
          >
        </p>
      </div>
    </section>

    <section>
      <div class="space-y-4">
        <div class="border-b-2 border-line mb-8">
          <h2 class="font-mono uppercase">Current Work</h2>
        </div>
        <WorkList workList={currentWork} />
      </div>
    </section>

    <section>
      <div>
        <div class="border-b-2 border-line mb-8">
          <h2 class="font-mono uppercase">Past Work</h2>
        </div>
        <WorkList delay={0.3} workList={pastWork} />
      </div>
    </section>
  </PageContainer>
</Base>
```

- [ ] **Step 2: Verify build and check h1 in output**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep '<h1' /Users/adam/dev/adamhp.io/dist/index.html
```

Expected: Build succeeds, output contains `<h1` with "Adam Pearce".

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/pages/index.astro && git commit -m "feat: add h1, description, and Person JSON-LD to homepage"
```

---

### Task 5: Blog post template — description, h1, time element, back link, BlogPosting JSON-LD

**Files:**
- Modify: `src/pages/writing/[slug].astro`

- [ ] **Step 1: Replace [slug].astro with the updated version**

```astro
---
import { getCollection, render } from 'astro:content'
import Base from '../../layouts/Base.astro'
import PageContainer from '../../components/PageContainer.astro'

export async function getStaticPaths() {
  const posts = await getCollection('writing')
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await render(post)

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
  'prose-code:font-normal',
].join(' ')

const jsonLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.excerpt ?? '',
  datePublished: post.data.published.toISOString(),
  author: {
    '@type': 'Person',
    name: 'Adam Pearce',
    url: 'https://adamhp.io',
  },
  url: `https://adamhp.io/writing/${post.id}`,
})
---

<Base
  title={`${post.data.title} — adamhp.io`}
  description={post.data.excerpt}
  ogType="article"
  jsonLD={jsonLD}
>
  <PageContainer>
    <div class="uppercase text-foreground-lighter font-mono mb-2 text-sm">
      Published <time datetime={post.data.published.toISOString()}>
        {post.data.published.toLocaleDateString('en-US', { timeZone: 'UTC' })}
      </time>
    </div>
    <h1 class="text-3xl font-bold mb-8">{post.data.title}</h1>
    <article class={proseClasses}>
      <Content />
    </article>
    <footer
      class="pb-64 mt-16 max-w-2xl mx-auto flex flex-row items-baseline space-x-8 py-4 text-lg font-mono uppercase justify-center"
    >
      <a href="/writing" class="link">Back to writing</a>
      <a href="/" class="link">Back to home</a>
    </footer>
  </PageContainer>
</Base>
```

- [ ] **Step 2: Verify build and check h1 in post output**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep '<h1\|og:description\|BlogPosting' /Users/adam/dev/adamhp.io/dist/writing/decisions/index.html | head -10
```

Expected: Build succeeds, output contains `<h1`, `og:description` with the excerpt, and `BlogPosting` in the JSON-LD script.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/pages/writing/[slug].astro && git commit -m "feat: add h1, description, time element, back links, and BlogPosting JSON-LD to blog post template"
```

---

### Task 6: Writing index — wrap dates in semantic time elements

**Files:**
- Modify: `src/pages/writing/index.astro`

- [ ] **Step 1: Replace the date rendering line**

In `src/pages/writing/index.astro`, find:
```astro
                  <div class="text-foreground-lighter font-mono uppercase text-sm">
                    {post.data.published.toLocaleDateString('en-US', { timeZone: 'UTC' })}
                  </div>
```

Replace with:
```astro
                  <div class="text-foreground-lighter font-mono uppercase text-sm">
                    <time datetime={post.data.published.toISOString()}>
                      {post.data.published.toLocaleDateString('en-US', { timeZone: 'UTC' })}
                    </time>
                  </div>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep 'datetime' /Users/adam/dev/adamhp.io/dist/writing/index.html | head -5
```

Expected: Build succeeds, output contains `datetime="` attributes on the writing index page.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/pages/writing/index.astro && git commit -m "fix: wrap post dates in semantic time elements on writing index"
```

---

### Task 7: Fill in Footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace Footer.astro with content**

```astro
---
const year = new Date().getFullYear()
---

<footer class="mt-24 border-t border-line">
  <div class="max-w-2xl mx-auto px-4 md:px-0 py-8 flex flex-row justify-between items-center font-mono text-sm text-foreground-lighter uppercase">
    <span>Adam Pearce &copy; {year}</span>
    <nav class="flex gap-6">
      <a href="https://github.com/adamhp" class="link" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://linkedin.com/in/adamhp" class="link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://adamhp.photos" class="link" target="_blank" rel="noopener noreferrer">Photos</a>
    </nav>
  </div>
</footer>
```

- [ ] **Step 2: Verify build and check footer in output**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep -i 'footer\|linkedin\|copyright' /Users/adam/dev/adamhp.io/dist/index.html | head -10
```

Expected: Build succeeds, output contains footer with copyright and nav links.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/components/Footer.astro && git commit -m "feat: add footer with copyright and social links"
```

---

### Task 8: Resume page — add description, fallback text, and download link

**Files:**
- Modify: `src/pages/resume.astro`

- [ ] **Step 1: Replace resume.astro**

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
---

<Base
  title="Resume — adamhp.io"
  description="Resume of Adam Pearce, full-stack software engineer and solutions architect."
>
  <PageContainer>
    <div class="flex justify-between items-baseline mb-4">
      <h1 class="uppercase font-mono border-b-2 border-line">Resume</h1>
      <a
        href="/Adam Pearce Resume 2026.pdf"
        download
        class="link font-mono text-sm uppercase"
      >Download PDF</a>
    </div>
    <object
      data="/Adam Pearce Resume 2026.pdf"
      type="application/pdf"
      class="w-full h-full min-h-[calc(100vh-6rem)]"
    >
      <p class="text-foreground-lighter font-mono">
        PDF preview not available in your browser.
        <a href="/Adam Pearce Resume 2026.pdf" download class="link">Download the resume instead.</a>
      </p>
    </object>
  </PageContainer>
</Base>
```

- [ ] **Step 2: Verify build**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep 'og:description\|download\|<h1' /Users/adam/dev/adamhp.io/dist/resume/index.html | head -10
```

Expected: Build succeeds, output contains description meta, download link, and h1.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/pages/resume.astro && git commit -m "feat: add h1, description, download link, and fallback to resume page"
```

---

### Task 9: Contact page — add description and h1

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Add description prop and h1 to the Base call and page content**

Replace the opening frontmatter and `<Base>` block in `src/pages/contact.astro`. The file currently starts:

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
---

<Base title="Contact — adamhp.io">
  <PageContainer>
    <div class="text-lg">
      Email me at <a class="link" href="mailto:adamp319@gmail.com">adamp319@gmail.com</a>, or book a
      time to chat below.
    </div>
```

Replace with:

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
---

<Base
  title="Contact — adamhp.io"
  description="Get in touch with Adam Pearce — book a 30-minute chat about software, creativity, or anything in between."
>
  <PageContainer>
    <h1 class="uppercase font-mono border-b-2 border-line mb-8">Contact</h1>
    <div class="text-lg">
      Email me at <a class="link" href="mailto:adamp319@gmail.com">adamp319@gmail.com</a>, or book a
      time to chat below.
    </div>
```

The rest of the file (the `<div id="cal-embed">` and `<script>` block) remains unchanged.

- [ ] **Step 2: Verify build**

```bash
cd /Users/adam/dev/adamhp.io && npm run build 2>&1 | tail -5 && grep 'og:description\|<h1' /Users/adam/dev/adamhp.io/dist/contact/index.html | head -5
```

Expected: Build succeeds, output contains description meta and h1.

- [ ] **Step 3: Commit**

```bash
cd /Users/adam/dev/adamhp.io && git add src/pages/contact.astro && git commit -m "feat: add description and h1 to contact page"
```

---

## Self-Review

**Spec coverage check:**

| Audit Item | Task |
|---|---|
| Open Graph / Twitter Card | Task 3 |
| Sitemap | Task 1 |
| Canonical URLs | Task 3 |
| Blog post description | Task 5 |
| manifest.json typo | Task 2 |
| Homepage h1 | Task 4 |
| Blog post h1 | Task 5 |
| JSON-LD structured data | Tasks 4, 5 |
| robots.txt sitemap directive | Task 2 |
| `<time datetime="">` on dates | Tasks 5, 6 |
| "Back to writing" link | Task 5 |
| Footer | Task 7 |
| Resume description + download | Task 8 |
| Contact description | Task 9 |

All audit items are covered. No placeholders present.
