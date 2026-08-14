---
version: 'alpha'
name: 'Soft UI Evolution — Glass Edition'
description: 'Design evolved neumorphism with improved contrast (WCAG AA+), modern aesthetics, subtle depth, accessibility focus — now with frosted-glass (glassmorphism) surfaces for overlays, nav, and elevated panels. Ideal for landing pages, saas. AI-ready template.'
colors:
    primary: '#266DD3'
    secondary: '#6568ca'
    tertiary: '#8764bf'
    glass-surface-light: 'rgba(255, 255, 255, 0.55)'
    glass-surface-dark: 'rgba(20, 24, 32, 0.45)'
    glass-border-light: 'rgba(255, 255, 255, 0.35)'
    glass-border-dark: 'rgba(255, 255, 255, 0.10)'
typography:
    h1:
        fontFamily: System UI stack
        fontSize: 2.25rem
        fontWeight: 700
    body-md:
        fontFamily: System UI stack
        fontSize: 1rem
        fontWeight: 400
    label-caps:
        fontFamily: System UI stack
        fontSize: 0.75rem
        fontWeight: 500
    caption-2xs:
        fontFamily: System UI stack
        fontSize: 0.625rem
        fontWeight: 500
rounded:
    sm: 10px
    md: 20px
    lg: 30px
glass:
    blur-sm: 8px
    blur-md: 16px
    blur-lg: 24px
    saturation: 140%
components:
    button-primary:
        backgroundColor: '{colors.primary}'
        rounded: '{rounded.sm}'
        padding: 12px
    panel-glass:
        backgroundColor: '{colors.glass-surface-light}'
        backdropFilter: 'blur({glass.blur-md}) saturate({glass.saturation})'
        border: '1px solid {colors.glass-border-light}'
        rounded: '{rounded.md}'
---

## Overview

Design evolved neumorphism with improved contrast (WCAG AA+), modern aesthetics, subtle depth, accessibility focus. Ideal for landing pages, saas. AI-ready template. Remember 2020 neumorphism? That beautiful disaster. Designers lost their minds over those puffy, extruded buttons — and then watched usability testers fail to distinguish active states from disabled ones. The contrast ratios were abysmal. WCAG compliance? Nonexistent. The style died fast, but the desire for tactile, physical-feeling interfaces never went away.

Samsung's One UI quietly showed the path forward. Soft shadows, generous padding, rounded containers — but with actual color differentiation and readable text. They proved you could have depth without sacrificing legibility. Apple's visionOS spatial design language pushed it further: layered surfaces with clear hierarchy, not just embossed sameness.

By 2026, Soft UI Evolution is what neumorphism should have been from the start. Real contrast ratios meeting AA standards. Shadows that communicate elevation, not decoration. Color palettes that use soft tones without washing out interactive elements. The tactile metaphor survived — it just grew up.

**This Glass Edition adds a second material layer.** Instead of choosing between soft-UI and glassmorphism, the system uses soft-UI as the base surface language (buttons, inputs, base cards) and reserves frosted-glass treatment for _elevated_ or _contextual_ surfaces — navigation bars, modals, side panels, tooltips, and hero overlays sitting on top of imagery or gradients. The two materials read as a coherent hierarchy: soft = grounded/base, glass = floating/elevated.

- Density: 5/10 — Balanced
- Variance: 4/10 — Moderate
- Motion: 4/10 — Subtle

- **Style:** Soft, Subtle, Pastel, Refined, Layered Glass
- **Keywords:** Evolved soft UI, glassmorphism accents, better contrast, modern aesthetics, subtle depth, accessibility-focused, improved shadows, hybrid material
- **Era:** 2020s Modern
- **Light/Dark:** ✓ Full / ✓ Full

## Colors

- **Soft Blue** (#87CEEB) — Accent highlight, links and focus states
- **Soft Pink** (#FFB6C1) — Primary text color
- **Soft Green** (#90EE90) — Supporting palette color
- **Glass Surface (Light)** rgba(255,255,255,0.55) — Frosted panel fill on light backgrounds
- **Glass Surface (Dark)** rgba(20,24,32,0.45) — Frosted panel fill on dark backgrounds
- **Glass Border (Light)** rgba(255,255,255,0.35) — 1px hairline on glass panels, light mode
- **Glass Border (Dark)** rgba(255,255,255,0.10) — 1px hairline on glass panels, dark mode

> Glass surfaces must always sit over a busy background (image, gradient, or layered content) — never over flat single-color backgrounds, or the blur has nothing to refract and just looks like a dull tint.

## Typography

- **Display / Hero:** System UI stack (-apple-system, sans-serif) — Weight 700, tight tracking, used for headline impact
- **Body:** System UI stack (-apple-system, sans-serif) — Weight 400, 16px/1.6 line-height, max 72ch per line
- **UI Labels / Captions:** System UI stack (-apple-system, sans-serif) — 0.875rem, weight 500, slight letter-spacing
- **Monospace:** JetBrains Mono — Used for code, metadata, and technical values

Scale:

- Hero: clamp(2.5rem, 5vw, 4rem)
- H1: 2.25rem
- H2: 1.5rem
- Body: 1rem / 1.6
- Small: 0.875rem
- Caption: 0.625rem (micro-captions: floor labels, brand sublines)

> On glass surfaces, bump body text weight to 500 minimum — blur softens edge contrast and thin weights lose legibility against busy backgrounds.

## Layout

- **Grid:** CSS Grid primary. Max-width containment: 1280px centered with 1.5rem side padding.
- **Spacing rhythm:** Balanced. Base unit: 0.5rem (8px).
- **Section vertical gaps:** clamp(4rem, 8vw, 8rem).
- **Hero layout:** Split-screen (text left, visual right).
- **Feature sections:** Zig-zag alternating text+image rows. No 3-equal-columns.
- **Mobile collapse:** All multi-column layouts collapse below 768px. No horizontal overflow.
- **z-index contract:** base (0) / sticky-nav (100) / overlay (200) / modal (300) / toast (500).
- **Glass placement rule:** sticky-nav, modal, and overlay layers use glass material by default; base (0) content layer stays soft-UI (opaque surfaces).

## Elevation & Depth

Improved shadows (softer than flat, clearer than neumorphism), modern (200-300ms), focus visible, WCAG AA/AAA.

- **Physics:** Ease-out curves, 200-300ms duration. Smooth and predictable.
- **Entry animations:** Fade + translate-Y (16px → 0) over 420ms ease-out. Staggered cascades for lists: 80ms between items.
- **Hover states:** Subtle color shift + shadow adjustment over 200ms.
- **Page transitions:** Fade only (200ms).
- **Glass transitions:** Blur radius animates 0 → target over 250ms alongside opacity, so panels feel like they "condense" into view rather than just appearing.
- **Performance:** Only transform, opacity, and backdrop-filter animated. No layout-triggering properties. Cap simultaneous blurred elements on-screen (≈4-6 on lower-end devices) — backdrop-filter is GPU-expensive.

## Shapes

Base corner radius: 10px. See rounded tokens in front matter for the full scale. Glass panels use the md (20px) radius by default — glass reads better with slightly softer corners than opaque soft-UI cards.

## Components

- **Primary Button:** Rounded (10px) shape. Accent color fill. Hover: 8% darken + subtle lift shadow. Active: -1px translate tactile press. Font weight 600. No outer glows. (Stays soft-UI, opaque — never glass.)
- **Secondary / Ghost Button:** Outline variant. 1.5px border in muted color. Text in primary color. Hover: subtle background fill.
- **Cards (base/opaque):** Rounded (10px) corners. Surface background. Subtle shadow (0 2px 12px rgba(0,0,0,0.06)). 1px border stroke.
- **Cards (glass/elevated variant):** Rounded (20px) corners. `glass-surface` fill + `backdrop-filter: blur(16px) saturate(140%)`. 1px `glass-border` hairline. Shadow: soft, wide, low-opacity (0 8px 32px rgba(0,0,0,0.10)) to reinforce floating. Use sparingly — for featured/pinned cards over imagery, not default grid cards.
- **Inputs:** Label above input. 1px border stroke. Focus ring: 2px accent color offset 2px. Error text below in semantic red. No floating labels. On glass panels, inputs get a slightly more opaque inner fill (+15% opacity) so they don't disappear into the blur.
- **Navigation:** Sticky nav uses glass material — `glass-surface` + `blur(8-16px)` — so content scrolls visibly beneath it. Active item: accent color indicator. Font weight 500 when active.
- **Modals / Dialogs:** Glass panel on a dimmed scrim (rgba(0,0,0,0.3) backdrop behind the modal, separate from the modal's own blur). Modal itself: `blur(24px) saturate(140%)`, glass-border, rounded-lg (30px).
- **Tooltips / Popovers:** Small glass chips — `blur(8px)`, tight padding, rounded-sm.
- **Skeletons:** Shimmer animation matching component dimensions. No circular spinners.
- **Empty States:** Icon-based composition with descriptive text and action button.

## Do's and Don'ts

- No emojis in UI — use icon system only (Lucide, Heroicons)
- No pure black (#000000) — use off-black or charcoal variants
- No oversaturated accent colors (saturation cap: 80%)
- No 3-column equal-width feature layouts — use zig-zag or asymmetric grid
- No `h-screen` — use `min-h-[100dvh]`
- No AI copywriting clichés: "Elevate", "Seamless", "Unleash", "Next-Gen"
- No broken external image links — use picsum.photos or inline SVG
- No generic lorem ipsum in demos
- No glass-on-glass stacking (a blurred panel on top of another blurred panel) — contrast collapses and text becomes unreadable
- No glass panels directly on flat single-color backgrounds — needs visual texture underneath to blur
- No glass material for primary/base content cards or buttons — reserve it for elevated/floating UI only

- Do Improved contrast AA/AAA
- Do Soft shadows modern
- Do Border-radius 8-12px (base) / 20px (glass panels)
- Do Animations 200-300ms
- Do Focus states visible
- Do Color hierarchy clear
- Do Reserve glass for nav, modals, overlays, and featured floating panels
- Do Always pair a glass panel with a busy background (image/gradient) behind it

## Use Case

Landing pages, SaaS — particularly dashboards or product pages with hero imagery/gradients where a floating nav or featured panel benefits from a frosted, layered feel.
