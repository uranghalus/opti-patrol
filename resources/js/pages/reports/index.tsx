import { Head, Link } from '@inertiajs/react';
import { FileText, Flame, Droplets, ClipboardCheck } from 'lucide-react';

const reportTypes = [
    {
        title: 'Laporan Rekap APAR',
        description: 'Ringkasan hasil inspeksi alat pemadam api ringan',
        href: '/reports/apar-rekap',
        icon: Flame,
        iconBg: 'bg-red-500/10',
    },
    {
        title: 'Laporan Rekap Hydrant',
        description: 'Ringkasan hasil inspeksi hydrant',
        href: '/reports/hydrant-rekap',
        icon: Droplets,
        iconBg: 'bg-blue-500/10',
    },
    {
        title: 'Laporan Rekap Cekpoint',
        description: 'Ringkasan hasil patroli checkpoint',
        href: '/reports/cekpoint-rekap',
        icon: ClipboardCheck,
        iconBg: 'bg-emerald-500/10',
    },
];

export default function Reports() {
    return (
        <>
            <Head title="Laporan" />

            <div className="mb-5">
                <h1 className="text-lg font-bold text-foreground mb-0.5">Laporan</h1>
                <p className="text-sm text-muted-foreground/50">Akses laporan rekap inspeksi</p>
            </div>

            <div className="space-y-3">
                {reportTypes.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            prefetch
                            className="insp-menu-card group"
                        >
                            <div className={`insp-menu-icon ${item.iconBg}`}>
                                <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-foreground mb-0.5">{item.title}</h3>
                                <p className="text-xs text-muted-foreground/50">{item.description}</p>
                            </div>
                            <svg className="size-4 text-muted-foreground/25 group-hover:text-muted-foreground/50 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M9 18l6-6-6-6" />
                            </svg>
                        </Link>
                    );
                })}
            </div>
        </>
    );
}

Reports.layout = {
    breadcrumbs: [
        { title: 'Laporan', href: '/reports' },
    ],
};
