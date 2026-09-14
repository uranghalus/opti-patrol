---
name: Stripe
colors:
  primary: "#533AFD"
  secondary: "#425466"
  surface: "#000000"
  on-surface: "#FFFFFF"
typography:
  body-md:
    fontFamily: sohne-var
    fontSize: 14px
    fontWeight: 300
rounded:
  md: 8px
---

# Design System Inspired by Stripe

## 1. Visual Theme & Atmosphere

Stripe's design system embodies modern fintech sophistication with a bold, forward-thinking aesthetic. The visual language combines deep, trustworthy blues and purples with vibrant accent colors that convey innovation and accessibility. Dynamic gradient overlays and flowing diagonal compositions create energy and movement, while clean typography and generous whitespace maintain clarity and professionalism. The system prioritizes clarity in complex financial contexts, using visual hierarchy to guide users through multi-step interactions. The overall mood is confident yet approachable — enterprise-grade infrastructure presented with warmth and clarity.

**Key Characteristics**

- Bold primary purple (`#533AFD`) paired with deep navy (`#0A2540`) for trust and authority
- Dynamic gradient accents (blue-to-purple, green-to-yellow) for visual interest and movement
- Clean, minimalist layout with generous whitespace
- High contrast text on light backgrounds for accessibility
- Sophisticated yet modern tone suitable for global financial platform
- Emphasis on clarity and progressive disclosure of information

## 2. Color Palette & Roles

### Primary

- **Brand Purple** (`#533AFD`): Primary interactive elements, CTAs, links, and focus states; the signature Stripe accent color
- **Deep Navy** (`#0A2540`): Primary text, headings, and high-contrast UI elements; conveys trust and stability

### Accent Colors

- **Bright Blue** (`#0073E6`): Secondary interactive states and alternative CTAs
- **Electric Blue** (`#0000EE`): Hover and active link states; strong visual emphasis
- **Steel Blue** (`#425466`): Secondary headings and supporting text; mid-tone neutrality

### Interactive

- **Button Purple** (`#533AFD`): Primary button backgrounds and interactive focus states
- **Link Blue** (`#0073E6`): Default hyperlink color; supports navigation hierarchy

### Neutral Scale

- **Black** (`#000000`): Body text, labels, and primary content
- **Slate** (`#3C4F69`): Secondary body text and descriptive copy
- **Medium Slate** (`#425466`): Tertiary text and supporting information
- **Light Slate** (`#64748D`): Disabled text and low-emphasis labels
- **White** (`#FFFFFF`): Primary background, card surfaces, and text on dark backgrounds

### Surface & Borders

- **Off-White** (`#F8FAFD`): Subtle background tint for secondary sections
- **Light Blue-Gray** (`#F6F9FC`): Tertiary background surfaces and subtle overlays
- **Border Gray** (`#E5EDF5`): Card borders, dividers, and subtle separators (1px stroke)

### Status & Semantic

- **Success Green** (`#15BE53`): Success states, confirmations, and positive indicators

## 3. Typography Rules

### Font Family

Primary: `sohne-var, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
Secondary (fallback): `"Helvetica Neue", Arial, sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display / Hero | sohne-var | 48px | 300 | 55.2px | normal | Large hero heading for page title |
| H1 Large | sohne-var | 32px | 700 | normal | normal | Top-level section heading |
| H1 Medium | sohne-var | 32px | 300 | 35.2px | normal | Medium hero intro text |
| H2 Large | sohne-var | 26px | 500 | 36px | normal | Major section subheading |
| H2 Medium | sohne-var | 26px | 300 | 29.12px | normal | Section heading with lighter weight |
| H2 Small | sohne-var | 18px | 500 | 28px | normal | Subsection heading |
| H3 | sohne-var | 15px | 425 | 24px | normal | Card title and feature heading |
| H4 | sohne-var | 16px | 400 | 22.4px | normal | Label and tertiary heading |
| Body | sohne-var | 14px | 300 | 19.6px | normal | Default paragraph and body copy |
| Body Large | sohne-var | 16px | 300 | normal | normal | Larger body text for emphasis |
| Button / Label | sohne-var | 14px | 400 | 14px | normal | Button text and form labels |
| Button Large | sohne-var | 16px | 400 | 16px | normal | Large button text |
| List Item | sohne-var | 16px | 300 | normal | normal | Bullet and numbered list items |

### Principles

- **Progressive Hierarchy**: Light weights (300) for long-form content; medium (400–425) for UI elements; bold (700) for prominent headings
- **Accessibility**: Minimum 14px for body text; line-height ≥1.4 for readability
- **Contrast**: Dark text on light backgrounds; ensure WCAG AA compliance for all text
- **Readability**: Use generous line-height for body copy; tighter line-height acceptable for headings and buttons

## 4. Component Stylings

### Buttons

**Primary Button**
- Background: `#533AFD`
- Color: `#FFFFFF`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 24px`
- Border Radius: `4px`
- Border: `none`
- Height: `40px`
- Line Height: `14px`
- Hover: Background `#4328D9` (darken 10%), shadow elevation lg
- Active: Background `#3620B0` (darken 20%)
- Disabled: Background `#CCCCCC`, Color `#666666`, cursor `not-allowed`, opacity `0.5`

**Secondary Button**
- Background: `transparent`
- Color: `#533AFD`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 24px`
- Border Radius: `4px`
- Border: `1px solid #533AFD`
- Height: `40px`
- Line Height: `14px`
- Hover: Background `rgba(83, 58, 253, 0.1)`, Border `1px solid #533AFD`
- Active: Background `rgba(83, 58, 253, 0.2)`
- Disabled: Border `1px solid #CCCCCC`, Color `#CCCCCC`

**Ghost Button (Text Link)**
- Background: `transparent`
- Color: `#533AFD`
- Font Size: `14px` or `16px`
- Font Weight: `400`
- Padding: `0px`
- Border Radius: `0px`
- Border: `none`
- Height: `auto`
- Line Height: `14px` or `16px`
- Hover: Color `#0073E6`, text-decoration `underline`
- Active: Color `#0000EE`
- Disabled: Color `#CCCCCC`, cursor `not-allowed`

**Icon Button**
- Background: `rgba(0, 0, 0, 0)`
- Color: `#0A2540`
- Padding: `12px`
- Border Radius: `4px`
- Border: `none`
- Height: `40px`
- Width: `40px`
- Hover: Background `rgba(0, 0, 0, 0.05)`
- Active: Background `rgba(0, 0, 0, 0.1)`

### Cards & Containers

**Default Card**
- Background: `#FFFFFF`
- Color: `#425466`
- Font Size: `14px`
- Font Weight: `300`
- Padding: `24px`
- Border Radius: `8px`
- Border: `1px solid #E5EDF5`
- Box Shadow: `rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px` (lg elevation)
- Line Height: `19.6px`

**Elevated Card**
- Background: `#FFFFFF`
- Color: `#425466`
- Font Size: `14px`
- Font Weight: `300`
- Padding: `32px`
- Border Radius: `8px`
- Border: `1px solid #E5EDF5`
- Box Shadow: `rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px` (xl elevation)
- Line Height: `19.6px`

**Minimal Card (No Shadow)**
- Background: `#FFFFFF`
- Color: `#425466`
- Font Size: `14px`
- Font Weight: `300`
- Padding: `20px`
- Border Radius: `6px`
- Border: `1px solid #E5EDF5`
- Box Shadow: `none`

**Section Container**
- Background: `#F6F9FC`
- Padding: `48px 32px`
- Border Radius: `0px`
- Border: `none`

### Inputs & Forms

**Input Field**
- Background: `#FFFFFF`
- Color: `#0A2540`
- Font Size: `14px`
- Font Weight: `300`
- Padding: `12px 16px`
- Border Radius: `4px`
- Border: `1px solid #E5EDF5`
- Height: `40px`
- Line Height: `19.6px`
- Placeholder Color: `#64748D`
- Focus: Border `1px solid #533AFD`, box-shadow `0 0 0 3px rgba(83, 58, 253, 0.1)`
- Hover: Border `1px solid #D0D8E0`
- Disabled: Background `#F6F9FC`, Color `#64748D`, Border `1px solid #E5EDF5`, cursor `not-allowed`

**Textarea**
- Background: `#FFFFFF`
- Color: `#0A2540`
- Font Size: `14px`
- Font Weight: `300`
- Padding: `12px 16px`
- Border Radius: `4px`
- Border: `1px solid #E5EDF5`
- Min Height: `120px`
- Line Height: `19.6px`
- Resize: `vertical`
- Focus: Border `1px solid #533AFD`, box-shadow `0 0 0 3px rgba(83, 58, 253, 0.1)`

**Checkbox / Radio**
- Size: `16px x 16px`
- Border Radius: `4px` (checkbox), `50%` (radio)
- Border: `1px solid #E5EDF5`
- Background (Checked): `#533AFD`
- Accent Color (Checked): `#FFFFFF`
- Focus: box-shadow `0 0 0 3px rgba(83, 58, 253, 0.1)`

### Navigation

**Header Navigation**
- Background: `rgba(255, 255, 255, 0.95)` or `#FFFFFF`
- Height: `64px`
- Padding: `16px 32px`
- Border: `none`
- Border Bottom: `1px solid #E5EDF5` (optional)
- Nav Link Color: `#425466`
- Nav Link Font Size: `14px`
- Nav Link Font Weight: `400`
- Nav Link Padding: `8px 16px`
- Nav Link Border Radius: `4px`
- Nav Link Hover: Background `rgba(83, 58, 253, 0.1)`, Color `#533AFD`
- Nav Link Active: Color `#533AFD`, font-weight `500`

**Mobile Navigation (Hamburger Menu)**
- Background: `#FFFFFF`
- Z-index: `999`
- Width: `100%` or sidebar width
- Padding: `16px`
- Box Shadow: `rgba(0, 0, 0, 0.1) 0px 18px 36px -18px`

### Badges

**Default Badge**
- Background: `rgba(83, 58, 253, 0.1)`
- Color: `#533AFD`
- Font Size: `12px`
- Font Weight: `500`
- Padding: `4px 8px`
- Border Radius: `2px`
- Border: `none`

**Success Badge**
- Background: `rgba(21, 190, 83, 0.1)`
- Color: `#15BE53`
- Font Size: `12px`
- Font Weight: `500`
- Padding: `4px 8px`
- Border Radius: `2px`

### Tabs

**Tab Button (Active)**
- Background: `transparent`
- Color: `#533AFD`
- Font Size: `14px`
- Font Weight: `500`
- Padding: `12px 16px`
- Border: `none`
- Border Bottom: `2px solid #533AFD`

**Tab Button (Inactive)**
- Background: `transparent`
- Color: `#64748D`
- Font Size: `14px`
- Font Weight: `400`
- Padding: `12px 16px`
- Border: `none`
- Border Bottom: `2px solid transparent`
- Hover: Color `#425466`, border-bottom `2px solid #E5EDF5`

## 5. Layout Principles

### Spacing System

Base unit: `8px`

Spacing scale:
- `4px` — micro spacing (internal padding, small gaps)
- `8px` — extra small (tight component spacing)
- `12px` — small (button padding, form field spacing)
- `16px` — base (standard component padding)
- `20px` — medium (section internal spacing)
- `24px` — large (consistent gap between related sections)
- `32px` — extra large (section padding, major container spacing)
- `36px` — xxl (large container gaps)
- `40px` — xxxl (major section separation)
- `48px` — hero (large section padding, hero spacing)
- `72px` — massive (full-page section separation)

**Usage Context:**
- `4px–8px`: Component internals (button padding, badge padding)
- `12px–16px`: Related elements, form groups, navigation items
- `20px–24px`: Card content grouping, section separation
- `32px–48px`: Major content sections, full-width padding
- `72px+`: Full-page spacing, hero sections

### Grid & Container

- **Max Width**: `1400px` for main content container
- **Column Strategy**: 12-column grid system; nested grid layout
- **Padding**: `32px` horizontal on desktop, `16px` on tablet, `12px` on mobile
- **Section Patterns**: Full-width hero with centered content, alternating side-by-side cards, stacked mobile

### Whitespace Philosophy

Generous whitespace creates breathing room and reduces cognitive load. Sections are well-separated with minimum `48px` vertical spacing. Cards and components use internal padding to create hierarchy. Larger whitespace around primary CTAs draws attention and improves click targets.

### Border Radius Scale

- `2px` — badges, small UI elements
- `4px` — buttons, inputs, small cards
- `5px` — alternate small card styling
- `6px` — standard card containers, nav items
- `8px` — large cards, modal containers
- `16.5px` — large rounded buttons (pill-style)

### Border Widths

- **Thin** (`1px`) — card borders, input borders, dividers (primary use)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| None | No shadow | Flat backgrounds, text-only elements |
| sm | `rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px` | Modals, floating panels, top-level overlays |
| md | `rgba(0, 0, 0, 0.1) 0px 18px 36px -18px, rgba(50, 50, 93, 0.25) 0px 30px 45px -30px` | Dropdowns, tooltips, secondary floating elements |
| lg | `rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px` | Cards, standard elevation, hover states |
| xl | `rgba(50, 50, 93, 0.25) 0px 30px 60px -12px, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px` | Elevated cards, featured sections, maximum depth |

**Shadow Philosophy:** Shadows follow a layered depth model with dual-layer composition — a color shadow layer for perceived depth and a black shadow layer for contrast. Shadows increase in spread and blur as elevation rises, creating clear visual hierarchy without harshness.

### Opacity Levels

- `0.10` (10%) — very subtle overlays, disabled border states
- `0.15` (15%) — hover backgrounds, light overlays
- `0.20` (20%) — active backgrounds, medium overlays
- `0.40` (40%) — semi-transparent text on images
- `0.50` (50%) — modal backdrop, dividing overlays
- `0.85` (85%) — almost opaque, reduced emphasis

### Z-index / Layering

- Base content: `1–3`
- Dropdown menus: `99`
- Sticky elements: `100`
- Modals / Overlays: `999`
- Toast notifications: `999999`

## 7. Do's and Don'ts

### Do

- **Use purple (`#533AFD`) for primary CTAs** — it's the brand signature and guides user attention
- **Maintain high contrast** — ensure text meets WCAG AA standards (4.5:1 for body text)
- **Apply consistent spacing** — use the 8px scale consistently to maintain rhythm
- **Stack shadows for depth** — use dual-layer shadows for modals and elevated cards
- **Keep borders subtle** — use `#E5EDF5` for dividers to avoid visual clutter
- **Use generous padding** — buttons and form fields should have at least `12px` padding
- **Leverage typography weights** — light (300) for content, medium (400–500) for UI, bold (700) for emphasis
- **Center align CTAs on mobile** — stack buttons vertically and make them full-width on small screens
- **Use color semantically** — green for success, purple for primary, blue for secondary actions
- **Provide clear focus states** — all interactive elements must have visible focus (ring or color change)

### Don't

- **Avoid low contrast combinations** — never place light gray text on light backgrounds
- **Don't mix multiple shadow levels** — keep elevation consistent within sections
- **Avoid harsh borders** — use light gray (`#E5EDF5`) instead of dark borders
- **Don't disable buttons without changing appearance** — apply opacity and color change
- **Avoid too many font sizes** — stick to defined hierarchy roles
- **Don't use color alone to convey meaning** — always support with text or icons
- **Avoid extremely long line lengths** — keep body text to 60–80 characters on desktop
- **Don't nest more than 2 levels of dropdowns** — use breadcrumbs or alternative navigation
- **Avoid missing padding on touch targets** — buttons and links must be at least `40px` tall
- **Don't place interactive elements too close together** — maintain at least `8px` spacing

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–639px | Single column layout, full-width buttons, condensed padding (12px), collapsed navigation |
| Tablet | 640px–1023px | Two-column layout, standard padding (24px), drawer navigation, medium text sizes |
| Desktop | 1024px–1399px | Multi-column layout, full navigation, optimal spacing (32px), larger typography |
| Large Desktop | 1400px+ | Fixed max-width container (1400px), centered layout, generous whitespace |

### Touch Targets

- **Minimum button size**: `40px` height × `40px` width
- **Minimum link/tap area**: `44px` × `44px` (recommended)
- **Form inputs**: `40px` minimum height with `12px` vertical padding
- **Navigation links**: `40px` minimum height with `16px` horizontal padding
- **Spacing between touch targets**: Minimum `8px` gap

### Collapsing Strategy

- **Navigation**: Collapse horizontal nav to hamburger menu below `1024px`
- **Buttons**: Stack vertically (full-width) below `640px`; side-by-side on larger screens
- **Cards**: Single column on mobile, two columns on tablet, three+ columns on desktop
- **Typography**: Reduce heading sizes by 20–30% on mobile; maintain readable body size (≥14px)
- **Padding**: Reduce horizontal padding from `32px` (desktop) to `16px` (tablet) to `12px` (mobile)
- **Images**: Use `max-width: 100%` with `height: auto` for responsive scaling

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Brand Purple (`#533AFD`)
- **Secondary CTA**: Bright Blue (`#0073E6`)
- **Body Text**: Deep Navy (`#0A2540`)
- **Secondary Text**: Steel Blue (`#425466`)
- **Borders / Dividers**: Border Gray (`#E5EDF5`)
- **Background (Light)**: Off-White (`#F8FAFD`)
- **Background (Lighter)**: Light Blue-Gray (`#F6F9FC`)
- **Success State**: Success Green (`#15BE53`)
- **Card Background**: White (`#FFFFFF`)

### Iteration Guide

1. **All interactive elements must use `sohne-var` font** with appropriate weight (400 for buttons, 300 for body, 700 for display headings).

2. **Primary buttons always start with `#533AFD` background** and darken to `#4328D9` on hover; use white text at `14px` weight `400`.

3. **Cards require `1px solid #E5EDF5` border** plus shadow elevation (lg: `rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px`).

4. **All text must maintain WCAG AA contrast** — minimum `4.5:1` for body, `3:1` for large text; test combinations like `#0A2540` text on `#FFFFFF` background.

5. **Spacing uses 8px base unit** — use multiples of 8 (`8px`, `16px`, `24px`, `32px`, etc.) for padding, margins, and gaps.

6. **Form inputs have `40px` height minimum** with `12px` vertical padding, `16px` horizontal padding, `4px` border-radius, and focus state with `3px rgba(83, 58, 253, 0.1)` ring.

7. **Responsive breakpoints**: Mobile ≤639px (single column, 12px padding), Tablet 640–1023px (two columns, 24px padding), Desktop ≥1024px (multi-column, 32px padding).

8. **Links default to `#533AFD`**, hover to `#0073E6`, active to `#0000EE`; use underline on hover for text links.

9. **Opacity scale**: Use `0.1` for very subtle, `0.15` for hover, `0.2` for active, `0.5` for overlays, `0.85` for reduced emphasis.

10. **Z-index layers**: Base `1–3`, dropdowns `99`, sticky `100`, modals `999`, toasts `999999` — maintain this hierarchy strictly.