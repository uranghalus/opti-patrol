/*
 * DIRECTION CONTRACT — APAR index (Stripe world, mobile-first)
 * THESIS: a field operations deck, not a desktop grid shrunk down — the
 * action surface (search + filters) lives in a sticky deck at thumb level
 * and every APAR is one tappable ledger row.
 * OWN-WORLD: Stripe tokens — white cards, 1px #E5EDF5 borders, purple
 * #533AFD actions, navy text; 44px touch targets, 8px gaps.
 * STORY: inspector filters instantly via chips, scans the ledger, taps a
 * row to edit; admins bulk-print QR labels without losing scroll position.
 * FIRST VIEWPORT: header line, sticky deck with search + chips, first rows
 * of the ledger. FORM: page revamp, code-led (pinned brief).
 * FINISH: unreviewed and undocumented is unfinished; this build ends with
 * the finish review, the verdict, and DESIGN.md.
 */
import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Flame,
    MapPin,
    Pencil,
    Plus,
    Printer,
    QrCode,
    Search,
    SlidersHorizontal,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';
import type { ReactNode } from 'react';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { HasAnyPermission } from '@/lib/permission';
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

const JENIS = ['CO2', 'Powder', 'Foam', 'Air'];
const LANTAI = [
    'Lantai 1',
    'Lantai 2',
    'Lantai 3',
    'Lantai 4',
    'Lantai 5',
    'Basement',
    'Roof',
];

type FilterKey = 'jenis' | 'lantai' | 'size';

const JENIS_DOT: Record<string, string> = {
    CO2: 'bg-red-500',
    Powder: 'bg-blue-500',
    Foam: 'bg-amber-500',
    Air: 'bg-emerald-500',
};

const getJenisDot = (jenis: string) =>
    JENIS_DOT[jenis] ?? 'bg-muted-foreground';

type LedgerRowProps = {
    item: Apar;
    canEdit: boolean;
    canGenerateQr: boolean;
    canDelete: boolean;
    badge: (jenis: string) => ReactNode;
    onDelete: (item: Apar) => void;
};

function LedgerRow({
    item,
    canEdit,
    canGenerateQr,
    canDelete,
    badge,
    onDelete,
}: LedgerRowProps) {
    const body = (
        <>
            <div
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-[4px] bg-muted"
            >
                <Flame className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate font-mono text-[15px] font-medium text-foreground">
                        {item.kode_apar}
                    </p>
                    {badge(item.jenis)}
                </div>
                <p className="mt-0.5 flex items-center gap-1 truncate text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    <span className="truncate">{item.lokasi}</span>
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                    {item.lantai ?? '—'} · {Number(item.size)} kg
                </p>
            </div>
            {canEdit && (
                <ChevronRight
                    className="size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                />
            )}
        </>
    );

    return (
        <li className="flex items-center gap-1 pr-1">
            {canEdit ? (
                <Link
                    href={`/fire-safety/apar/${item.id}/edit`}
                    className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 active:bg-accent"
                >
                    {body}
                </Link>
            ) : (
                <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
                    {body}
                </div>
            )}

            {(canGenerateQr || canDelete) && (
                <div className="flex shrink-0 items-center">
                    {canGenerateQr && (
                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="size-11 rounded-[4px] text-muted-foreground hover:text-foreground"
                        >
                            <a
                                href={`/fire-safety/apar/${item.id}/generate-qr`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Cetak QR ${item.kode_apar}`}
                            >
                                <QrCode className="size-4" />
                            </a>
                        </Button>
                    )}
                    {canDelete && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-11 rounded-[4px] text-muted-foreground hover:text-destructive"
                            aria-label={`Hapus ${item.kode_apar}`}
                            onClick={() => onDelete(item)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    )}
                </div>
            )}
        </li>
    );
}

export default function AparIndex({ apar, filters, filterOptions }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [jenis, setJenis] = useState(filters.jenis || '');
    const [lantai, setLantai] = useState(filters.lantai || '');
    const [size, setSize] = useState(filters.size || '');
    const [filterSheetOpen, setFilterSheetOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Apar | null>(null);
    const [isPending, startTransition] = useTransition();

    // Bulk-print (cetak QR massal) state
    const [lantaiList, setLantaiList] = useState<string[]>([]);
    const [batchCount, setBatchCount] = useState(1);
    const [selectedLantai, setSelectedLantai] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('1');

    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/fire-safety/apar/filter-options')
            .then((res) => res.json())
            .then((data) => {
                setLantaiList(data.lantai ?? []);
                setBatchCount(data.totalBatch ?? 1);
            })
            .catch(() => {});
    }, []);

    const applyFilters = (next: {
        search?: string;
        jenis?: string;
        lantai?: string;
        size?: string;
    }) => {
        const params = new URLSearchParams();
        const s = next.search ?? search;
        const j = next.jenis ?? jenis;
        const l = next.lantai ?? lantai;
        const z = next.size ?? size;

        if (s) {
            params.set('search', s);
        }

        if (j) {
            params.set('jenis', j);
        }

        if (l) {
            params.set('lantai', l);
        }

        if (z) {
            params.set('size', z);
        }

        const qs = params.toString();
        startTransition(() => {
            router.get(`/fire-safety/apar${qs ? `?${qs}` : ''}`, undefined, {
                preserveScroll: true,
                preserveState: true,
            });
        });
    };

    const submitSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchRef.current?.blur();
        applyFilters({ search });
    };

    const setFilter = (key: FilterKey, value: string) => {
        if (key === 'jenis') {
            setJenis(value);
        } else if (key === 'lantai') {
            setLantai(value);
        } else {
            setSize(value);
        }

        applyFilters({ [key]: value });
    };

    const clearAll = () => {
        setSearch('');
        setJenis('');
        setLantai('');
        setSize('');
        startTransition(() => {
            router.get('/fire-safety/apar', undefined, {
                preserveScroll: true,
                preserveState: true,
            });
        });
    };

    const hasActiveFilters = Boolean(search || jenis || lantai || size);
    const activeChips: { key: FilterKey; label: string }[] = [];

    if (jenis) {
        activeChips.push({ key: 'jenis', label: `Jenis: ${jenis}` });
    }

    if (lantai) {
        activeChips.push({ key: 'lantai', label: lantai });
    }

    if (size) {
        activeChips.push({ key: 'size', label: `${size} kg` });
    }

    const handleMassPrint = () => {
        const params = new URLSearchParams();

        if (selectedLantai) {
            params.set('lantai', selectedLantai);
        }

        params.set('batch', selectedBatch);
        window.open(
            `/fire-safety/apar/generate-mass-qr?${params.toString()}`,
            '_blank',
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/fire-safety/apar/${deleteTarget.id}`, {
            preserveScroll: true,
        });
        setDeleteTarget(null);
    };

    const prevUrl = apar.links.find((l) => l.label === 'Previous')?.url ?? null;
    const nextUrl = apar.links.find((l) => l.label === 'Next')?.url ?? null;

    const canCreate = HasAnyPermission(['apar.create']);
    const canEdit = HasAnyPermission(['apar.edit']);
    const canDelete = HasAnyPermission(['apar.delete']);
    const canGenerateQr = HasAnyPermission(['apar.generate-qr']);

    const jenisBadge = (value: string) => (
        <span className="inline-flex h-6 items-center gap-1.5 rounded-[2px] bg-muted px-2 text-xs font-medium text-foreground">
            <span
                aria-hidden
                className={cn('size-1.5 rounded-full', getJenisDot(value))}
            />
            {value}
        </span>
    );

    return (
        <>
            <Head title="Data APAR" />

            <div className="float-in space-y-4">
                {/* ── Page header (compact; the deck carries the weight) ── */}
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-2 text-lg font-medium tracking-tight text-foreground sm:text-2xl">
                            <Flame className="size-5 text-primary" />
                            Data APAR
                        </h1>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Alat Pemadam Api Ringan · {apar.total} unit terdata
                        </p>
                    </div>
                    {canCreate && (
                        <Button
                            asChild
                            className="btn-soft-primary hidden h-10 shrink-0 active:scale-[0.98] sm:inline-flex"
                        >
                            <Link href="/fire-safety/apar/create">
                                <Plus className="size-4" />
                                Tambah APAR
                            </Link>
                        </Button>
                    )}
                </header>

                {/* ── Sticky action deck (mobile) / toolbar card (desktop) ── */}
                <div
                    className={cn(
                        'z-[3] -mx-3 bg-background/95 px-3 py-2 backdrop-blur-sm sm:-mx-4 sm:px-4',
                        'max-lg:sticky max-lg:top-14',
                        'lg:mx-0 lg:rounded-lg lg:border lg:border-border lg:bg-card lg:px-4 lg:py-3 lg:shadow-[var(--shadow-lg-stripe)]',
                    )}
                >
                    <form
                        role="search"
                        onSubmit={submitSearch}
                        className="flex items-center gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                ref={searchRef}
                                inputMode="search"
                                aria-label="Cari kode, lokasi, atau lantai"
                                placeholder="Cari kode, lokasi, lantai…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-11 rounded-[4px] pl-9"
                            />
                        </div>

                        {/* Mobile: filter sheet trigger */}
                        <Button
                            type="button"
                            aria-label="Filter"
                            aria-expanded={filterSheetOpen}
                            onClick={() => setFilterSheetOpen(true)}
                            className="relative size-11 shrink-0 rounded-[4px] border border-border bg-card p-0 text-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
                        >
                            <SlidersHorizontal className="size-4" />
                            {activeChips.length > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
                                    {activeChips.length}
                                </span>
                            )}
                        </Button>

                        {/* Desktop: inline selects */}
                        <div className="hidden items-center gap-2 lg:flex">
                            <Select
                                value={jenis || 'all'}
                                onValueChange={(v) =>
                                    setFilter('jenis', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    aria-label="Filter jenis"
                                    className="h-11 w-[130px] rounded-[4px]"
                                >
                                    <SelectValue placeholder="Jenis" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Jenis
                                    </SelectItem>
                                    {(filterOptions.jenis.length
                                        ? filterOptions.jenis
                                        : JENIS
                                    ).map((j) => (
                                        <SelectItem key={j} value={j}>
                                            {j}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={lantai || 'all'}
                                onValueChange={(v) =>
                                    setFilter('lantai', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    aria-label="Filter lantai"
                                    className="h-11 w-[140px] rounded-[4px]"
                                >
                                    <SelectValue placeholder="Lantai" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Lantai
                                    </SelectItem>
                                    {LANTAI.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={size || 'all'}
                                onValueChange={(v) =>
                                    setFilter('size', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    aria-label="Filter ukuran"
                                    className="h-11 w-[110px] rounded-[4px]"
                                >
                                    <SelectValue placeholder="Ukuran" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Ukuran
                                    </SelectItem>
                                    {filterOptions.sizes.map((s) => (
                                        <SelectItem
                                            key={s}
                                            value={s.toString()}
                                        >
                                            {s} kg
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {canCreate && (
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="neu-btn h-10"
                                >
                                    <Link href="/fire-safety/apar/upload-excel">
                                        Import Excel
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Active filter chips (wrap, never clipped) */}
                    {activeChips.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {activeChips.map((chip) => (
                                <button
                                    key={chip.key}
                                    type="button"
                                    onClick={() => setFilter(chip.key, '')}
                                    className="inline-flex h-10 items-center gap-1.5 rounded-[2px] bg-secondary px-3 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent"
                                >
                                    {chip.label}
                                    <X className="size-3" aria-hidden />
                                    <span className="sr-only">
                                        Hapus filter {chip.label}
                                    </span>
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={clearAll}
                                className="inline-flex h-10 items-center rounded-[2px] px-2 text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                            >
                                Reset semua
                            </button>
                        </div>
                    )}
                </div>

                {/* ── Mobile actions: primary CTA full-width, secondaries below ── */}
                {canCreate && (
                    <Button
                        asChild
                        className="btn-soft-primary h-11 w-full active:scale-[0.98] lg:hidden"
                    >
                        <Link href="/fire-safety/apar/create">
                            <Plus className="size-4" />
                            Tambah APAR
                        </Link>
                    </Button>
                )}
                <div className="flex gap-2 lg:hidden">
                    {canCreate && (
                        <Button
                            asChild
                            variant="ghost"
                            className="neu-btn h-11 flex-1"
                        >
                            <Link href="/fire-safety/apar/upload-excel">
                                Import Excel
                            </Link>
                        </Button>
                    )}
                    {canGenerateQr && (
                        <Button
                            type="button"
                            aria-expanded={qrOpen}
                            onClick={() => setQrOpen(!qrOpen)}
                            variant="ghost"
                            className="neu-btn h-11 flex-1"
                        >
                            <Printer className="size-4" />
                            Cetak QR
                            <ChevronDown
                                className={cn(
                                    'size-4 transition-transform duration-200',
                                    qrOpen && 'rotate-180',
                                )}
                            />
                        </Button>
                    )}
                </div>

                {/* ── Bulk QR printing (collapsible on mobile, card on desktop) ── */}
                {canGenerateQr && (
                    <section
                        className={cn(
                            'neu-card p-4 sm:p-5',
                            !qrOpen && 'hidden lg:block',
                        )}
                    >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-[15px] font-medium text-foreground">
                                    Cetak QR Code Massal
                                </h2>
                                <p className="mt-0.5 text-sm text-muted-foreground">
                                    Pilih lantai &amp; batch, lalu cetak label
                                    QR APAR.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                                <Select
                                    value={selectedLantai || 'all'}
                                    onValueChange={(v) =>
                                        setSelectedLantai(v === 'all' ? '' : v)
                                    }
                                >
                                    <SelectTrigger
                                        aria-label="Lantai untuk cetak massal"
                                        className="h-11 w-full rounded-[4px] sm:w-[180px]"
                                    >
                                        <SelectValue placeholder="Semua Lantai" />
                                    </SelectTrigger>
                                    <SelectContent className="neu-dropdown">
                                        <SelectItem value="all">
                                            Semua Lantai
                                        </SelectItem>
                                        {lantaiList.map((l) => (
                                            <SelectItem key={l} value={l}>
                                                {l}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={selectedBatch}
                                    onValueChange={setSelectedBatch}
                                >
                                    <SelectTrigger
                                        aria-label="Batch cetak"
                                        className="h-11 w-full rounded-[4px] sm:w-[130px]"
                                    >
                                        <SelectValue placeholder="Batch" />
                                    </SelectTrigger>
                                    <SelectContent className="neu-dropdown">
                                        {Array.from(
                                            { length: batchCount },
                                            (_, i) => (
                                                <SelectItem
                                                    key={i}
                                                    value={`${i + 1}`}
                                                >
                                                    Batch {i + 1}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleMassPrint}
                                    className="btn-soft-primary h-11 w-full active:scale-[0.98] sm:w-auto"
                                >
                                    <Printer className="size-4" />
                                    Cetak QR Code
                                </Button>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Results info ── */}
                <div
                    className="flex items-center justify-between text-sm text-muted-foreground"
                    aria-live="polite"
                >
                    <p>
                        {apar.from !== null && apar.to !== null ? (
                            <>
                                Menampilkan{' '}
                                <span className="font-medium text-foreground">
                                    {apar.from}–{apar.to}
                                </span>{' '}
                                dari {apar.total} data
                            </>
                        ) : (
                            'Tidak ada data'
                        )}
                    </p>
                    {isPending && (
                        <span className="flex items-center gap-1.5 text-primary">
                            <svg
                                className="size-4 animate-spin"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                aria-hidden
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    strokeOpacity="0.25"
                                />
                                <path
                                    d="M12 2a10 10 0 0 1 10 10"
                                    strokeLinecap="round"
                                />
                            </svg>
                            Memuat…
                        </span>
                    )}
                </div>

                {/* ── Empty state ── */}
                {apar.data.length === 0 && (
                    <div className="neu-card flex flex-col items-center gap-3 px-6 py-14 text-center">
                        <div className="grid size-12 place-items-center rounded-full bg-muted">
                            <Search
                                className="size-5 text-muted-foreground"
                                aria-hidden
                            />
                        </div>
                        <p className="text-[15px] font-medium text-foreground">
                            Tidak ada data APAR
                        </p>
                        <p className="max-w-xs text-sm text-muted-foreground">
                            {hasActiveFilters
                                ? 'Tidak ada yang cocok dengan filter saat ini. Coba ubah atau reset pencarian.'
                                : 'Belum ada APAR terdaftar. Tambahkan unit pertama atau impor dari Excel.'}
                        </p>
                        {hasActiveFilters ? (
                            <Button
                                variant="ghost"
                                onClick={clearAll}
                                className="neu-btn h-10"
                            >
                                Reset filter
                            </Button>
                        ) : (
                            canCreate && (
                                <Button
                                    asChild
                                    className="btn-soft-primary h-10 active:scale-[0.98]"
                                >
                                    <Link href="/fire-safety/apar/create">
                                        <Plus className="size-4" />
                                        Tambah APAR
                                    </Link>
                                </Button>
                            )
                        )}
                    </div>
                )}

                {/* ── Ledger list (mobile + tablet) ── */}
                {apar.data.length > 0 && (
                    <ul className="neu-card list-none divide-y divide-border overflow-hidden lg:hidden">
                        {apar.data.map((item) => (
                            <LedgerRow
                                key={item.id}
                                item={item}
                                canEdit={canEdit}
                                canGenerateQr={canGenerateQr}
                                canDelete={canDelete}
                                badge={jenisBadge}
                                onDelete={setDeleteTarget}
                            />
                        ))}
                    </ul>
                )}

                {/* ── Data table (desktop) ── */}
                {apar.data.length > 0 && (
                    <div className="neu-card hidden overflow-hidden lg:block">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/60 hover:bg-muted/60">
                                    <TableHead className="pl-4">Kode</TableHead>
                                    <TableHead>Jenis</TableHead>
                                    <TableHead>Ukuran</TableHead>
                                    <TableHead>Lantai</TableHead>
                                    <TableHead>Lokasi</TableHead>
                                    <TableHead>Petugas</TableHead>
                                    <TableHead className="pr-4 text-right">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apar.data.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="pl-4 font-mono font-medium text-foreground">
                                            {item.kode_apar}
                                        </TableCell>
                                        <TableCell>
                                            {jenisBadge(item.jenis)}
                                        </TableCell>
                                        <TableCell>{Number(item.size)} kg</TableCell>
                                        <TableCell>
                                            {item.lantai ?? '—'}
                                        </TableCell>
                                        <TableCell
                                            className="max-w-[240px] truncate"
                                            title={item.lokasi}
                                        >
                                            {item.lokasi}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {item.user?.name ?? '—'}
                                        </TableCell>
                                        <TableCell className="pr-4">
                                            <div className="flex items-center justify-end gap-1">
                                                {canEdit && (
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-10 rounded-[4px] text-muted-foreground hover:text-foreground"
                                                    >
                                                        <Link
                                                            href={`/fire-safety/apar/${item.id}/edit`}
                                                            aria-label={`Edit ${item.kode_apar}`}
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Link>
                                                    </Button>
                                                )}
                                                {canGenerateQr && (
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-10 rounded-[4px] text-muted-foreground hover:text-foreground"
                                                    >
                                                        <a
                                                            href={`/fire-safety/apar/${item.id}/generate-qr`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`Cetak QR ${item.kode_apar}`}
                                                        >
                                                            <QrCode className="size-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-10 rounded-[4px] text-muted-foreground hover:text-destructive"
                                                        aria-label={`Hapus ${item.kode_apar}`}
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                item,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* ── Pagination ── */}
                {apar.last_page > 1 && (
                    <nav
                        aria-label="Navigasi halaman"
                        className="flex items-center justify-between"
                    >
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!prevUrl}
                            className="size-11 rounded-[4px]"
                            onClick={() => prevUrl && router.get(prevUrl)}
                            aria-label="Halaman sebelumnya"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <p className="text-sm text-muted-foreground">
                            Halaman{' '}
                            <span className="font-medium text-foreground">
                                {apar.current_page}
                            </span>{' '}
                            dari {apar.last_page}
                        </p>
                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!nextUrl}
                            className="size-11 rounded-[4px]"
                            onClick={() => nextUrl && router.get(nextUrl)}
                            aria-label="Halaman berikutnya"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </nav>
                )}
            </div>

            {/* ── Mobile filter sheet ── */}
            <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <SheetContent
                    side="bottom"
                    className="max-h-[85dvh] gap-0 rounded-t-lg px-0 pb-2"
                >
                    <SheetHeader className="px-4 pb-2">
                        <SheetTitle>Filter</SheetTitle>
                        <SheetDescription>
                            Filter diterapkan langsung saat dipilih.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 overflow-y-auto px-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-jenis">Jenis</Label>
                            <Select
                                value={jenis || 'all'}
                                onValueChange={(v) =>
                                    setFilter('jenis', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    id="filter-jenis"
                                    className="h-11 w-full rounded-[4px]"
                                >
                                    <SelectValue placeholder="Semua Jenis" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Jenis
                                    </SelectItem>
                                    {(filterOptions.jenis.length
                                        ? filterOptions.jenis
                                        : JENIS
                                    ).map((j) => (
                                        <SelectItem key={j} value={j}>
                                            {j}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-lantai">Lantai</Label>
                            <Select
                                value={lantai || 'all'}
                                onValueChange={(v) =>
                                    setFilter('lantai', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    id="filter-lantai"
                                    className="h-11 w-full rounded-[4px]"
                                >
                                    <SelectValue placeholder="Semua Lantai" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Lantai
                                    </SelectItem>
                                    {LANTAI.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="filter-size">Ukuran</Label>
                            <Select
                                value={size || 'all'}
                                onValueChange={(v) =>
                                    setFilter('size', v === 'all' ? '' : v)
                                }
                            >
                                <SelectTrigger
                                    id="filter-size"
                                    className="h-11 w-full rounded-[4px]"
                                >
                                    <SelectValue placeholder="Semua Ukuran" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all">
                                        Semua Ukuran
                                    </SelectItem>
                                    {filterOptions.sizes.map((s) => (
                                        <SelectItem
                                            key={s}
                                            value={s.toString()}
                                        >
                                            {s} kg
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter className="flex-row gap-2 px-4 pb-4">
                        <Button
                            variant="ghost"
                            onClick={clearAll}
                            disabled={!hasActiveFilters}
                            className="neu-btn h-11 flex-1"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={() => setFilterSheetOpen(false)}
                            className="btn-soft-primary h-11 flex-1 active:scale-[0.98]"
                        >
                            Selesai
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* ── Delete confirmation ── */}
            <ConfirmDialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
                title={`Hapus APAR ${deleteTarget?.kode_apar ?? ''}?`}
                desc="Data APAR ini akan dihapus permanen dan tidak dapat dikembalikan."
                destructive
                confirmText="Hapus"
                cancelBtnText="Batal"
                handleConfirm={confirmDelete}
            />
        </>
    );
}
