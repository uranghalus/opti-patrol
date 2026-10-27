import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import {
    Scan as ScanIcon,
    ShieldCheck as ShieldIcon,
    Activity as ActivityIcon,
    AlertTriangle as AlertIcon,
    Users as UsersIcon,
    Building2 as BuildingIcon,
} from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { cn } from '@/lib/utils';

type InspectionItem = {
    id: number | string;
    kode_apar?: string | null;
    apar?: {
        kode_apar?: string | null;
        lokasi?: string | null;
        jenis?: string | null;
    } | null;
    kondisi?: string | null;
    tanggal_inspeksi?: string | null;
};

type GrafikPoint = {
    bulan: string;
    apar: number;
    hydrant: number;
};

type PageProps = {
    totalApar: number;
    totalHydrant: number;
    totalAparExpired: number;
    totalInspeksiApar: number;
    dataGrafikInspeksi: GrafikPoint[];
    aparBermasalah: InspectionItem[];
};

function getRole(
    user: Record<string, unknown> | undefined,
): string | undefined {
    if (!user) return undefined;
    return (user.role ?? user.peran ?? user.role_name) as string | undefined;
}

function ComplianceCard({ value, label }: { value: number; label: string }) {
    return (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[#0a2540]">
                    Kepatuhan Inspeksi Hari Ini
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3">
                    <span
                        className="text-3xl font-bold text-[#005377]"
                        aria-label={`Kepatuhan ${value} persen`}
                    >
                        {value}%
                    </span>
                    <div
                        className="h-1 w-full flex-1 overflow-hidden rounded-full bg-[#e5edf5]"
                        role="progressbar"
                        aria-valuenow={Math.min(value, 100)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Kepatuhan ${value} persen`}
                    >
                        <div
                            className="h-full bg-[#005377]"
                            style={{ width: Math.min(value, 100) + '%' }}
                        />
                    </div>
                </div>
                <p className="mt-2 text-[11px] font-medium text-[#007994]/70">
                    Terdapat aset yang belum diinspeksi hari ini.
                </p>
            </CardContent>
        </Card>
    );
}

function EmptyState({
    title,
    message,
    icon: Icon,
    color = '#32C292',
}: {
    title: string;
    message: string;
    icon: React.ElementType;
    color?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                className={`bg-[${color}]/10 text-[${color}]`}
            >
                <Icon className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-[#0a2540]">{title}</h3>
            <p className="text-[12px] text-[#007994]/60">{message}</p>
        </div>
    );
}

export default function Dashboard({
    totalApar,
    totalHydrant,
    totalAparExpired,
    totalInspeksiApar,
    dataGrafikInspeksi,
    aparBermasalah,
}: PageProps) {
    const page = usePage();
    const user = (page.props as { auth?: { user?: Record<string, unknown> } })
        .auth?.user;
    const role = getRole(user);
    const isPetugas = role === 'Petugas' || role === 'Inspector';
    const isSuperAdmin = role === 'Super Administrator';

    const totalAset = totalApar + totalHydrant;
    const compliancePct =
        totalAset > 0 ? Math.round((totalInspeksiApar / totalAset) * 100) : 0;

    const expiredItems = aparBermasalah
        .filter((i) => i.kondisi && !/baik/i.test(i.kondisi))
        .map((i) => ({
            id: i.id,
            kode: i.apar?.kode_apar ?? i.kode_apar ?? '-',
            lokasi: i.apar?.lokasi ?? '-',
            status: 'perlu_perhatian',
            tanggal: i.tanggal_inspeksi ?? undefined,
        }));

    const blindSpotItems = aparBermasalah.map((i) => ({
        id: i.id,
        kode: i.apar?.kode_apar ?? i.kode_apar ?? '-',
        lokasi: i.apar?.lokasi ?? '-',
        jenis: i.apar?.jenis ?? undefined,
    }));

    const header = (
        <section className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#005377]/10 shadow-sm">
                    <ShieldIcon className="size-5 text-[#005377]" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-[#0a2540]">
                        Selamat datang, {user?.name ?? 'Petugas'}
                    </h1>
                    <p className="text-[12px] font-medium text-[#007994]/60">
                        {new Date().toLocaleDateString('id-ID', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </p>
                </div>
            </div>
            <p className="mt-1 text-[13px] text-[#007994]/60">
                Pantau status inspeksi aset dan mulai pemindaian QR Code dari
                sini.
            </p>
        </section>
    );

    const metricRow = (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
                title="Total APAR"
                value={totalApar}
                icon={ShieldIcon}
                color="#005377"
            />
            <StatCard
                title="Total Hydrant"
                value={totalHydrant}
                icon={BuildingIcon}
                color="#007994"
            />
            <StatCard
                title="APAR Kadaluarsa"
                value={totalAparExpired}
                icon={AlertIcon}
                color="#F9F871"
                trend={{ label: `${totalAparExpired} aset`, type: 'paused' }}
            />
            <StatCard
                title="Inspeksi Bulan Ini"
                value={totalInspeksiApar}
                icon={ActivityIcon}
                color="#32C292"
                trend={{ label: `${totalInspeksiApar} diperiksa`, type: 'up' }}
            />
        </div>
    );

    const scanSection = (
        <section className="mt-4">
            <Link href="/inspection" asChild prefetch>
                <Button className="h-12 w-full justify-center gap-2 rounded-[12px] bg-[#005377] text-base font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#007994] hover:shadow-md active:scale-[0.98]">
                    <ScanIcon className="size-5" />
                    Scan QR Sekarang
                </Button>
            </Link>
            <p className="mt-1 text-center text-[12px] text-[#007994]/60">
                Mulai pemindaian QR Code APAR, Hydrant, atau Checkpoint
            </p>
        </section>
    );

    const alertSection = (
        <section className="space-y-4">
            <div
                className={cn(
                    'flex items-start gap-3 rounded-lg border p-4 shadow-sm',
                    expiredItems.length > 0
                        ? 'border-[#F9F871]/40 bg-[#F9F871]/5'
                        : 'border-[#32C292]/40 bg-[#32C292]/5',
                )}
            >
                <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                    className={cn(
                        expiredItems.length > 0
                            ? 'bg-[#F9F871]/20 text-[#F9F871]'
                            : 'bg-[#32C292]/20 text-[#32C292]',
                    )}
                >
                    <AlertIcon className="size-4" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#0a2540]">
                        APAR Perlu Perhatian
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[#007994]/70">
                        {expiredItems.length === 0
                            ? 'Tidak ada APAR yang mendekati kadaluarsa.'
                            : `${expiredItems.length} aset membutuhkan tindakan segera.`}
                    </p>
                </div>
            </div>
        </section>
    );

    const blindSpotSection = (
        <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-[#0a2540]">
                    Aset Belum Diinspeksi (Blind Spot)
                </CardTitle>
            </CardHeader>
            <CardContent>
                {blindSpotItems.length === 0 ? (
                    <EmptyState
                        title="Semua aset telah diinspeksi."
                        message="Tidak ada blind spot saat ini."
                        icon={ScanIcon}
                        color="#32C292"
                    />
                ) : (
                    <div className="space-y-2">
                        {blindSpotItems.map((item) => (
                            <Link
                                key={item.id}
                                href={`/inspection/apar/${item.id}`}
                                prefetch
                                className="flex items-center justify-between gap-3 rounded-md border-b border-[#e5edf5]/20 px-3 py-2.5 text-sm transition-colors last:border-0 hover:bg-[#e5edf5]/40"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="truncate font-medium text-[#0a2540]">
                                        {item.kode}
                                    </div>
                                    <div className="truncate text-[11px] text-[#007994]">
                                        {item.lokasi}
                                    </div>
                                </div>
                                <ScanIcon className="size-4 text-[#007994]/60" />
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto p-4 pt-24">
                {header}

                {isPetugas ? (
                    <>
                        {/* Alerts-first untuk Petugas */}
                        {alertSection}
                        {blindSpotSection}
                        {metricRow}
                        {scanSection}
                    </>
                ) : (
                    <>
                        {/* Compliance-first untuk Supervisor / GM / Super Admin */}
                        <ComplianceCard
                            value={compliancePct}
                            label="Terdapat aset yang belum diinspeksi hari ini"
                        />
                        {scanSection}
                        {alertSection}
                        {blindSpotSection}
                        {metricRow}
                    </>
                )}

                {isSuperAdmin && (
                    <section className="mt-4 grid gap-3 md:grid-cols-2">
                        <Link
                            href="/master-data/pengguna"
                            prefetch
                            className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#e5edf5]/60 bg-white p-4 shadow-sm transition-colors hover:border-[#32C292]/40 hover:bg-[#97E17E]/10"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#97E17E]/20">
                                <UsersIcon className="size-5 text-[#32C292]" />
                            </div>
                            <span className="text-sm font-bold text-[#0a2540]">
                                Manajemen Pengguna
                            </span>
                        </Link>
                        <Link
                            href="/fire-safety/apar"
                            prefetch
                            className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-[#e5edf5]/60 bg-white p-4 shadow-sm transition-colors hover:border-[#F9F871]/50 hover:bg-[#F9F871]/20"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#F9F871]/20">
                                <BuildingIcon className="size-5 text-[#F9F871]" />
                            </div>
                            <span className="text-sm font-bold text-[#0a2540]">
                                Data Master APAR
                            </span>
                        </Link>
                    </section>
                )}
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
