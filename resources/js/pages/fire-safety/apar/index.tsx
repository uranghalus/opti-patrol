import { Head } from '@inertiajs/react';
import { Link, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, ChevronDown, Download, QrCode } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Apar } from '@/types';

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
    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [lantai, setLantai] = useState(filters.lantai || '');
    const [size, setSize] = useState(filters.size || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (jenis) params.set('jenis', jenis);
        if (lantai) params.set('lantai', lantai);
        if (size) params.set('size', size);
        window.location.href = `/apar?${params.toString()}`;
    };

    const clearFilters = () => {
        setSearch('');
        setJenis('');
        setLantai('');
        setSize('');
        window.location.href = '/apar';
    };

    const hasActiveFilters = search || jenis || lantai || size;

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
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                </svg>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link href={`/apar/${item.id}/edit`}>
                                    <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5a2.121 2.121 0 0 1 3 3z" />
                                    </svg>
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/apar/${item.id}/generate-qr`} target="_blank">
                                    <QrCode className="mr-2 size-4" />
                                    QR Code
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                    if (confirm(`Hapus APAR ${item.kode_apar}?`)) {
                                        document.getElementById(`delete-form-${item.id}`)?.requestSubmit();
                                    }
                                }}
                            >
                                <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                                Hapus
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <form id={`delete-form-${item.id}`} action={`/apar/${item.id}`} method="POST" className="hidden">
                        <input type="hidden" name="_method" value="DELETE" />
                        <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                    </form>
                </td>
            </tr>
        ));
    };

    return (
        <>
            <Head title="Data APAR" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Data APAR</h1>
                        <p className="text-sm text-muted-foreground/50">Kelola data APAR (Alat Pemadam Api Ringan)</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/apar/upload-excel" className="hidden sm:inline-flex">
                            <Button variant="outline" className="gap-2">
                                <Download className="size-4" />
                                Import Excel
                            </Button>
                        </Link>
                        <Link href="/apar/create">
                            <Button className="gap-2">
                                <Plus className="size-4" />
                                Tambah APAR
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <form onSubmit={handleSearch} className={cn('space-y-4', showFilters ? '' : 'hidden')}>
                    <div className="insp-search flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
                            <Input
                                placeholder="Cari kode APAR, lokasi, lantai..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 insp-search-input"
                            />
                        </div>
                        <Select value={jenis} onValueChange={setJenis}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Jenis" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Semua Jenis</SelectItem>
                                {filterOptions.jenis.map((j) => (
                                    <SelectItem key={j} value={j}>{j}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={lantai} onValueChange={setLantai}>
                            <SelectTrigger className="w-full sm:w-[150px]">
                                <SelectValue placeholder="Lantai" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Semua Lantai</SelectItem>
                                {['Lantai 1', 'Lantai 2', 'Lantai 3', 'Lantai 4', 'Lantai 5', 'Basement', 'Roof'].map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={size} onValueChange={setSize}>
                            <SelectTrigger className="w-full sm:w-[120px]">
                                <SelectValue placeholder="Ukuran" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Semua Ukuran</SelectItem>
                                {filterOptions.sizes.map((s) => (
                                    <SelectItem key={s} value={s.toString()}>{s} kg</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                            <Button type="submit" className="gap-2">
                                <Search className="size-4" />
                                Cari
                            </Button>
                            {hasActiveFilters && (
                                <Button type="button" variant="ghost" onClick={clearFilters} className="gap-1">
                                    <Filter className="size-3.5" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>
                </form>

                {/* Toggle Filters on Mobile */}
                <div className="sm:hidden">
                    <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <Filter className="size-4" />
                        Filter {hasActiveFilters && <span className="text-primary font-medium">({Object.values(filters).filter(Boolean).length})</span>}
                        <ChevronDown className={cn('size-4 transition-transform', showFilters && 'rotate-180')} />
                    </Button>
                </div>

                {/* Results Info */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                        {apar.from && apar.to ? (
                            <>Menampilkan {apar.from} - {apar.to} dari {apar.total} data</>
                        ) : (
                            <>Tidak ada data</>
                        )}
                    </p>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50">
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
                </div>

                {/* Pagination */}
                {apar.last_page > 1 && (
                    <nav className="flex items-center justify-center gap-1 mt-4" aria-label="Pagination">
                        {apar.current_page > 1 && (
                            <a
                                href={apar.links.find(l => l.label === 'Previous')?.url}
                                className="insp-pagination-btn"
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
                                        'insp-pagination-btn',
                                        link.active && 'insp-pagination-btn-active'
                                    )}
                                >
                                    {link.label}
                                </a>
                            ) : (
                                <span key={link.label} className="insp-pagination-btn opacity-50 cursor-not-allowed">
                                    {link.label}
                                </span>
                            )
                        )}
                        {apar.current_page < apar.last_page && (
                            <a
                                href={apar.links.find(l => l.label === 'Next')?.url}
                                className="insp-pagination-btn"
                            >
                                <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </a>
                        )}
                    </nav>
                )}
            </div>
        </>
    );
}