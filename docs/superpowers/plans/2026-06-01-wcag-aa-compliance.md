# WCAG 2.1 AA Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 8 WCAG 2.1 AA gaps identified in the audit across the personal Astro site.

**Architecture:** All changes are surgical edits to existing Astro components and the global CSS file — no new files, no new dependencies. Changes are grouped by file so each task is a focused, self-contained diff.

**Tech Stack:** Astro 5, Tailwind CSS v4, vanilla JS (inline `<script>` tags in Astro components)

**Spec:** `docs/superpowers/specs/2026-06-01-wcag-aa-compliance-design.md`

---

## File Map

| File | What changes |
|------|-------------|
| `src/styles.css` | Add `:focus-visible`, gate `scroll-behavior` on reduced-motion, fix `--foreground-lighter` alpha |
| `src/components/WorkList.astro` | Gate `fadeInRight` animation on `prefers-reduced-motion` |
| `src/pages/writing/index.astro` | Gate `fadeInRight` animation on `prefers-reduced-motion` |
| `src/components/PageContainer.astro` | Add `id="main-content"` to `<main>` |
| `src/layouts/Base.astro` | Add skip-to-main-content link |
| `src/components/Header.astro` | Add `aria-label` to `<nav>`, add `aria-hidden` to external-link SVG |
| `src/components/MobileNav.astro` | Add `aria-label` to `<nav>`, add `aria-hidden` to external-link SVG, fix toggle button label |
| `src/components/Footer.astro` | Add `aria-label` to `<nav>` |

---

## Task 1: Fix `styles.css` — focus styles, reduced motion, foreground-lighter

**Files:**
- Modify: `src/styles.css`

### What and why

Three independent CSS fixes in one file:

1. **`:focus-visible`** — Tailwind preflight strips browser focus rings. Without a replacement, keyboard users see no focus indicator (WCAG 2.4.7 AA).
2. **`scroll-behavior: smooth`** — Must be gated on `prefers-reduced-motion: no-preference` to avoid triggering vestibular disorders (WCAG 2.3.3 AA).
3. **`--foreground-lighter` alpha** — Currently defined with 0.9 opacity in light mode. Alpha-blended colors have non-deterministic contrast ratios. Replace with the fully-opaque blended equivalent: approximately `oklch(49.5% 0.015 286)`.

- [ ] **Step 1: Open `src/styles.css` and make three edits**

  **Edit 1** — Replace the unconditional `scroll-behavior` on `html` (currently around line 66) with a reduced-motion-gated version. Remove `scroll-behavior: smooth` from the `html {}` rule and add:

  ```css
  @media (prefers-reduced-motion: no-preference) {
    html {
      scroll-behavior: smooth;
    }
  }
  ```

  **Edit 2** — Fix `--foreground-lighter` in the light-mode block (`:root, :root[data-theme='light']`). Change:

  ```css
  --foreground-lighter: oklch(44.225% 0.0163 285.678 / 0.9);
  ```

  to:

  ```css
  --foreground-lighter: oklch(49.5% 0.015 286);
  ```

  (This is the opaque blended equivalent: 0.9 × 44.225 + 0.1 × 96.7 ≈ 49.5% lightness.)

  **Edit 3** — Add a `:focus-visible` rule at the end of the file (after the existing `.link:hover` rule):

  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 3px;
  }
  ```

- [ ] **Step 2: Verify contrast of the new `--foreground-lighter`**

  Run the dev server:
  ```bash
  pnpm dev
  ```

  Open `http://localhost:4321` in Chrome. Open DevTools → Elements, select any element using `text-foreground-lighter` (e.g. the date on the writing page). In the Styles panel, click the color swatch for `color` — Chrome will show the contrast ratio. It must be ≥ 4.5:1 for normal-weight text and ≥ 3:1 for text ≥ 24px or ≥ 18.67px bold.

  If contrast is below threshold:
  - Decrease L (darken): try `oklch(46% 0.015 286)` and re-check.
  - If already above threshold: proceed.

- [ ] **Step 3: Verify focus ring appears**

  With the dev server still running, tab through the home page (`http://localhost:4321`). Every interactive element (nav links, work list links) must show the blue outline ring when focused. Confirm it disappears when you click (`:focus-visible` only shows for keyboard navigation).

- [ ] **Step 4: Commit**

  ```bash
  git add src/styles.css
  git commit -m "fix(a11y): focus-visible styles, reduced-motion scroll, fix foreground-lighter contrast"
  ```

---

## Task 2: Gate animations on `prefers-reduced-motion`

**Files:**
- Modify: `src/components/WorkList.astro`
- Modify: `src/pages/writing/index.astro`

### What and why

`fadeInRight` animations run unconditionally. Users who have enabled "Reduce Motion" in their OS see them anyway. Wrapping them in `@media (prefers-reduced-motion: no-preference)` means they only run when the user has not opted out.

- [ ] **Step 1: Edit `src/components/WorkList.astro`**

  The current `<style>` block (lines 32–47) is:

  ```css
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

  Replace the entire `<style>` block with:

  ```css
  <style>
    @media (prefers-reduced-motion: no-preference) {
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
    }
  </style>
  ```

- [ ] **Step 2: Edit `src/pages/writing/index.astro`**

  The current `<style>` block (lines 43–58) is:

  ```css
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

  Replace the entire `<style>` block with:

  ```css
  <style>
    @media (prefers-reduced-motion: no-preference) {
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
    }
  </style>
  ```

- [ ] **Step 3: Verify**

  In Chrome DevTools, open the Rendering panel (⋮ → More tools → Rendering) and enable "Emulate CSS media feature prefers-reduced-motion: reduce". Reload `http://localhost:4321` — work items should appear instantly with no slide-in animation. Disable the emulation and confirm the animation returns.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/WorkList.astro src/pages/writing/index.astro
  git commit -m "fix(a11y): gate animations on prefers-reduced-motion"
  ```

---

## Task 3: Add skip link and `id="main-content"`

**Files:**
- Modify: `src/components/PageContainer.astro`
- Modify: `src/layouts/Base.astro`
- Modify: `src/styles.css`

### What and why

Without a skip link, keyboard users must tab through every nav item on every page load before reaching content (WCAG 2.4.1 A). The skip link is visually hidden until focused, then jumps focus to `#main-content`.

- [ ] **Step 1: Add `id="main-content"` to `PageContainer.astro`**

  Current file content:
  ```astro
  ---
  ---

  <main class="px-4 md:px-0 pb-16 md:pb-32 max-w-2xl mt-16 mx-auto space-y-16">
    <slot />
  </main>
  ```

  Replace with:
  ```astro
  ---
  ---

  <main id="main-content" class="px-4 md:px-0 pb-16 md:pb-32 max-w-2xl mt-16 mx-auto space-y-16">
    <slot />
  </main>
  ```

- [ ] **Step 2: Add the skip link to `Base.astro`**

  In `src/layouts/Base.astro`, find the opening `<body>` tag and add the skip link immediately after it, before `<Header />`:

  ```astro
  <body>
    <a href="#main-content" class="skip-link">Skip to main content</a>
    <Header />
    <slot />
    <Footer />
  </body>
  ```

- [ ] **Step 3: Add `.skip-link` styles to `src/styles.css`**

  Add the following at the end of `src/styles.css` (after the `:focus-visible` rule added in Task 1):

  ```css
  .skip-link {
    position: absolute;
    top: -100%;
    left: 0;
    z-index: 100;
    padding: 0.5rem 1rem;
    background: var(--background);
    color: var(--accent);
    font-family: var(--font-mono);
    text-decoration: none;
    border: 2px solid var(--accent);
  }

  .skip-link:focus {
    top: 0;
  }
  ```

- [ ] **Step 4: Verify**

  Load `http://localhost:4321` and press Tab once. A "Skip to main content" link should appear at the top-left of the page. Press Enter — focus should jump past the nav to the main content area. Press Tab again — focus should move to the first interactive element inside `<main>`.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/PageContainer.astro src/layouts/Base.astro src/styles.css
  git commit -m "fix(a11y): add skip-to-main-content link"
  ```

---

## Task 4: Fix nav landmarks — `Header.astro` and `Footer.astro`

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

### What and why

Three `<nav>` elements exist with no `aria-label`. Screen readers announce all three as "navigation", giving users no way to distinguish them. Also, the external-link SVG in the desktop nav is announced unnecessarily — it should be hidden from assistive technology.

- [ ] **Step 1: Edit `src/components/Header.astro`**

  Find the desktop `<nav>` opening tag (line 15):
  ```astro
  <nav
    class="h-24 max-w-2xl mx-auto flex flex-row items-end space-x-8 py-4 text-base font-mono uppercase justify-between"
  >
  ```

  Add `aria-label="Main"`:
  ```astro
  <nav
    aria-label="Main"
    class="h-24 max-w-2xl mx-auto flex flex-row items-end space-x-8 py-4 text-base font-mono uppercase justify-between"
  >
  ```

  Find the external-link SVG (around line 31). It currently starts with:
  ```astro
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
  ```

  Add `aria-hidden="true"` as the first attribute:
  ```astro
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
  ```

- [ ] **Step 2: Edit `src/components/Footer.astro`**

  Find the `<nav>` tag (line 8):
  ```astro
  <nav class="flex gap-6">
  ```

  Add `aria-label="Social links"`:
  ```astro
  <nav aria-label="Social links" class="flex gap-6">
  ```

- [ ] **Step 3: Verify**

  In Chrome DevTools → Accessibility panel, select the `<nav>` elements and confirm their accessible names show "Main", "Mobile", and "Social links" respectively.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/Header.astro src/components/Footer.astro
  git commit -m "fix(a11y): label nav landmarks, hide decorative SVG in header"
  ```

---

## Task 5: Fix `MobileNav.astro` — aria-label, SVG, and toggle button label

**Files:**
- Modify: `src/components/MobileNav.astro`

### What and why

Three issues in one component:
1. The `<nav>` has no `aria-label` (same issue as Task 4).
2. The external-link SVG is missing `aria-hidden="true"`.
3. The toggle button `aria-label` stays "Open navigation" even when the menu is open — it should update to "Close navigation" (WCAG 4.1.2 A).

- [ ] **Step 1: Add `aria-label="Mobile"` to the `<nav>`**

  Find line 11:
  ```astro
  <nav class="m-2">
  ```

  Change to:
  ```astro
  <nav aria-label="Mobile" class="m-2">
  ```

- [ ] **Step 2: Add `aria-hidden="true"` to the external-link SVG**

  Find the SVG inside the mobile nav link (around line 57):
  ```astro
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
  ```

  Add `aria-hidden="true"`:
  ```astro
  <svg
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
  ```

- [ ] **Step 3: Fix the toggle button label in the `<script>` block**

  The current click handler (lines 81–85):
  ```js
  btn?.addEventListener('click', () => {
    const isHidden = menu?.classList.contains('hidden')
    menu?.classList.toggle('hidden', !isHidden)
    btn?.setAttribute('aria-expanded', String(isHidden))
  })
  ```

  Replace with:
  ```js
  btn?.addEventListener('click', () => {
    const isHidden = menu?.classList.contains('hidden')
    menu?.classList.toggle('hidden', !isHidden)
    btn?.setAttribute('aria-expanded', String(isHidden))
    btn?.setAttribute('aria-label', isHidden ? 'Close navigation' : 'Open navigation')
  })
  ```

- [ ] **Step 4: Verify**

  Load `http://localhost:4321` on a narrow viewport (mobile). Press Tab to reach the hamburger button — the accessible name should read "Open navigation". Activate it (Enter or Space) — the menu opens and the accessible name should change to "Close navigation". Activate again — menu closes, name returns to "Open navigation".

  Use a screen reader (VoiceOver on Mac: Cmd+F5) or the Accessibility panel in DevTools to confirm the label update.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/MobileNav.astro
  git commit -m "fix(a11y): label mobile nav, hide decorative SVG, fix toggle button label"
  ```

---

## Task 6: Final verification pass

**Files:** None (read-only verification)

- [ ] **Step 1: Run a full axe scan on every page**

  With the dev server running (`pnpm dev`), install the axe DevTools browser extension (free tier) or use the Chrome Lighthouse panel. Run an accessibility audit on each of the four pages:

  - `http://localhost:4321/` (home)
  - `http://localhost:4321/writing`
  - `http://localhost:4321/writing/decisions`
  - `http://localhost:4321/resume`
  - `http://localhost:4321/contact`

  Expected: zero violations flagged at the AA level from the issues listed in the spec. Any remaining issues should be from the Cal.com embed or the PDF viewer — both are explicitly out of scope.

- [ ] **Step 2: Keyboard navigation walkthrough**

  Tab through the entire home page without using a mouse:
  - First Tab → skip link appears
  - Enter on skip link → focus lands on first element inside `<main>`
  - Continue tabbing → every link/button in nav and work list receives a visible focus ring
  - No keyboard traps, no lost focus

- [ ] **Step 3: Commit final state (if no changes needed)**

  If the verification pass required no additional fixes:
  ```bash
  git log --oneline -6
  ```
  Confirm all 5 fix commits are present.

  If any issues were found and fixed, commit them with:
  ```bash
  git add <changed files>
  git commit -m "fix(a11y): address issues found in verification pass"
  ```
