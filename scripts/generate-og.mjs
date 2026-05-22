// Generates an Open Graph image for adamhp.io
// Usage: node scripts/generate-og.mjs
// Output: public/og-image.png
//
// Requires: pnpm add -D satori @resvg/resvg-js
// Fonts: place SchibstedGrotesk-Regular.ttf and SchibstedGrotesk-Bold.ttf
//        in scripts/fonts/ (download from fonts.google.com/specimen/Schibsted+Grotesk)

import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Dark theme palette — converted from styles.css oklch values
const C = {
  bg:      '#262d3e', // oklch(27.8% 0.033 256.848)
  fg:      '#d4d8e8', // oklch(87.2% 0.01 258.338)
  fgLight: '#f2f4fa', // oklch(96.7% 0.003 264.542)
  accent:  '#7dd4f2', // oklch(90% 0.09 233)
}

// Builds a satori element — all containers must be display:flex
function box(style, children) {
  return {
    type: 'div',
    props: { style: { display: 'flex', ...style }, children },
  }
}

function span(content, style) {
  return { type: 'span', props: { style, children: content } }
}

async function generate({
  title    = 'Adam Pearce',
  subtitle = 'Software Engineer & Creative Technologist',
  out      = 'public/og-image.png',
} = {}) {
  const staticDir = join(__dirname, 'fonts', 'static')
  const regular = readFileSync(join(staticDir, 'SchibstedGrotesk-Regular.ttf'))
  const bold    = readFileSync(join(staticDir, 'SchibstedGrotesk-Bold.ttf'))

  const element = box(
    {
      flexDirection:   'column',
      justifyContent:  'space-between',
      width:           1200,
      height:          630,
      backgroundColor: C.bg,
      padding:         '64px 72px',
      fontFamily:      'Schibsted Grotesk',
    },
    [
      // Top: domain label
      box({}, [
        span('adamhp.io', {
          fontSize:      22,
          fontWeight:    400,
          color:         C.accent,
          letterSpacing: '0.04em',
        }),
      ]),

      // Center: name + tagline
      box({ flexDirection: 'column' }, [
        span(title, {
          fontSize:      86,
          fontWeight:    700,
          color:         C.fgLight,
          lineHeight:    1.05,
          letterSpacing: '-0.025em',
          marginBottom:  '24px',
        }),
        span(subtitle, {
          fontSize:   34,
          fontWeight: 400,
          color:      C.fg,
        }),
      ]),

      // Bottom: decorative rule
      box({ alignItems: 'center' }, [
        box({ height: 2, flexGrow: 1, backgroundColor: C.accent, opacity: 0.35 }, []),
      ]),
    ],
  )

  const svg = await satori(element, {
    width:  1200,
    height: 630,
    fonts: [
      { name: 'Schibsted Grotesk', data: regular, weight: 400, style: 'normal' },
      { name: 'Schibsted Grotesk', data: bold,    weight: 700, style: 'normal' },
    ],
  })

  const png = new Resvg(svg).render().asPng()
  writeFileSync(join(ROOT, out), png)
  console.log(`✓ ${out} (1200×630)`)
}

await generate()
