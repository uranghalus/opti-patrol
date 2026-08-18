---
version: 'alpha'
name: 'AER — climate dial'
description: 'Neumorphism + Glassmorphism hybrid style with Flexbox, CSS Filters, and Backdrop Blur.'
colors:
    primary: '#E8EEF2'
    secondary: '#c3ccd4'
    tertiary: '#ffffff'
    glassSurface: 'rgba(255, 255, 255, 0.45)'
    glassBorder: 'rgba(255, 255, 255, 0.6)'
typography:
    h1:
        fontFamily: system-ui
        fontSize: 2.5rem
        fontWeight: 700
    body-md:
        fontFamily: system-ui
        fontSize: 1rem
        fontWeight: 400
rounded:
    sm: 4px
    md: 8px
    lg: 16px
    xl: 24px
spacing:
    sm: 1rem
    md: 2rem
    lg: 4rem
blur:
    sm: 6px
    md: 12px
    lg: 24px
---

## Overview

AER — climate dial - Neumorphism + Glassmorphism hybrid style from the 2020s Digital era, refocused for full web application interfaces (dashboards, navigation, control panels) rather than isolated components.

- Density: 6/10
- Variance: 7/10
- Motion: 4/10 — Subtle
- **Style:** Neumorphism + Glassmorphism (hybrid)
- **Keywords:** softneum, glass, dial, climate, frosted
- **Era:** 2020s Digital
- **Light/Dark:** ✓ Light / ○ Dark

## Colors

- **#E8EEF2** — base background
- **#c3ccd4** — neumorphic shadow tone
- **#ffffff** — neumorphic highlight
- **#4db8e8** — accent (dial indicator)
- **#4a5a66** — text / deep contrast
- **rgba(255,255,255,0.45)** — glass surface fill
- **rgba(255,255,255,0.6)** — glass border / edge highlight

## Typography

- **system-ui**

## Layout

- **Features:** Flexbox, CSS Filters, Backdrop Blur, Transitions, Transforms, Gradients, Box Shadows, Border Radius, CSS Masks
- **Structure:** web-app-first — sticky glass navbar/topbar, collapsible glass side panel for navigation, dashboard grid of neumorphic widget cards, glass modals/drawers for detail views and settings

## Effects

- Neumorphism (soft extruded shadows on primary panels — cards, dial, buttons)
- Glassmorphism (frosted `backdrop-filter: blur()` panels with translucent fill and light border, layered over gradient backgrounds — used for navbar, overlays, modals, and floating widgets)
- Gradients (soft ambient gradients behind glass panels to give the blur something to catch)
- Combination rule: use neumorphism for surfaces sitting flush on the base background (dials, primary buttons, input wells), and glassmorphism for surfaces that visually float above content (navbar, hero overlay cards, tooltips, modals)

## Use Case

Web applications — dashboards, admin panels, SaaS product interfaces, data/monitoring consoles, in-app settings and control surfaces — anywhere a soft, tactile neumorphic base benefits from floating frosted-glass UI layers (navbars, modals, side panels, widget overlays) on top of functional, interaction-heavy screens.
