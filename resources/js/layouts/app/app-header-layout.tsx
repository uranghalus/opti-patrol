import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <div className="app-bg min-h-[100dvh]">
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent>{children}</AppContent>
        </div>
    );
}
