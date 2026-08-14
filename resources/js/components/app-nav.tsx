import { Link, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const navGroups: NavItem[] = [
    { title: 'Dashboard', href: dashboard() },
    {
        title: 'Role Management',
        items: [
            { title: 'Permission List', href: '/role-management/permission-list' },
            { title: 'Role List', href: '/role-management/role-list' },
        ],
    },
    {
        title: 'Data Master',
        items: [
            { title: 'Data Pengguna', href: '/master-data/pengguna' },
            { title: 'Data Departemen', href: '/master-data/departemen' },
            { title: 'Data Jabatan', href: '/master-data/jabatan' },
            { title: 'Data Unit Bisnis', href: '/master-data/unit-bisnis' },
            { title: 'Data Karyawan', href: '/master-data/karyawan' },
        ],
    },
    {
        title: 'Fire Safety',
        items: [
            { title: 'Data CP Security', href: '/fire-safety/cekpoin-security' },
            { title: 'Data APAR', href: '/fire-safety/apar' },
            { title: 'Data Hydrant', href: '/fire-safety/hydrant' },
        ],
    },
    {
        title: 'Inspeksi',
        items: [
            { title: 'Inspeksi APAR', href: '/inspection/apar' },
            { title: 'Inspeksi Hydrant', href: '/inspection/hydrant' },
            { title: 'Inspeksi Cekpoint', href: '/inspection/cekpoint-security' },
        ],
    },
    {
        title: 'Reports',
        items: [
            { title: 'Laporan Rekap APAR', href: '/reports/apar-rekap' },
            { title: 'Laporan Rekap Hydrant', href: '/reports/hydrant-rekap' },
            { title: 'Laporan Rekap Cekpoint', href: '/reports/cekpoint-rekap' },
        ],
    },
];

function DropdownNav({ item }: { item: NavItem }) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { isCurrentUrl } = useCurrentUrl();

    const isActive = item.items?.some((child) => child.href && isCurrentUrl(child.href));

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className={cn(
                    'neu-nav-item flex items-center gap-1.5 text-sm font-medium',
                    isActive && 'neu-nav-active',
                )}
            >
                {item.title}
                <ChevronDown className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')} />
            </button>
            {open && (
                <div className="neu-dropdown absolute left-0 top-full z-50 mt-2 w-56 py-1.5">
                    {item.items?.map((child) => (
                        <Link
                            key={child.title}
                            href={child.href ?? '#'}
                            prefetch
                            onClick={() => setOpen(false)}
                            className={cn(
                                'neu-dropdown-item',
                                child.href && isCurrentUrl(child.href) && 'neu-dropdown-active',
                            )}
                        >
                            {child.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function AppNav() {
    return (
        <nav className="glass-nav sticky top-0 z-40 hidden lg:block">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
                <AppLogo />

                <div className="hidden items-center gap-1 lg:flex">
                    {navGroups.map((item) =>
                        item.items ? (
                            <DropdownNav key={item.title} item={item} />
                        ) : (
                            <Link
                                key={item.title}
                                href={item.href ?? '#'}
                                prefetch
                                className={cn(
                                    'neu-nav-item text-sm font-medium',
                                    item.href && useCurrentUrl().isCurrentUrl(item.href) && 'neu-nav-active',
                                )}
                            >
                                {item.title}
                            </Link>
                        ),
                    )}
                </div>

                <NavUser />
            </div>
        </nav>
    );
}
