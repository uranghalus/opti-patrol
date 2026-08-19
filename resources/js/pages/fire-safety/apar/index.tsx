import { Head } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import { Plus, Search, Filter, Download, QrCode, Printer, X, Flame, MapPin, Layers, UserRound } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { HasAnyPermission } from '@/lib/permission';
import type { Apar } from '@/types';

interface Props {
    apar: {
        data: Apar[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        jenis?: string;
        lantai?: string;
        size?: string;
    };
    filterOptions: {
        jenis: string[];
        sizes: number[];
    };
}

const JENIS = ['CO2', 'Powder', 'Foam', 'Air'];
const LANTAI = ['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4', 'Lantai 5', 'Basement', 'Roof'];

const getJenisColor = (j: string) => {
    switch (j) {
        case 'CO2':
            return 'bg-red-500/10 text-red-600 ring-1 ring-red-500/20';
        case 'Powder':
            return 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20';
        case 'Foam':
            return 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20';
        case 'Air':
            return 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20';
        default:
            return 'bg-muted text-muted-foreground ring-1 ring-border';
    }
};

export default function AparIndex({ apar, filters, filterOptions }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [lantai, setLantai] = useState(filters.lantai || '');
    const [size, setSize] = useState(filters.size || '');

    // Bulk-print (cetak QR massal) toolbar state
    const [lantaiList, setLantaiList] = useState<string[]>([]);
    const [batchCount, setBatchCount] = useState(1);
    const [selectedLantai, setSelectedLantai] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('1');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (jenis) params.set('jenis', jenis);
        if (lantai) params.set('lantai', lantai);
        if (size) params.set('size', size);

        startTransition(() => {
            router.get(`/fire-safety/apar?${params.toString()}`, { preserveScroll: true });
        });
    };

    const clearFilters = () => {
        setSearch('');
        setJenis('');
        setLantai('');
        setSize('');
        startTransition(() => {
            router.get('/fire-safety/apar', { preserveScroll: true });
        });
    };

    const hasActiveFilters = search || jenis || lantai || size;

    const handleMassPrint = () => {
        const params = new URLSearchParams();
        if (selectedLantai) params.set('lantai', selectedLantai);
        params.set('batch', selectedBatch);
        window.open(`/fire-safety/apar/generate-mass-qr?${params.toString()}`, '_blank');
    };

    useEffect(() => {
        fetch('/fire-safety/apar/filter-options')
            .then((res) => res.json())
            .then((data) => {
                setLantaiList(data.lantai ?? []);
                setBatchCount(data.totalBatch ?? 1);
            })
            .catch(() => {});
    }, []);

    const handleDelete = (id: number, kodeApar: string) => {
        if (confirm(`Hapus APAR ${kodeApar}?`)) {
            router.delete(`/fire-safety/apar/${id}`, { preserveScroll: true });
        }
    };

    // Hero "climate dial" — ambient fill (72%) with live total in the centre.
    const dialFill = 72;
    const dialCirc = 2 * Math.PI * 15.5;

    return (
        <>
            <Head title="Data APAR" />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* ── Hero (glass, floating) ── */}
                <section className="glass-panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-5">
                            <div className="neu-dial relative grid h-20 w-20 shrink-0 place-items-center rounded-full">
                                <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(195,204,212,0.55)" strokeWidth="3" />
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.5"
                                        fill="none"
                                        stroke="#4db8e8"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(dialFill / 100) * dialCirc} ${dialCirc}`}
                                    />
                                </svg>
                                <span className="text-xl font-bold text-foreground">{apar.total}</span>
                            </div>
                            <div>
                                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    <Flame className="size-6 text-primary" />
                                    Data APAR
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground/70">
                                    Alat Pemadam Api Ringan &middot; {apar.data.length} unit di halaman ini
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {HasAnyPermission(['apar.create']) && (
                                <Link href="/fire-safety/apar/upload-excel" className="hidden sm:inline-flex">
                                    <Button variant="ghost" className="neu-btn">
                                        <Download className="size-4" />
                                        Import Excel
                                    </Button>
                                </Link>
                            )}
                            {HasAnyPermission(['apar.create']) && (
                                <Link href="/fire-safety/apar/create">
                                    <Button className="gap-2 btn-soft-primary active:scale-[0.98]">
                                        <Plus className="size-4" />
                                        Tambah APAR
                                    </Button>
                                </Link>
                            )}
                            <Button
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                variant="ghost"
                                className="neu-btn hover:!border-destructive/50 hover:!bg-destructive/5"
                            >
                                <X className="size-4" />
                                Reset
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ── Bulk-print toolbar (cetak QR massal) ── */}
                <section className="glass-panel px-5 py-4 sm:px-6 animate-in fade-in slide-in-from-y-4 duration-400 delay-75">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">Cetak QR Code Massal</h2>
                            <p className="text-xs text-muted-foreground/70">
                                Pilih lantai &amp; batch, lalu cetak label QR APAR.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={selectedLantai} onValueChange={setSelectedLantai}>
                                <SelectTrigger className="w-[180px] neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                    <SelectValue placeholder="Semua Lantai" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="" className="neu-dropdown-item">Semua Lantai</SelectItem>
                                    {lantaiList.map((l) => (
                                        <SelectItem key={l} value={l} className="neu-dropdown-item">{l}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                                <SelectTrigger className="w-[130px] neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                    <SelectValue placeholder="Batch" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    {Array.from({ length: batchCount }, (_, i) => (
                                        <SelectItem key={i} value={`${i + 1}`} className="neu-dropdown-item">Batch {i + 1}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {HasAnyPermission(['apar.generate-qr']) && (
                                <Button onClick={handleMassPrint} className="gap-2 btn-soft-primary active:scale-[0.98]">
                                    <Printer className="size-4" />
                                    Cetak QR Code
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Stat strip (neumorphic) ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                        { label: 'Total Unit', value: apar.total, icon: Flame },
                        { label: 'Ditampilkan', value: apar.data.length, icon: Layers },
                        { label: 'Halaman', value: `${apar.current_page}/${apar.last_page}`, icon: MapPin },
                    ].map((s) => (
                        <div key={s.label} className="neu-card flex items-center gap-3 rounded-2xl p-4">
                            <div className="neu-icon grid h-10 w-10 place-items-center rounded-xl text-white">
                                <s.icon className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
                                <p className="text-lg font-bold text-foreground">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Filters (glass, floats above) ── */}
                <Card className="neu-card animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Filter &amp; Pencarian</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 neu-dropdown-item"
                                onClick={() => setShowFilters(!showFilters)}
                                aria-label="Toggle filters"
                            >
                                <Filter className="size-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className={cn('pt-0', showFilters ? '' : 'hidden')}>
                        <form onSubmit={handleSearch} className="space-y-4 animate-in fade-in slide-in-from-y-2 duration-300">
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                                <div className="relative sm:col-span-2">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                    <Input
                                        placeholder="Cari kode, lokasi, lantai..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 neu-card border-border/50 bg-white/50 focus:border-primary/50"
                                    />
                                </div>
                                <div>
                                    <Select value={jenis} onValueChange={setJenis}>
                                        <SelectTrigger className="w-full neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                            <SelectValue placeholder="Jenis" />
                                        </SelectTrigger>
                                        <SelectContent className="neu-dropdown">
                                            <SelectItem value="">Semua Jenis</SelectItem>
                                            {(filterOptions.jenis.length ? filterOptions.jenis : JENIS).map((j) => (
                                                <SelectItem key={j} value={j} className="neu-dropdown-item">{j}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select value={lantai} onValueChange={setLantai}>
                                        <SelectTrigger className="w-full neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                            <SelectValue placeholder="Lantai" />
                                        </SelectTrigger>
                                        <SelectContent className="neu-dropdown">
                                            <SelectItem value="">Semua Lantai</SelectItem>
                                            {LANTAI.map((l) => (
                                                <SelectItem key={l} value={l} className="neu-dropdown-item">{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select value={size} onValueChange={setSize}>
                                        <SelectTrigger className="w-full neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                            <SelectValue placeholder="Ukuran" />
                                        </SelectTrigger>
                                        <SelectContent className="neu-dropdown">
                                            <SelectItem value="">Semua Ukuran</SelectItem>
                                            {filterOptions.sizes.map((s) => (
                                                <SelectItem key={s} value={s.toString()} className="neu-dropdown-item">{s} kg</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-center gap-2 lg:col-span-1">
                                    <Button
                                        type="submit"
                                        className="flex-1 gap-2 btn-soft-primary active:scale-[0.98]"
                                    >
                                        <Search className="size-4" />
                                        Cari
                                    </Button>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <Button type="button" variant="ghost" className="gap-1 text-destructive hover:text-destructive/80" onClick={clearFilters}>
                                    <X className="size-3.5" />
                                    Reset semua filter
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* ── Results info ── */}
                <div className="flex items-center justify-between text-sm text-muted-foreground animate-in fade-in duration-300">
                    <p>
                        {apar.from !== null && apar.to !== null ? (
                            <>Menampilkan <span className="font-semibold text-foreground">{apar.from}</span> -{' '}
                            <span className="font-semibold text-foreground">{apar.to}</span> dari{' '}
                            <span className="font-semibold text-foreground">{apar.total}</span> data</>
                        ) : (
                            <>Tidak ada data</>
                        )}
                    </p>
                    {isPending && (
                        <span className="flex items-center gap-1.5 text-primary text-sm">
                            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                            Memuat...
                        </span>
                    )}
                </div>

                {/* ── APAR grid (neumorphic widget cards) ── */}
                {apar.data.length === 0 ? (
                    <Card className="neu-card animate-in fade-in">
                        <div className="flex flex-col items-center gap-2 py-16 text-center text-muted-foreground/50">
                            <svg className="size-14 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">Tidak ada data APAR</p>
                            {hasActiveFilters && <p className="text-xs">Coba reset filter atau ubah pencarian</p>}
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {apar.data.map((item, index) => (
                            <article
                                key={item.id}
                                className="neu-card group relative flex flex-col gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_24px_rgba(195,204,212,0.5),-8px_-8px_24px_rgba(255,255,255,0.85)] animate-in fade-in slide-in-from-y-3 duration-300"
                                style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Kode</p>
                                        <p className="font-mono text-base font-semibold text-foreground">{item.kode_apar}</p>
                                    </div>
                                    <Badge className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', getJenisColor(item.jenis))}>
                                        {item.jenis}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="neu-well p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Ukuran</p>
                                        <p className="font-mono text-sm font-semibold text-foreground">{item.size} kg</p>
                                    </div>
                                    <div className="neu-well p-3">
                                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Lantai</p>
                                        <p className="truncate text-sm font-semibold text-foreground">{item.lantai ?? '-'}</p>
                                    </div>
                                </div>

                                <div className="neu-well flex items-start gap-2 p-3">
                                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
                                    <p className="text-sm text-foreground/80">{item.lokasi}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/50 pt-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <UserRound className="size-4 text-muted-foreground/60" />
                                        <span className="max-w-[110px] truncate">
                                            {item.user?.name ?? <span className="text-muted-foreground/40">-</span>}
                                        </span>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 neu-dropdown-item">
                                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="19" cy="12" r="1" />
                                                    <circle cx="5" cy="12" r="1" />
                                                </svg>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-48 neu-dropdown">
                                            {HasAnyPermission(['apar.edit']) && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/fire-safety/apar/${item.id}/edit`} className="neu-dropdown-item">
                                                        <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 3z" />
                                                        </svg>
                                                        Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            {HasAnyPermission(['apar.generate-qr']) && (
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/fire-safety/apar/${item.id}/generate-qr`} target="_blank" className="neu-dropdown-item">
                                                        <QrCode className="mr-2 size-4" />
                                                        QR Code
                                                    </Link>
                                                </DropdownMenuItem>
                                            )}
                                            {HasAnyPermission(['apar.delete']) && (
                                                <>
                                                    <DropdownMenuSeparator className="border-border/50 my-1" />
                                                    <DropdownMenuItem
                                                        className="neu-dropdown-item text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(item.id, item.kode_apar)}
                                                    >
                                                        <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                            <polyline points="3 6 5 6 21 6" />
                                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                        </svg>
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {apar.last_page > 1 && (
                    <Card className="neu-card animate-in fade-in">
                        <div className="p-4">
                            <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
                                {apar.current_page > 1 && (
                                    <a
                                        href={apar.links.find((l) => l.label === 'Previous')?.url ?? '#'}
                                        className="insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5"
                                        aria-label="Previous page"
                                    >
                                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                    </a>
                                )}
                                {apar.links.map((link) =>
                                    link.url ? (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            className={cn(
                                                'insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5',
                                                link.active && 'insp-pagination-btn-active bg-primary text-primary-foreground border-primary',
                                            )}
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <span key={link.label} className="insp-pagination-btn neu-card opacity-50 cursor-not-allowed border-border/50">
                                            {link.label}
                                        </span>
                                    ),
                                )}
                                {apar.current_page < apar.last_page && (
                                    <a
                                        href={apar.links.find((l) => l.label === 'Next')?.url ?? '#'}
                                        className="insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5"
                                        aria-label="Next page"
                                    >
                                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </a>
                                )}
                            </nav>
                        </div>
                    </Card>
                )}
            </div>
        </>
    );
}
