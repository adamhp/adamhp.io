# Design: Migrate adamhp.io to Astro + Netlify

**Date:** 2026-05-21  
**Status:** Approved

## Overview

Migrate the personal site from TanStack Start (React SSR on Vite + Nitro, hosted on Vercel) to a fully static Astro site hosted on Netlify. The result is full Astro-native with no React dependency — vanilla JS for interactivity, Astro View Transitions for animations, Tailwind CSS v4 for styling.

## Approach

Work on a `feature/astro-migration` branch. Delete TanStack Start scaffolding entirely and scaffold a fresh Astro project in place. Port content and styles. When complete and tested via Netlify preview, cut over the domain and merge to main. Vercel keeps the old site live during development.

## Architecture

**Output mode:** Static (SSG) — all pages built at deploy time, no server.  
**Adapter:** `@astrojs/netlify` for Netlify CDN config and redirects.  
**Package manager:** pnpm (unchanged).

**Final directory structure:**

```
src/
  content/
    config.ts          ← Astro content collection schema (replaces content-collections.ts)
    writing/           ← Markdown posts (moved from src/writing/)
  layouts/
    Base.astro         ← <html>, <head>, fonts, global CSS, ViewTransitions
  components/
    Header.astro
    Footer.astro
    MobileNav.astro    ← vanilla JS popover
    WorkList.astro
    PageContainer.astro
  pages/
    index.astro
    writing/
      index.astro
      [slug].astro
    resume.astro
    contact.astro
public/                ← unchanged (PDF, favicon, static images)
netlify.toml           ← build config
astro.config.mjs       ← replaces vite.config.ts
```

**Files deleted:**
- `vite.config.ts`
- `content-collections.ts`
- `src/router.tsx`
- `src/routeTree.gen.ts`
- `src/routes/` (all)
- All `@tanstack/*`, `nitro`, `@content-collections/*`, `motion`, `react`, `react-dom` dependencies

## Styling

`src/styles.css` is kept nearly verbatim — the `@theme` block, CSS custom properties, and dark mode variants (`@custom-variant dark`) are all compatible with Tailwind CSS v4 in Astro. The `@tailwindcss/typography` plugin carries over for prose styles on blog posts. Google Fonts import is unchanged. Tailwind is updated to its latest version.

## Content

Astro 5's built-in Content Layer replaces `@content-collections/core`.

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

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

Posts are queried with `getCollection('writing')` in pages. Slugs come from filenames automatically. The single existing post (`decisions.md`) moves to `src/content/writing/decisions.md` unchanged.

Markdown rendering is handled natively by Astro. Shiki is the default syntax highlighter — no custom pipeline needed. `rehype-slug` and `rehype-autolink-headings` are configured in `astro.config.mjs` under `markdown.rehypePlugins`.

## Interactivity & Animations

**Mobile nav:** Rewritten as `MobileNav.astro` with an inline `<script>`. A button toggles a `data-open` attribute on the nav; CSS handles show/hide. No framework.

**Page transitions:** `<ViewTransitions />` added to `Base.astro` gives smooth page-to-page fades. The staggered list entrance on the writing index is implemented with a small `astro:page-load` script that applies CSS animation delays via data attributes.

**Cal.com embed:** `@calcom/embed-react` is replaced with Cal.com's vanilla JS snippet in `contact.astro`. The embed `<div>` uses `data-cal-link` and `data-cal-namespace` attributes.

## Netlify Configuration

```toml
# netlify.toml
[build]
  command = "astro build"
  publish = "dist"
```

No serverless functions required. Netlify's CDN serves the static output.

## What Is Not Changing

- All page content and copy
- Design system (colors, fonts, spacing, dark mode)
- `public/` assets (PDF resume, favicon, images)
- The writing post (`decisions.md`)
- Site URL and routes (`/`, `/writing`, `/writing/[slug]`, `/resume`, `/contact`)
