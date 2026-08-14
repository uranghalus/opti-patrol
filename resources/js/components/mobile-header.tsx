import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    DatabaseZap,
    FileText,
    FireExtinguisher,
    Menu,
    ShieldCheck,
    UserCog2,
    X,
} from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

const drawerSections: { title: string; icon: React.ComponentType<{ className?: string }>; items: { title: string; href: string }[] }[] = [
    {
        title: 'Role Management',
        icon: UserCog2,
        items: [
            { title: 'Permission List', href: '/role-management/permission-list' },
            { title: 'Role List', href: '/role-management/role-list' },
        ],
    },
    {
        title: 'Data Master',
        icon: DatabaseZap,
        items: [
            { title: 'Data Pengguna', href: '/master-data/pengguna' },
            { title: 'Data Departemen', href: '/master-data/departemen' },
            { title: 'Data Jabatan', href: '/master-data/jabatan' },
            { title: 'Data Unit Bisnis', href: '/master-data/unit-bisnis' },
            { title: 'Data Karyawan', href: '/master-data/karyawan' },
        ],
    },
    {
        title: 'Data Fire Safety',
        icon: FireExtinguisher,
        items: [
            { title: 'Data CP Security', href: '/fire-safety/cekpoin-security' },
            { title: 'Data APAR', href: '/fire-safety/apar' },
            { title: 'Data Hydrant', href: '/fire-safety/hydrant' },
        ],
    },
    {
        title: 'Reports',
        icon: FileText,
        items: [
            { title: 'Laporan Rekap APAR', href: '/reports/apar-rekap' },
            { title: 'Laporan Rekap Hydrant', href: '/reports/hydrant-rekap' },
            { title: 'Laporan Rekap Cekpoint', href: '/reports/cekpoint-rekap' },
        ],
    },
];

export function MobileHeader() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            <header className="mobile-header">
                <div className="flex items-center gap-2.5">
                    <div className="neu-icon flex size-7 items-center justify-center">
                        <ShieldCheck className="size-3.5 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-foreground">OptiPatrol</span>
                </div>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="flex size-9 items-center justify-center rounded-xl bg-muted/40 transition-colors active:bg-muted/60"
                >
                    <Menu className="size-5 text-foreground/70" />
                </button>
            </header>

            {/* Sidebar Drawer */}
            {drawerOpen && (
                <div className="mobile-drawer-overlay" onClick={() => setDrawerOpen(false)}>
                    <div
                        className="mobile-drawer"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Drawer Header */}
                        <div className="flex items-center gap-3 px-5 py-5">
                            <div className="neu-icon flex size-8 items-center justify-center">
                                <ShieldCheck className="size-4 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-sm font-bold text-foreground">Menu</h2>
                                <p className="text-[0.65rem] text-muted-foreground/50">Navigasi Lengkap</p>
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="flex size-8 items-center justify-center rounded-full bg-muted/50"
                            >
                                <X className="size-4 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto px-4 pb-8">
                            {drawerSections.map((section, i) => {
                                const SectionIcon = section.icon;
                                const hasActive = section.items.some((item) => isCurrentUrl(item.href));

                                return (
                                    <div key={section.title} className={cn('mb-4', i > 0 && 'mt-2')}>
                                        <div className="flex items-center gap-2 px-2 py-2">
                                            <SectionIcon className={cn(
                                                'size-4',
                                                hasActive ? 'text-primary' : 'text-muted-foreground/40',
                                            )} />
                                            <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-muted-foreground/45">
                                                {section.title}
                                            </span>
                                        </div>
                                        <div className="mobile-drawer-section">
                                            {section.items.map((item) => (
                                                <Link
                                                    key={item.href}
                                                    href={item.href}
                                                    prefetch
                                                    onClick={() => setDrawerOpen(false)}
                                                    className={cn(
                                                        'mobile-drawer-item',
                                                        isCurrentUrl(item.href) && 'mobile-drawer-item-active',
                                                    )}
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
