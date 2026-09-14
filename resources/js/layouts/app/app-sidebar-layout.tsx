/*
 * DIRECTION CONTRACT — Stripe world (pinned by Design.md)
 * THESIS: enterprise-grade inspection ops presented with fintech clarity —
 * white ground, 1px #E5EDF5 borders, dual-layer shadows; the category default
 * (glass/neumorphic cyan chrome) is refused.
 * OWN-WORLD: Brand Purple #533AFD interactive, Deep Navy #0A2540 text,
 * Steel Blue #425466 secondary, radius 4px controls / 8px cards, sohne-var
 * (Inter standing in) with 300/400/500/700 weights.
 * STORY: a field-operations user scans the nav, lands on a bordered white
 * card, and acts — every state (hover, active, disabled) speaks purple.
 * FIRST VIEWPORT: 64px white header nav over a 1400px content column,
 * 12px mobile → 16px tablet → 32px desktop gutters, breadcrumb strip when
 * the page supplies one.
 * FORM: app-wide retoken of the incumbent shell, code-led (pinned brief).
 * FINISH: unreviewed and undocumented is unfinished; this build ends with
 * the finish review, the verdict, and DESIGN.md.
 */
import { AppNav } from '@/components/app-nav';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MobileHeader } from '@/components/mobile-header';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    breadcrumbs = [],
    children,
}: AppLayoutProps) {
    return (
        <div className="app-bg min-h-[100dvh]">
            {/* Desktop: header navigation (64px, design.md spec) */}
            <AppNav />

            {/* Mobile: sticky header */}
            <MobileHeader />

            {/* Content: 1400px max column, design.md responsive gutters */}
            <main className="mx-auto max-w-[1400px] px-3 py-6 pb-24 sm:px-4 lg:px-8 lg:py-8 lg:pb-8">
                {breadcrumbs.length > 0 && (
                    <div className="mb-6 border-b border-border pb-4">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                )}
                {children}
            </main>

            {/* Mobile: bottom tab bar */}
            <MobileTabBar />
        </div>
    );
}
