import { AppNav } from '@/components/app-nav';
import { MobileHeader } from '@/components/mobile-header';
import { MobileTabBar } from '@/components/mobile-tab-bar';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
}: AppLayoutProps) {
    return (
        <div className="app-bg min-h-[100dvh]">
            {/* Desktop: top nav */}
            <AppNav />

            {/* Mobile: header */}
            <MobileHeader />

            {/* Content */}
            <main className="mx-auto max-w-7xl px-4 py-4 pb-24 lg:px-6 lg:py-6 lg:pb-6">
                {children}
            </main>

            {/* Mobile: bottom tab bar */}
            <MobileTabBar />
        </div>
    );
}
