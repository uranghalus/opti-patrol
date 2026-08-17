import { Head } from '@inertiajs/react';
import { Link, usePage, router } from '@inertiajs/react';
import { Plus, Search, Filter, ChevronDown, Download, QrCode, Printer, RefreshCw, X } from 'lucide-react';
import { useState, useTransition } from 'react';
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

export default function AparIndex({ apar, filters, filterOptions }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [isPending, startTransition] = useTransition();

    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [lantai, setLantai] = useState(filters.lantai || '');
    const [size, setSize] = useState(filters.size || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (search) {
            params.set('search', search);
        }

        if (jenis) {
            params.set('jenis', jenis);
        }

        if (lantai) {
            params.set('lantai', lantai);
        }

        if (size) {
            params.set('size', size);
        }

        startTransition(() => {
            router.get(`/fire-safety/apar?${params.toString()}`, {
                preserveScroll: true,
            });
        });
    };

    const clearFilters = () => {
        setSearch('');
        setJenis('');
        setLantai('');
        setSize('');
        startTransition(() => {
            router.get('/fire-safety/apar', {
                preserveScroll: true,
            });
        });
    };

    const hasActiveFilters = search || jenis || lantai || size;

    const handleMassQR = () => {
        router.get('/fire-safety/apar/generate-mass-qr', {
            preserveScroll: true,
        });
    };

    const handleDelete = (id: number, kodeApar: string) => {
        if (confirm(`Hapus APAR ${kodeApar}?`)) {
            router.delete(`/fire-safety/apar/${id}`, {
                preserveScroll: true,
            });
        }
    };

    const getJenisColor = (jenis: string) => {
        switch (jenis) {
            case 'CO2': return 'bg-red-500/10 text-red-600 dark:text-red-400';
            case 'Powder': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
            case 'Foam': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
            case 'Air': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    const renderTableRows = () => {
        if (apar.data.length === 0) {
            return (
                <tr>
                    <td colSpan={8} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                            <svg className="size-12 text-muted-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">Tidak ada data APAR</p>
                            {hasActiveFilters && <p className="text-xs">Coba reset filter atau ubah pencarian</p>}
                        </div>
                    </td>
                </tr>
            );
        }

        return apar.data.map((item, index) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm text-muted-foreground">
                    {(apar.from ?? 0) + index}
                </td>
                <td className="px-4 py-3 font-mono text-sm font-medium">{item.kode_apar}</td>
                <td className="px-4 py-3">
                    <Badge className={getJenisColor(item.jenis)}>{item.jenis}</Badge>
                </td>
                <td className="px-4 py-3 font-mono text-sm">{item.size} kg</td>
                <td className="px-4 py-3 text-sm">{item.lantai ?? '-'}</td>
                <td className="px-4 py-3 text-sm max-w-[300px] truncate">{item.lokasi}</td>
                <td className="px-4 py-3 text-sm">
                    {item.user?.name ? (
                        <span className="truncate block max-w-[90px]">{item.user.name}</span>
                    ) : (
                        <span className="text-muted-foreground/50">-</span>
                    )}
                </td>
                <td className="px-4 py-3 text-right">
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
                            <DropdownMenuItem asChild>
                                <Link href={`/fire-safety/apar/${item.id}/edit`} className="neu-dropdown-item">
                                    <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 3z" />
                                    </svg>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/fire-safety/apar/${item.id}/generate-qr`} target="_blank" className="neu-dropdown-item">
                                    <QrCode className="mr-2 size-4" />
                                    QR Code
                                </Link>
                            </DropdownMenuItem>
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
                        </DropdownMenuContent>
                    </DropdownMenu>
                </td>
            </tr>
        ));
    };

    return (
        <>
            <Head title="Data APAR" />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground tracking-tight">Data APAR</h1>
                        <p className="text-sm text-muted-foreground/50 mt-1">Kelola data APAR (Alat Pemadam Api Ringan)</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                        <Link href="/fire-safety/apar/upload-excel" className="hidden sm:inline-flex">
                            <Button variant="outline" className="gap-2 neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                                <Download className="size-4" />
                                Import Excel
                            </Button>
                        </Link>
                        <Link href="/fire-safety/apar/create">
                            <Button className="gap-2 neu-card bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
                                <Plus className="size-4" />
                                Tambah APAR
                            </Button>
                        </Link>
                        <Button
                            onClick={handleMassQR}
                            className="gap-2 neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                            disabled={apar.data.length === 0}
                        >
                            <Printer className="size-4" />
                            QR Code Massal
                        </Button>
                        <Button
                            onClick={clearFilters}
                            className="gap-2 neu-card border-border/50 hover:border-destructive/50 hover:bg-destructive/5 transition-all duration-200"
                            disabled={!hasActiveFilters}
                        >
                            <X className="size-4" />
                            Reset Filter
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="neu-card overflow-hidden animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                    <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base">Filter & Pencarian</CardTitle>
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
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                                <div className="relative sm:col-span-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                                    <Input
                                        placeholder="Cari kode APAR, lokasi, lantai..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-9 insp-search-input neu-card border-border/50 focus:border-primary/50"
                                    />
                                </div>
                                <div>
                                    <Select value={jenis} onValueChange={setJenis}>
                                        <SelectTrigger className="w-full neu-card border-border/50 focus:border-primary/50">
                                            <SelectValue placeholder="Jenis" />
                                        </SelectTrigger>
                                        <SelectContent className="neu-dropdown">
                                            <SelectItem value="">Semua Jenis</SelectItem>
                                            {filterOptions.jenis.map((j) => (
                                                <SelectItem key={j} value={j} className="neu-dropdown-item">{j}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select value={lantai} onValueChange={setLantai}>
                                        <SelectTrigger className="w-full neu-card border-border/50 focus:border-primary/50">
                                            <SelectValue placeholder="Lantai" />
                                        </SelectTrigger>
                                        <SelectContent className="neu-dropdown">
                                            <SelectItem value="">Semua Lantai</SelectItem>
                                            {['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4', 'Lantai 5', 'Basement', 'Roof'].map((l) => (
                                                <SelectItem key={l} value={l} className="neu-dropdown-item">{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Select value={size} onValueChange={setSize}>
                                        <SelectTrigger className="w-full neu-card border-border/50 focus:border-primary/50">
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
                                    <Button type="submit" className="flex-1 gap-2 neu-card bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-[0.98]">
                                        <Search className="size-4" />
                                        Cari
                                    </Button>
                                </div>
                            </div>
                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="gap-1 text-destructive hover:text-destructive/80"
                                    onClick={clearFilters}
                                >
                                    <X className="size-3.5" />
                                    Reset semua filter
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground animate-in fade-in duration-300">
                    <p>
                        {apar.from && apar.to ? (
                            <>Menampilkan {apar.from} - {apar.to} dari {apar.total} data</>
                        ) : (
                            <>Tidak ada data</>
                        )}
                    </p>
                    {isPending && (
                        <span className="flex items-center gap-1.5 text-primary text-sm">
                            <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                            Memuat...
                        </span>
                    )}
                </div>

                {/* Table */}
                <Card className="neu-card overflow-hidden animate-in fade-in slide-in-from-y-4 duration-400 delay-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border/50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[60px]">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kode APAR</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Jenis</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ukuran</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Lantai</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider max-w-[300px]">Lokasi</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">PIC</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[100px]">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderTableRows()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {apar.last_page > 1 && (
                        <div className="p-4 border-t border-border/50">
                            <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
                                {apar.current_page > 1 && (
                                    <a
                                        href={apar.links.find(l => l.label === 'Previous')?.url}
                                        className="insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
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
                                                'insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200',
                                                link.active && 'insp-pagination-btn-active bg-primary text-primary-foreground border-primary'
                                            )}
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <span key={link.label} className="insp-pagination-btn neu-card opacity-50 cursor-not-allowed border-border/50">
                                            {link.label}
                                        </span>
                                    )
                                )}
                                {apar.current_page < apar.last_page && (
                                    <a
                                        href={apar.links.find(l => l.label === 'Next')?.url}
                                        className="insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                                        aria-label="Next page"
                                    >
                                        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </a>
                                )}
                            </nav>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}