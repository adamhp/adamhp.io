# Astro + Netlify Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate adamhp.io from TanStack Start (React SSR on Vercel) to a fully static Astro site on Netlify, with no React dependency.

**Architecture:** Fresh Astro 5 project on a `feature/astro-migration` branch. Old TanStack Start scaffolding is deleted entirely; all pages and components are rewritten as `.astro` files. Vanilla JS handles interactivity (mobile nav); CSS animations replace Motion; Astro View Transitions handles page-to-page fades; Cal.com vanilla JS snippet replaces the React embed.

**Tech Stack:** Astro 5, `@astrojs/netlify` adapter, Tailwind CSS v4 (`@tailwindcss/vite` plugin), `@tailwindcss/typography`, `rehype-slug`, `rehype-autolink-headings`, pnpm.

---

## File Map

**Created:**
- `astro.config.mjs` — Astro config (adapter, Tailwind vite plugin, markdown plugins)
- `netlify.toml` — Netlify build config
- `tsconfig.json` — updated to extend `astro/tsconfigs/strict`
- `src/styles.css` — unchanged CSS (Tailwind v4 + design tokens)
- `src/data/work.ts` — typed data (currentWork, pastWork, navLinks) extracted from old constants.ts
- `src/content/config.ts` — Astro Content Collections schema
- `src/content/writing/decisions.md` — moved from src/writing/
- `src/layouts/Base.astro` — html shell with head, ViewTransitions, Header, Footer slot
- `src/components/PageContainer.astro` — styled `<main>` wrapper
- `src/components/Footer.astro` — empty footer
- `src/components/Header.astro` — desktop nav + mobile nav toggle
- `src/components/MobileNav.astro` — vanilla JS popover nav
- `src/components/WorkList.astro` — animated work item list
- `src/pages/index.astro` — home page
- `src/pages/writing/index.astro` — writing list with staggered CSS animation
- `src/pages/writing/[slug].astro` — individual blog post
- `src/pages/resume.astro` — PDF embed
- `src/pages/contact.astro` — Cal.com vanilla JS embed

**Deleted:**
- `vite.config.ts`, `content-collections.ts`, `src/router.tsx`, `src/routeTree.gen.ts`
- `src/routes/` (all files), `src/components/` (all React components), `src/util/`
- `eslint.config.js`, `.cta.json`

---

## Task 1: Create branch and replace project scaffolding

**Files:**
- Modify: `package.json`
- Create: `astro.config.mjs`, `netlify.toml`, `tsconfig.json`
- Delete: `vite.config.ts`, `content-collections.ts`, `src/router.tsx`, `src/routeTree.gen.ts`, `eslint.config.js`, `.cta.json`
- Delete dirs: `src/routes/`, `src/components/`, `src/util/`

- [ ] **Step 1: Create the feature branch**

```bash
git checkout -b feature/astro-migration
```

- [ ] **Step 2: Delete TanStack Start and old source files**

```bash
rm vite.config.ts content-collections.ts eslint.config.js .cta.json
rm src/router.tsx src/routeTree.gen.ts
rm -rf src/routes src/components src/util
```

- [ ] **Step 3: Rewrite package.json**

Replace the entire contents of `package.json` with:

```json
{
  "name": "adamhp.io",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
  },
  "dependencies": {
    "@astrojs/netlify": "^5.0.0",
    "@tailwindcss/typography": "^0.5.16",
    "@tailwindcss/vite": "^4.1.0",
    "astro": "^5.0.0",
    "rehype-autolink-headings": "^7.1.0",
    "rehype-slug": "^6.0.0",
    "tailwindcss": "^4.1.0"
  },
  "devDependencies": {
    "prettier": "^3.8.1",
    "typescript": "^5.7.2"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "esbuild",
      "lightningcss",
      "sharp"
    ]
  }
}
```

- [ ] **Step 4: Install dependencies**

```bash
pnpm install
```

Expected: clean install, no errors.

- [ ] **Step 5: Create `astro.config.mjs`**

```js
import netlify from '@astrojs/netlify'
import tailwindcss from '@tailwindcss/vite'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import { defineConfig } from 'astro/config'

export default defineConfig({
  output: 'static',
  adapter: netlify(),
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

- [ ] **Step 6: Create `netlify.toml`**

```toml
[build]
  command = "astro build"
  publish = "dist"
```

- [ ] **Step 7: Update `tsconfig.json`**

Replace the entire file:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 8: Commit the scaffolding**

```bash
git add -A
git commit -m "feat: replace TanStack Start with Astro scaffolding"
```

---

## Task 2: Port styles and create data module

**Files:**
- Keep: `src/styles.css` (no changes needed)
- Create: `src/data/work.ts`

- [ ] **Step 1: Verify `src/styles.css` is untouched**

The file already contains `@import "tailwindcss"` and `@plugin "@tailwindcss/typography"` — these work as-is with the `@tailwindcss/vite` Vite plugin. No edits needed.

- [ ] **Step 2: Create `src/data/work.ts`**

This replaces `src/util/constants.ts` with typed exports:

```ts
export type NavLink =
  | { label: string; to: string; href?: never }
  | { label: string; href: string; to?: never }

export type WorkItem = {
  title: string
  description: string
  link: string
}

export const currentWork: WorkItem[] = [
  {
    title: 'Agile Defense',
    description:
      'I am a full-time Staff Engineer and Solutions Architect for Agile Defense. I consult on cybersecurity software and other technical solutions for the public sector.',
    link: 'https://agiledefense.com',
  },
  {
    title: 'Pearce Labs',
    description:
      'My digital services agency focused on web design, software, and business automation serving local small businesses.',
    link: 'https://pearcelabs.com',
  },
  {
    title: 'multiborder.io',
    description:
      'An iOS app for adding borders to multiple images while preserving aspect ratio.',
    link: 'https://multiborder.io',
  },
]

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Writing', to: '/writing' },
  { label: 'Resume', to: '/resume' },
  { label: 'Contact', to: '/contact' },
  { label: 'Photos', href: 'https://adamhp.photos' },
  { label: 'GitHub', href: 'https://github.com/adamhp' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/adamhp' },
]

export const pastWork: WorkItem[] = [
  {
    title: 'XOR Security',
    description:
      'Early engineer at a boutique cybersecurity software company. Grew from 10 employees to 150 before being acquired by Enlightenment Capital.',
    link: 'https://www.crunchbase.com/acquisition/agile-defense-acquires-xor-security--c4bddf80',
  },
  {
    title: 'oeno.chat',
    description:
      'An exploratory weekend project using ChatGPT to find the best wine pairings for food.',
    link: 'https://oeno.chat',
  },
  {
    title: 'lasso.so',
    description:
      'A two-sided marketplace SaaS product for creators and brands, with media kits for creators and campaign management for brands.',
    link: '/writing/decisions#lasso',
  },
  {
    title: 'wildfire.so',
    description:
      "A SaaS product that analyzed creators' Twitter audiences to discover unique customer profiles to derive opportunities for monetization.",
    link: '/writing/decisions#wildfire',
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/styles.css src/data/work.ts
git commit -m "feat: add typed data module"
```

---

## Task 3: Set up Content Collections and move content

**Files:**
- Create: `src/content/config.ts`, `src/content/writing/decisions.md`
- Delete: `src/writing/`

- [ ] **Step 1: Create the content directories**

```bash
mkdir -p src/content/writing
```

- [ ] **Step 2: Move the existing post**

```bash
mv src/writing/decisions.md src/content/writing/decisions.md
rmdir src/writing
```

- [ ] **Step 3: Create `src/content/config.ts`**

```ts
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
```

- [ ] **Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: set up Astro content collections"
```

---

## Task 4: Create Base layout

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Create the `src/layouts/` directory**

```bash
mkdir -p src/layouts
```

- [ ] **Step 2: Create `src/layouts/Base.astro`**

```astro
---
import { ViewTransitions } from 'astro:transitions'
import Footer from '../components/Footer.astro'
import Header from '../components/Header.astro'
import '../styles.css'

interface Props {
  title?: string
  description?: string
}

const {
  title = 'adamhp.io',
  description =
    'Personal website of Adam Pearce, a full-stack software engineer and creative technologist.',
} = Astro.props
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" href="/favicon.ico" />
    <link rel="manifest" href="/manifest.json" />
    <ViewTransitions />
  </head>
  <body>
    <Header />
    <slot />
    <Footer />
  </body>
</html>
```

Note: `import '../styles.css'` in the frontmatter is how Astro imports global CSS — Vite processes it through the Tailwind plugin. The Google Fonts `@import url(...)` inside `styles.css` is already there and will be included in the output.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Base.astro
git commit -m "feat: add Base layout with ViewTransitions"
```

---

## Task 5: Create shared components

**Files:**
- Create: `src/components/PageContainer.astro`, `src/components/Footer.astro`, `src/components/MobileNav.astro`, `src/components/Header.astro`, `src/components/WorkList.astro`

- [ ] **Step 1: Create `src/components/PageContainer.astro`**

```astro
---
---

<main class="px-4 md:px-0 pb-16 md:pb-32 max-w-2xl mt-16 mx-auto space-y-16">
  <slot />
</main>
```

- [ ] **Step 2: Create `src/components/Footer.astro`**

```astro
---
---
```

(Footer renders nothing, matching the current implementation.)

- [ ] **Step 3: Create `src/components/MobileNav.astro`**

```astro
---
import { navLinks } from '../data/work'
---

<nav class="m-2">
  <button
    id="mobile-nav-btn"
    class="bg-background-darker p-2 rounded-lg"
    aria-label="Open navigation"
    aria-expanded="false"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 5h16"></path>
      <path d="M4 12h16"></path>
      <path d="M4 19h16"></path>
    </svg>
  </button>

  <div
    id="mobile-nav-menu"
    class="hidden bg-background-darker p-4 rounded-lg w-[calc(100vw-1rem)] space-y-4 text-xl mt-2"
  >
    {
      navLinks.map((link) =>
        link.to ? (
          <a href={link.to} class="link block rounded-sm px-1">
            {link.label}
          </a>
        ) : (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            class="link block rounded-sm px-1 relative"
          >
            {link.label}
            <span class="pointer-events-none select-none absolute top-0.5 ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M15 3h6v6"></path>
                <path d="M10 14L21 3"></path>
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
              </svg>
            </span>
          </a>
        ),
      )
    }
  </div>
</nav>

<script>
  const btn = document.getElementById('mobile-nav-btn')
  const menu = document.getElementById('mobile-nav-menu')

  btn?.addEventListener('click', () => {
    const isHidden = menu?.classList.contains('hidden')
    menu?.classList.toggle('hidden', !isHidden)
    btn.setAttribute('aria-expanded', String(isHidden))
  })

  document.addEventListener('click', (e) => {
    if (
      !btn?.contains(e.target as Node) &&
      !menu?.contains(e.target as Node)
    ) {
      menu?.classList.add('hidden')
      btn?.setAttribute('aria-expanded', 'false')
    }
  })

  // Close menu after View Transitions navigation
  document.addEventListener('astro:page-load', () => {
    menu?.classList.add('hidden')
    btn?.setAttribute('aria-expanded', 'false')
  })
</script>
```

- [ ] **Step 4: Create `src/components/Header.astro`**

```astro
---
import { navLinks } from '../data/work'
import MobileNav from './MobileNav.astro'
---

<header>
  <div class="hidden md:block">
    <nav
      class="h-24 max-w-2xl mx-auto flex flex-row items-end space-x-8 py-4 text-base font-mono uppercase justify-between"
    >
      {
        navLinks.map((link) =>
          link.to ? (
            <a href={link.to} class="link nav-link">
              {link.label}
            </a>
          ) : (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="nav-link link relative"
            >
              {link.label}
              <span class="pointer-events-none select-none absolute top-0.5 -right-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14L21 3"></path>
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                </svg>
              </span>
            </a>
          ),
        )
      }
    </nav>
  </div>
  <div class="md:hidden">
    <MobileNav />
  </div>
</header>
```

- [ ] **Step 5: Create `src/components/WorkList.astro`**

```astro
---
import type { WorkItem } from '../data/work'

interface Props {
  workList: WorkItem[]
  delay?: number
}

const { workList, delay = 0 } = Astro.props
---

<div class="space-y-4">
  {
    workList.map((work, i) => (
      <div
        class="work-item"
        style={`animation-delay: ${delay + i * 0.1}s`}
      >
        <a
          href={work.link}
          class="block rounded-lg p-4 transition-all hover:bg-background-darker cursor-pointer"
        >
          <dt class="font-semibold text-accent">{work.title}</dt>
          <dd class="col-span-2">{work.description}</dd>
        </a>
      </div>
    ))
  }
</div>

<style>
  .work-item {
    animation: fadeInRight 0.5s ease-out both;
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
```

- [ ] **Step 6: Run type check**

```bash
pnpm check
```

Expected: no type errors. If Astro reports missing types for `astro:content` or `astro:transitions`, run `pnpm astro sync` first to generate the type declarations.

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: add Astro components"
```

---

## Task 6: Create all pages

**Files:**
- Create: `src/pages/index.astro`, `src/pages/writing/index.astro`, `src/pages/writing/[slug].astro`, `src/pages/resume.astro`, `src/pages/contact.astro`

- [ ] **Step 1: Create `src/pages/` directory structure**

```bash
mkdir -p src/pages/writing
```

- [ ] **Step 2: Create `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
import WorkList from '../components/WorkList.astro'
import { currentWork, pastWork } from '../data/work'
---

<Base>
  <PageContainer>
    <section>
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
          <h1 class="font-mono uppercase">Current Work</h1>
        </div>
        <WorkList workList={currentWork} />
      </div>
    </section>

    <section>
      <div>
        <div class="border-b-2 border-line mb-8">
          <h1 class="font-mono uppercase">Past Work</h1>
        </div>
        <WorkList delay={0.3} workList={pastWork} />
      </div>
    </section>
  </PageContainer>
</Base>
```

- [ ] **Step 3: Create `src/pages/writing/index.astro`**

```astro
---
import { getCollection } from 'astro:content'
import Base from '../../layouts/Base.astro'
import PageContainer from '../../components/PageContainer.astro'

const posts = await getCollection('writing')
const sortedPosts = posts.sort(
  (a, b) =>
    new Date(b.data.published).getTime() - new Date(a.data.published).getTime(),
)
---

<Base title="Writing — adamhp.io">
  <PageContainer>
    <section>
      <h1 class="uppercase font-mono border-b-2 border-line mb-4">WRITING</h1>
      <ul class="divide-y divide-line/50 list-none p-0">
        {
          sortedPosts.map((post, i) => (
            <li
              class="py-8 post-item"
              style={`animation-delay: ${i * 0.1}s`}
            >
              <a href={`/writing/${post.id}`}>
                <div class="transition-all space-y-1 hover:bg-background-darker p-4 rounded-lg">
                  <div class="text-foreground-lighter font-mono uppercase text-sm">
                    {post.data.published.toLocaleDateString('en-US')}
                  </div>
                  <h2 class="link md:text-2xl">{post.data.title}</h2>
                  <div class="text-foreground-lighter">{post.data.excerpt}</div>
                </div>
              </a>
            </li>
          ))
        }
      </ul>
    </section>
  </PageContainer>
</Base>

<style>
  .post-item {
    animation: fadeInRight 0.5s ease-out both;
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
```

- [ ] **Step 4: Create `src/pages/writing/[slug].astro`**

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
---

<Base title={`${post.data.title} — adamhp.io`}>
  <PageContainer>
    <div class="uppercase text-foreground-lighter font-mono mb-4">
      Published {post.data.published.toLocaleDateString('en-US')}
    </div>
    <article class={proseClasses}>
      <Content />
    </article>
    <footer
      class="pb-64 mt-16 max-w-2xl mx-auto flex flex-row items-baseline space-x-8 py-4 text-lg font-mono uppercase justify-center"
    >
      <a href="/" class="link">Back to home</a>
    </footer>
  </PageContainer>
</Base>
```

- [ ] **Step 5: Create `src/pages/resume.astro`**

```astro
---
import Base from '../layouts/Base.astro'
import PageContainer from '../components/PageContainer.astro'
---

<Base title="Resume — adamhp.io">
  <PageContainer>
    <object
      data="/Adam Pearce Resume 2026.pdf"
      type="application/pdf"
      class="w-full h-full min-h-[calc(100vh-6rem)]"
    ></object>
  </PageContainer>
</Base>
```

- [ ] **Step 6: Create `src/pages/contact.astro`**

The Cal.com embed uses their vanilla JS snippet. The `Cal` global is typed as `any` to avoid TypeScript errors with the dynamic IIFE loader.

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
    <div
      id="cal-embed"
      class="w-full -mt-48 md:-mt-16"
      style="overflow: hidden; height: 1000px;"
    >
    </div>
  </PageContainer>
</Base>

<script>
  ;(function (C: any, A: string, L: string) {
    const p = (a: any, ar: any) => {
      a.q.push(ar)
    }
    const d = C.document
    C.Cal =
      C.Cal ||
      function (...args: any[]) {
        const cal = C.Cal
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (args[0] === L) {
          const api = (...a: any[]) => p(api, a)
          const namespace = args[1]
          ;(api as any).q = []
          typeof namespace === 'string'
            ? ((cal.ns[namespace] = api) && p(api, args))
            : p(cal, args)
          return
        }
        p(cal, args)
      }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  const Cal = (window as any).Cal
  Cal('init', '30min', { origin: 'https://cal.com' })
  Cal.ns['30min']('inline', {
    elementOrSelector: '#cal-embed',
    config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
    calLink: 'adamhp/30min',
  })
  Cal.ns['30min']('ui', { hideEventTypeDetails: false, layout: 'month_view' })
</script>
```

- [ ] **Step 7: Run type check**

```bash
pnpm check
```

Expected: no errors. If Astro reports an error about the `render` import from `astro:content`, run `pnpm astro sync` first to regenerate the `.astro/types.d.ts` file.

- [ ] **Step 8: Commit**

```bash
git add src/pages/
git commit -m "feat: add all Astro pages"
```

---

## Task 7: Build verification and final cleanup

- [ ] **Step 1: Run the Astro build**

```bash
pnpm build
```

Expected: `dist/` directory is created with no errors. You should see output like:
```
 generating static routes 
▶ /
▶ /writing/
▶ /writing/decisions
▶ /resume
▶ /contact
```

If you see type errors about `astro:content`, run `pnpm astro sync` then `pnpm build` again.

- [ ] **Step 2: Start the dev server and verify all pages**

```bash
pnpm dev
```

Visit each route and verify:
- `http://localhost:4321/` — home page loads, both work lists render with fade-in animation
- `http://localhost:4321/writing` — post list loads with stagger animation, "Decisions" post is visible
- `http://localhost:4321/writing/decisions` — post content renders with syntax highlighting, prose styles applied
- `http://localhost:4321/resume` — PDF embed shows
- `http://localhost:4321/contact` — Cal.com embed loads in the `#cal-embed` div
- Mobile breakpoint: mobile nav button appears, click to open popover, click a link to close

- [ ] **Step 3: Verify dark mode**

In the browser, switch `prefers-color-scheme` to dark (DevTools → Rendering → Emulate CSS media feature) and confirm the site renders correctly with the dark design tokens.

- [ ] **Step 4: Verify View Transitions**

Navigate between pages (e.g., Home → Writing → post → Back to Home) and confirm the page-to-page fade transition is smooth.

- [ ] **Step 5: Commit final state**

```bash
git add -A
git commit -m "feat: complete Astro + Netlify migration"
```

- [ ] **Step 6: Push branch for Netlify preview**

```bash
git push -u origin feature/astro-migration
```

Go to Netlify dashboard, connect the repo if not already connected, and point it at the `feature/astro-migration` branch. Netlify will build and provide a preview URL. Verify the preview URL loads all pages correctly.

- [ ] **Step 7: Cut over to production (when ready)**

Once the Netlify preview is verified:
1. In Netlify, set the production branch to `main` (or merge `feature/astro-migration` → `main` first)
2. Point the `adamhp.io` domain DNS to Netlify (follow Netlify's custom domain setup)
3. Remove the Vercel project (or just let it sit — it costs nothing on the free tier)

```bash
git checkout main
git merge feature/astro-migration
git push origin main
```
