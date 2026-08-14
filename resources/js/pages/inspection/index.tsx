import { Head, Link } from '@inertiajs/react';
import { FireExtinguisher, Droplets, ClipboardCheck } from 'lucide-react';

const inspectionTypes = [
    {
        title: 'Inspeksi APAR',
        description: 'Pemeriksaan alat pemadam api ringan secara berkala',
        href: '/inspection/apar',
        icon: FireExtinguisher,
        color: 'from-red-500/10 to-orange-500/10 text-red-600 dark:text-red-400',
        iconBg: 'bg-red-500/10',
    },
    {
        title: 'Inspeksi Hydrant',
        description: 'Pemeriksaan kelengkapan dan kondisi hydrant',
        href: '/inspection/hydrant',
        icon: Droplets,
        color: 'from-blue-500/10 to-cyan-500/10 text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-500/10',
    },
    {
        title: 'Inspeksi Cekpoint',
        description: 'Patroli dan verifikasi checkpoint keamanan',
        href: '/inspection/cekpoint-security',
        icon: ClipboardCheck,
        color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
        iconBg: 'bg-emerald-500/10',
    },
];

export default function Inspeksi() {
    return (
        <>
            <Head title="Inspeksi" />

            <div className="mb-5">
                <h1 className="text-lg font-bold text-foreground mb-0.5">Inspeksi</h1>
                <p className="text-sm text-muted-foreground/50">Pilih jenis inspeksi yang ingin dilakukan</p>
            </div>

            <div className="space-y-3">
                {inspectionTypes.map((item) => {
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

Inspeksi.layout = {
    breadcrumbs: [
        { title: 'Inspeksi', href: '/inspection' },
    ],
};
