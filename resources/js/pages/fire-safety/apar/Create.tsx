import { Head } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    Circle,
    Droplets,
    Info,
    MapPin,
    Save,
    Snowflake,
    Sparkles,
    User,
    Waves,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { aparJenisApar, aparSizes } from '@/types';

interface Props {
    users: { id: number; name: string }[];
}

type JenisKey = (typeof aparJenisApar)[number];

const jenisMeta: Record<
    JenisKey,
    { desc: string; badge: string; Icon: ComponentType<{ className?: string }> }
> = {
    CO2: {
        desc: 'Gas CO₂ — aman untuk kebakaran listrik & alat elektronik.',
        badge: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
        Icon: Snowflake,
    },
    Powder: {
        desc: 'Serbuk ABC — serbaguna untuk padat, cair, & listrik.',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
        Icon: Sparkles,
    },
    Foam: {
        desc: 'Busa — untuk kebakaran cairan seperti minyak & bensin.',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
        Icon: Droplets,
    },
    Air: {
        desc: 'Air — untuk kebakaran padat seperti kertas & kayu.',
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
        Icon: Waves,
    },
};

function InfoTip({ text }: { text: string }) {
    return (
        <span className="info-tip group relative inline-flex align-middle">
            <Info className="size-3.5 text-muted-foreground/60 transition-colors group-hover:text-primary" />
            <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-xl neu-dropdown px-3 py-2 text-xs font-normal leading-relaxed text-foreground opacity-0 shadow-xl transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                {text}
            </span>
        </span>
    );
}

export default function AparCreate({ users }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        kode_apar: '',
        lokasi: '',
        lantai: '',
        jenis: 'CO2' as JenisKey,
        size: '2',
        user_id: '',
    });

    const [showErrors, setShowErrors] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);
        post('/fire-safety/apar', {
            onSuccess: () => {
                reset();
                setShowErrors(false);
            },
            onError: (errs) => console.log('Errors:', errs),
        });
    };

    const meta = jenisMeta[data.jenis];
    const picName = users.find((u) => u.id.toString() === data.user_id)?.name ?? '—';

    const required = [
        { label: 'Kode APAR', ok: data.kode_apar.trim() !== '' },
        { label: 'Jenis', ok: true },
        { label: 'Ukuran', ok: true },
        { label: 'Lokasi', ok: data.lokasi.trim() !== '' },
    ];
    const doneCount = required.filter((r) => r.ok).length;

    return (
        <>
            <Head title="Tambah APAR" />

            <div className="animate-in fade-in slide-in-from-y-4 duration-400 space-y-6">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/fire-safety/apar"
                            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Kembali ke daftar
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Tambah APAR Baru
                        </h1>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Isi data alat pemadam api ringan. Tag preview di samping akan
                            mengikutinya secara langsung.
                        </p>
                    </div>
                </header>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="lg:col-span-2">
                        <div className="space-y-6">
                            <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400">
                                <CardHeader>
                                    <CardTitle className="text-lg">Informasi APAR</CardTitle>
                                    <CardDescription>
                                        Data dasar yang mengidentifikasi APAR ini.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="kode_apar" className="flex items-center gap-1.5">
                                                Kode APAR <span className="text-red-500">*</span>
                                                <InfoTip text="Kode unik untuk mengenali APAR ini. Contoh: APAR-001, APAR-LT2-03." />
                                            </Label>
                                            <Input
                                                id="kode_apar"
                                                value={data.kode_apar}
                                                onChange={(e) => setData('kode_apar', e.target.value)}
                                                placeholder="Contoh: APAR-001"
                                                maxLength={25}
                                                aria-invalid={showErrors && !!errors.kode_apar}
                                                className={cn(
                                                    'rounded-[10px] neu-card border-border/50 focus:border-primary/50',
                                                    showErrors && errors.kode_apar && 'border-destructive focus-visible:ring-destructive',
                                                )}
                                            />
                                            {showErrors && errors.kode_apar && (
                                                <p className="text-sm text-destructive" role="alert">{errors.kode_apar}</p>
                                            )}
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="jenis" className="flex items-center gap-1.5">
                                                Jenis <span className="text-red-500">*</span>
                                                <InfoTip text="Jenis media pemadam. Pilih yang sesuai dengan risiko di lokasi." />
                                            </Label>
                                            <Select
                                                value={data.jenis}
                                                onValueChange={(value) => setData('jenis', value as JenisKey)}
                                            >
                                                <SelectTrigger className="rounded-[10px] neu-card border-border/50 focus:border-primary/50">
                                                    <SelectValue placeholder="Pilih jenis APAR" />
                                                </SelectTrigger>
                                                <SelectContent className="neu-dropdown">
                                                    {aparJenisApar.map((jenis) => (
                                                        <SelectItem key={jenis} value={jenis} className="neu-dropdown-item">{jenis}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-muted-foreground">{meta.desc}</p>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="size" className="flex items-center gap-1.5">
                                                Ukuran (kg) <span className="text-red-500">*</span>
                                                <InfoTip text="Berat isi alat pemadam dalam kilogram (kg)." />
                                            </Label>
                                            <Select
                                                value={data.size}
                                                onValueChange={(value) => setData('size', value)}
                                            >
                                                <SelectTrigger className="rounded-[10px] neu-card border-border/50 focus:border-primary/50">
                                                    <SelectValue placeholder="Pilih ukuran" />
                                                </SelectTrigger>
                                                <SelectContent className="neu-dropdown">
                                                    {aparSizes.map((size) => (
                                                        <SelectItem key={size} value={size.toString()} className="neu-dropdown-item">{size} kg</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="lantai">
                                                Lantai
                                                <span className="ml-1 text-xs font-normal text-muted-foreground">(opsional)</span>
                                            </Label>
                                            <Input
                                                id="lantai"
                                                value={data.lantai}
                                                onChange={(e) => setData('lantai', e.target.value)}
                                                placeholder="Contoh: Lantai 1, Basement, Roof"
                                                className="rounded-[10px] neu-card border-border/50 focus:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label htmlFor="lokasi" className="flex items-center gap-1.5">
                                            Lokasi <span className="text-red-500">*</span>
                                            <InfoTip text="Penempatan detail APAR, mis. Ruang Server, Area Parkir Utara." />
                                        </Label>
                                        <Input
                                            id="lokasi"
                                            value={data.lokasi}
                                            onChange={(e) => setData('lokasi', e.target.value)}
                                            placeholder="Contoh: Ruang Server, Area Parkir"
                                            aria-invalid={showErrors && !!errors.lokasi}
                                            className={cn(
                                                'rounded-[10px] neu-card border-border/50 focus:border-primary/50',
                                                showErrors && errors.lokasi && 'border-destructive focus-visible:ring-destructive',
                                            )}
                                        />
                                        {showErrors && errors.lokasi && (
                                            <p className="text-sm text-destructive" role="alert">{errors.lokasi}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                                <CardHeader>
                                    <CardTitle className="text-lg">Penanggung Jawab</CardTitle>
                                    <CardDescription>
                                        Petugas yang memantau APAR ini (opsional).
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="user_id">PIC / Penanggung Jawab</Label>
                                        <Select
                                            value={data.user_id}
                                            onValueChange={(value) => setData('user_id', value)}
                                        >
                                            <SelectTrigger className="rounded-[10px] neu-card border-border/50 focus:border-primary/50">
                                                <SelectValue placeholder="Pilih penanggung jawab (opsional)" />
                                            </SelectTrigger>
                                            <SelectContent className="neu-dropdown">
                                                <SelectItem value="">-- Tidak ada / Umum --</SelectItem>
                                                {users.map((user) => (
                                                    <SelectItem key={user.id} value={user.id.toString()} className="neu-dropdown-item">{user.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {showErrors && errors.user_id && (
                                            <p className="text-sm text-destructive" role="alert">{errors.user_id}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex flex-col-reverse gap-3 border-t border-border/50 pt-5 sm:flex-row sm:justify-end">
                                <Link href="/fire-safety/apar">
                                    <Button type="button" variant="outline" className="w-full rounded-[10px] neu-card border-border/50 hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-200 sm:w-auto">
                                        <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M19 12H5" />
                                            <path d="M12 19l-7-7 7-7" />
                                        </svg>
                                        Batal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-[10px] px-6 font-semibold btn-soft-primary active:scale-[0.98] sm:w-auto"
                                >
                                    <Save className="size-4" />
                                    {processing ? 'Menyimpan...' : 'Simpan APAR'}
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Live preview */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <div className="preview-stage animate-in fade-in slide-in-from-y-4 duration-400 delay-120 p-4" style={{ animationDelay: '120ms' }}>
                                <div className="neu-card space-y-4 p-5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium uppercase tracking-wider text-foreground/70">
                                            Preview Tag
                                        </span>
                                    </div>

                                    <div className={cn('flex items-center gap-3 rounded-xl px-4 py-3', meta.badge)}>
                                        <meta.Icon className="size-5 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold leading-tight">{data.jenis}</p>
                                            <p className="truncate text-xs opacity-80">{meta.desc}</p>
                                        </div>
                                    </div>

                                    <dl className="space-y-3 text-sm">
                                        <div>
                                            <dt className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                                                Kode APAR
                                            </dt>
                                            <dd className="font-mono text-base font-semibold text-foreground">
                                                {data.kode_apar || '—'}
                                            </dd>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <dt className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Ukuran
                                                </dt>
                                                <dd className="font-medium text-foreground">{data.size} kg</dd>
                                            </div>
                                            <div>
                                                <dt className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Lantai
                                                </dt>
                                                <dd className="font-medium text-foreground">{data.lantai || '—'}</dd>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <svg className="mt-0.5 size-4 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                <circle cx="12" cy="10" r="3" />
                                            </svg>
                                            <div className="min-w-0">
                                                <dt className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                                                    Lokasi
                                                </dt>
                                                <dd className="font-medium text-foreground">{data.lokasi || '—'}</dd>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <User className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0">
                                                <dt className="text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground">
                                                    PIC
                                                </dt>
                                                <dd className="font-medium text-foreground">{picName}</dd>
                                            </div>
                                        </div>
                                    </dl>

                                    <div className="border-t border-border/50 pt-3">
                                        <div className="mb-2 flex items-center justify-between text-xs">
                                            <span className="font-medium text-muted-foreground">Kelengkapan</span>
                                            <span className="font-semibold text-foreground">
                                                {doneCount}/{required.length}
                                            </span>
                                        </div>
                                        <ul className="space-y-1.5">
                                            {required.map((r) => (
                                                <li key={r.label} className="flex items-center gap-2 text-sm">
                                                    {r.ok ? (
                                                        <Check className="size-4 text-emerald-500" />
                                                    ) : (
                                                        <Circle className="size-4 text-muted-foreground/40" />
                                                    )}
                                                    <span className={r.ok ? 'text-foreground' : 'text-muted-foreground'}>
                                                        {r.label}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}