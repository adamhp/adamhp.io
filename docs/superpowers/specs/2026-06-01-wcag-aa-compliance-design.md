# WCAG 2.1 AA Compliance — Design Spec

**Date:** 2026-06-01  
**Target:** WCAG 2.1 Level AA  
**Approach:** Manual fixes only (no new tooling dependencies)  
**Scope:** All pages and components in `src/`

---

## Audit Summary

The site is structurally sound: semantic HTML, `aria-current`, `aria-expanded`, `<main>` landmark, `<time>` with datetime attributes, and image alt text are all in place. Eight specific gaps against WCAG 2.1 AA were identified.

---

## Issues and Fixes

### 1. No skip navigation link — WCAG 2.4.1 (Level A)

**File:** `src/layouts/Base.astro`, `src/components/PageContainer.astro`

Add a visually-hidden `<a href="#main-content">Skip to main content</a>` as the first child of `<body>` in `Base.astro`. It becomes visible on `:focus` so keyboard users can activate it. Add `id="main-content"` to the `<main>` element in `PageContainer.astro`.

Skip link styles (visually hidden until focused):
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
}
.skip-link:focus {
  top: 0;
}
```

---

### 2. Multiple unlabeled `<nav>` landmarks — WCAG 1.3.6 (Level A)

**Files:** `src/components/Header.astro`, `src/components/MobileNav.astro`, `src/components/Footer.astro`

Three `<nav>` elements exist with no `aria-label`. Screen readers announce them all as "navigation", which is ambiguous.

- `Header.astro` desktop `<nav>` → `aria-label="Main"`
- `MobileNav.astro` `<nav>` → `aria-label="Mobile"`
- `Footer.astro` `<nav>` → `aria-label="Social links"`

---

### 3. Decorative SVGs missing `aria-hidden` — WCAG 1.1.1 (Level A)

**Files:** `src/components/Header.astro`, `src/components/MobileNav.astro`

The external-link indicator SVGs are decorative (the link text already names the destination). Add `aria-hidden="true"` to both SVG elements so screen readers skip them.

---

### 4. Mobile nav button label doesn't update on toggle — WCAG 4.1.2 (Level A)

**File:** `src/components/MobileNav.astro`

The button `aria-label` is static: "Open navigation". When the menu is open, it should read "Close navigation". Update the toggle JS to set `aria-label` alongside `aria-expanded` on each click.

---

### 5. No `:focus-visible` styles — WCAG 2.4.7 (Level AA)

**File:** `src/styles.css`

Tailwind's preflight reset removes browser default focus rings. Add a global rule:

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 3px;
}
```

Using `:focus-visible` (not `:focus`) preserves the no-ring experience for mouse users while giving keyboard users a clear indicator.

---

### 6. Animations not gated on `prefers-reduced-motion` — WCAG 2.3.3 (Level AA)

**Files:** `src/components/WorkList.astro`, `src/pages/writing/index.astro`

The `fadeInRight` keyframe animations run unconditionally. Wrap both the `@keyframes` declaration and the `.work-item` / `.post-item` animation property inside `@media (prefers-reduced-motion: no-preference)`. Users who have opted out of motion see content without animation rather than instant-popping items.

---

### 7. `scroll-behavior: smooth` not gated on `prefers-reduced-motion` — WCAG 2.3.3 (Level AA)

**File:** `src/styles.css`

Move `scroll-behavior: smooth` from the unconditional `html {}` rule into:

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

---

### 8. `--foreground-lighter` alpha blending — WCAG 1.4.3 (Level AA)

**File:** `src/styles.css`

In light mode, `--foreground-lighter` is defined with 0.9 alpha (`oklch(44.225% 0.0163 285.678 / 0.9)`). Alpha values make contrast ratios non-deterministic and typically lower the effective contrast. Replace with the fully-opaque blended equivalent so the contrast ratio is calculable and verifiable.

Blended value against the light background `oklch(96.7% 0.001 286.375)`:

`oklch(44.225% 0.0163 285.678 / 0.9)` blended at 90% opacity over the background produces an equivalent opaque value of approximately `oklch(51% 0.015 286)`. This needs to be verified to pass 4.5:1 for normal text or 3:1 for large text (18px+ bold or 24px+ regular).

If the contrast is insufficient, lighten the text slightly (increase L in OKLCH) until the ratio passes, or darken it (lower L) — the existing color is already relatively dark so increasing L (lightening slightly) to ~55% should maintain sufficient contrast while matching the visual intent of "lighter" secondary text.

---

## Files Changed

| File | Changes |
|------|---------|
| `src/layouts/Base.astro` | Add skip link |
| `src/components/PageContainer.astro` | Add `id="main-content"` to `<main>` |
| `src/components/Header.astro` | `aria-label` on nav, `aria-hidden` on SVG |
| `src/components/MobileNav.astro` | `aria-label` on nav, `aria-hidden` on SVG, fix toggle label |
| `src/components/Footer.astro` | `aria-label` on nav |
| `src/components/WorkList.astro` | Gate animation on `prefers-reduced-motion` |
| `src/pages/writing/index.astro` | Gate animation on `prefers-reduced-motion` |
| `src/styles.css` | `:focus-visible`, `scroll-behavior`, `--foreground-lighter` fix |

---

## Out of Scope

- Third-party Cal.com embed (contact page) — accessibility is Cal's responsibility
- PDF accessibility — the PDF viewer is a browser native `<object>`; a download link fallback is already present
- WCAG Level AAA criteria
