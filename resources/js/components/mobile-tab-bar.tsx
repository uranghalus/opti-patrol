import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    ListTodo,
    FileText,
    User,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type TabItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
};

const mainTabs: TabItem[] = [
    { label: 'Beranda', href: dashboard(), icon: LayoutDashboard },
    { label: 'Inspeksi', href: '/inspection', icon: ListTodo },
    { label: 'Laporan', href: '/reports', icon: FileText },
    { label: 'Profil', href: '/settings/profile', icon: User },
];

export function MobileTabBar() {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <nav className="mobile-tab-bar">
            {mainTabs.map((tab) => {
                const active = isCurrentUrl(tab.href);
                const Icon = tab.icon;
                return (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        prefetch
                        className={cn('mobile-tab', active && 'mobile-tab-active')}
                    >
                        <Icon className="size-5" />
                        <span className="mobile-tab-label">{tab.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
