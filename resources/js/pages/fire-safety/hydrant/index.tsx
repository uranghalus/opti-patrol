import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, Download, Printer, X, Droplet, Wrench, Layers, MapPin, UserRound, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, LoaderCircle, TriangleAlert, SquarePen, Trash2, FileSpreadsheet } from 'lucide-react';
import { useEffect, useState, useTransition, useRef } from 'react';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { HasAnyPermission } from '@/lib/permission';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import type { Hydrant } from '@/types';

interface PageLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PageLink[];
}

interface Props {
    hydrantdata: PaginatedData<Hydrant>;
    filters: { search?: string; tipe?: string; lantai?: string };
    filterOptions: { lantai: string[] };
}

function getTipeBadge(t: string) {
    const config = {
        Indoor: { class: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20', icon: <Droplet className="h-3 w-3" /> },
        Outdoor: { class: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20', icon: <Wrench className="h-3 w-3" /> },
    };
    return config[t as keyof typeof config] ?? { class: 'bg-muted text-muted-foreground ring-1 ring-border', icon: <Droplet className="h-3 w-3" /> };
}

function HydrantActionDialog({ currentRow, open, onOpenChange }: { currentRow?: Hydrant; open: boolean; onOpenChange: (open: boolean) => void }) {
    const isEdit = !!currentRow;
    const { data, setData, post, put, processing, reset, errors } = useForm({
        kode_unik: currentRow?.kode_unik || '',
        kode_hydrant: currentRow?.kode_hydrant || '',
        tipe: currentRow?.tipe || 'Indoor',
        ukuran: currentRow?.ukuran || '',
        lantai: currentRow?.lantai || '',
        lokasi: currentRow?.lokasi || '',
    });

    useEffect(() => {
        if (open) {
            setData({
                kode_unik: currentRow?.kode_unik || '',
                kode_hydrant: currentRow?.kode_hydrant || '',
                tipe: currentRow?.tipe || 'Indoor',
                ukuran: currentRow?.ukuran || '',
                lantai: currentRow?.lantai || '',
                lokasi: currentRow?.lokasi || '',
            });
        }
    }, [open, currentRow]);

    const handleClose = () => { reset(); onOpenChange(false); };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/fire-safety/hydrant/${currentRow?.id}`, {
                onSuccess: () => { toast.success('Data Hydrant berhasil diubah'); handleClose(); },
                preserveScroll: true,
            });
        } else {
            post('/fire-safety/hydrant', {
                onSuccess: () => { toast.success('Data Hydrant berhasil ditambah'); handleClose(); },
                preserveScroll: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-border/60 bg-background/95 max-w-md rounded-2xl backdrop-blur-xl backdrop-saturate-[140%] sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{isEdit ? 'Edit Hydrant' : 'Tambah Hydrant Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label htmlFor="kode_unik">Kode Unik</Label>
                        <Input id="kode_unik" value={data.kode_unik} onChange={(e) => setData('kode_unik', e.target.value)} placeholder="Contoh: HYD-001" />
                        {errors.kode_unik && <p className="text-xs text-destructive">{errors.kode_unik}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="kode_hydrant">Kode Hydrant</Label>
                        <Input id="kode_hydrant" value={data.kode_hydrant} onChange={(e) => setData('kode_hydrant', e.target.value)} placeholder="Contoh: HYD Utama" />
                        {errors.kode_hydrant && <p className="text-xs text-destructive">{errors.kode_hydrant}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="tipe">Tipe</Label>
                            <Select value={data.tipe} onValueChange={(v) => setData('tipe', v as 'Indoor' | 'Outdoor')}>
                                <SelectTrigger id="tipe" className="w-full"><SelectValue placeholder="Pilih Tipe" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Indoor">Indoor</SelectItem>
                                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.tipe && <p className="text-xs text-destructive">{errors.tipe}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ukuran">Ukuran</Label>
                            <Input id="ukuran" value={data.ukuran} onChange={(e) => setData('ukuran', e.target.value)} placeholder="2.5 inch" />
                            {errors.ukuran && <p className="text-xs text-destructive">{errors.ukuran}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lantai">Lantai</Label>
                        <Input id="lantai" value={data.lantai ?? ''} onChange={(e) => setData('lantai', e.target.value)} placeholder="Contoh: Lantai 1" />
                        {errors.lantai && <p className="text-xs text-destructive">{errors.lantai}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="lokasi">Lokasi</Label>
                        <Input id="lokasi" value={data.lokasi} onChange={(e) => setData('lokasi', e.target.value)} placeholder="Contoh: Lobby Utama" />
                        {errors.lokasi && <p className="text-xs text-destructive">{errors.lokasi}</p>}
                    </div>
                    <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>Batal</Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Hydrant' : 'Tambah Hydrant'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function HydrantDeleteDialog({ currentRow, open, onOpenChange }: { currentRow: Hydrant; open: boolean; onOpenChange: (open: boolean) => void }) {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { delete: destroy, processing } = useForm();

    useEffect(() => { if (open) { setValue(''); setErrorMessage(''); } }, [open]);

    const handleClose = () => { setValue(''); setErrorMessage(''); onOpenChange(false); };
    const handleDelete = () => {
        if (value !== currentRow.kode_unik) { setErrorMessage('Kode unik tidak sesuai'); return; }
        destroy(`/fire-safety/hydrant/${currentRow.id}`, {
            preserveScroll: true,
            onSuccess: () => { toast.success('Data Hydrant berhasil dihapus'); handleClose(); },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="border-border/60 bg-background/95 max-w-md rounded-2xl backdrop-blur-xl backdrop-saturate-[140%]">
                <AlertDialogHeader className="text-left">
                    <AlertDialogTitle className="text-destructive flex items-center gap-2">
                        <TriangleAlert className="stroke-destructive" size={18} /> Hapus Data
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus Hydrant <span className="font-bold text-foreground">{currentRow.kode_unik}</span>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="grid gap-3 py-2">
                    <Label className="text-sm text-muted-foreground">
                        Untuk mengkonfirmasi, silakan ketik kode unik <span className="font-bold text-foreground">{currentRow.kode_unik}</span>:
                    </Label>
                    <Alert variant="destructive">
                        <AlertTitle>Perhatian!</AlertTitle>
                        <AlertDescription>Tindakan ini tidak dapat dibatalkan.</AlertDescription>
                    </Alert>
                    <Separator />
                    <div className="flex w-full items-center gap-2 rounded-md border border-red-300/60 bg-red-50 p-2 text-sm text-red-600">
                        <span>Ketik: <span className="font-bold">{currentRow.kode_unik}</span></span>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmation" className="text-sm font-medium">Konfirmasi Penghapusan</Label>
                        <Input id="confirmation" value={value} onChange={(e) => { setValue(e.target.value); if (errorMessage) setErrorMessage(''); }} placeholder={`Ketik "${currentRow.kode_unik}" untuk konfirmasi`} disabled={processing} />
                        {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
                    </div>
                </div>
                <AlertDialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={processing} className="bg-destructive text-white hover:bg-destructive/90">
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function HydrantCard({ item, isLoading, onEdit, onDelete }: { item: Hydrant; isLoading: boolean; onEdit: (h: Hydrant) => void; onDelete: (h: Hydrant) => void }) {
    const cfg = getTipeBadge(item.tipe);
    return (
        <article className={cn(
            'neu-card group relative flex flex-col gap-4 rounded-2xl p-4 sm:p-5 transition-all duration-300',
            isLoading && 'opacity-60 pointer-events-none',
            'hover:-translate-y-1 hover:shadow-[8px_8px_24px_rgba(195,204,212,0.5),-8px_-8px_24px_rgba(255,255,255,0.85)]',
        )}>
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Kode</p>
                    <p className="truncate font-mono text-base font-semibold text-foreground">{item.kode_unik}</p>
                </div>
                <Badge className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0', cfg.class)}>
                    {cfg.icon}<span className="ml-1">{item.tipe}</span>
                </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="neu-well p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Ukuran</p>
                    <p className="truncate font-mono text-sm font-semibold text-foreground">{item.ukuran || '-'}</p>
                </div>
                <div className="neu-well p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60">Lantai</p>
                    <p className="truncate text-sm font-semibold text-foreground">{item.lantai || '-'}</p>
                </div>
            </div>

            <div className="neu-well flex items-start gap-2 p-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary/70" />
                <p className="line-clamp-2 text-sm text-foreground/80">{item.lokasi}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/50 pt-3">
                <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                    <UserRound className="size-4 shrink-0 text-muted-foreground/60" />
                    <span className="truncate">{item.user?.name ?? '-'}</span>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                            </svg>
                            <span className="sr-only">Menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {HasAnyPermission(['hydrant.generate-qr']) && (
                            <DropdownMenuItem asChild>
                                <a href={`/fire-safety/hydrant/${item.id}/generate-qr`} target="_blank" rel="noopener">
                                    <Download className="mr-2 size-4" /> Download QRCode
                                </a>
                            </DropdownMenuItem>
                        )}
                        {HasAnyPermission(['hydrant.edit']) && (
                            <DropdownMenuItem onClick={() => onEdit(item)}>
                                <SquarePen className="mr-2 size-4" /> Edit
                            </DropdownMenuItem>
                        )}
                        {HasAnyPermission(['hydrant.delete']) && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onDelete(item)} className="text-destructive focus:text-destructive">
                                    <Trash2 className="mr-2 size-4" /> Hapus
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </article>
    );
}

function HydrantCardSkeleton() {
    return (
        <div className="neu-card animate-pulse rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                    <div className="h-2.5 w-12 rounded bg-muted" />
                    <div className="h-5 w-32 rounded bg-muted" />
                </div>
                <div className="h-6 w-16 rounded-full bg-muted" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="neu-well h-14 rounded-xl bg-muted/40" />
                <div className="neu-well h-14 rounded-xl bg-muted/40" />
            </div>
            <div className="neu-well mt-3 h-10 rounded-xl bg-muted/40" />
            <div className="mt-3 flex items-center justify-between border-t border-white/50 pt-3">
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-9 w-9 rounded bg-muted" />
            </div>
        </div>
    );
}

function BulkPrintSection({ lantaiList, batchCount }: { lantaiList: string[]; batchCount: number }) {
    const [selectedLantai, setSelectedLantai] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('1');
    const [isPending, startTransition] = useTransition();

    const handlePrint = () => {
        const params = new URLSearchParams();
        if (selectedLantai) params.append('lantai', selectedLantai);
        params.append('batch', selectedBatch);
        startTransition(() => {
            window.open(`/fire-safety/hydrant/generate-mass-qr?${params.toString()}`, '_blank');
        });
    };

    return (
        <section className="glass-panel px-4 py-4 sm:px-6 sm:py-5 animate-in fade-in slide-in-from-y-4 duration-400 delay-75">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="neu-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white">
                        <Printer className="size-4" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">Cetak QR Code Massal</h2>
                        <p className="text-xs text-muted-foreground/70">Cetak label QR Hydrant per lantai & batch.</p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Select value={selectedLantai} onValueChange={setSelectedLantai}>
                        <SelectTrigger className="h-10 w-full sm:w-[180px]">
                            <SelectValue placeholder="Semua Lantai" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua Lantai</SelectItem>
                            {lantaiList.map((lok) => (
                                <SelectItem key={lok} value={lok}>{lok}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                        <SelectTrigger className="h-10 w-full sm:w-[130px]">
                            <SelectValue placeholder="Batch" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: batchCount }, (_, i) => (
                                <SelectItem key={i} value={`${i + 1}`}>Batch {i + 1}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {HasAnyPermission(['hydrant.generate-qr']) && (
                        <Button onClick={handlePrint} disabled={isPending} className="btn-soft-primary gap-2">
                            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Printer className="size-4" />}
                            Cetak QR
                        </Button>
                    )}
                </div>
            </div>
        </section>
    );
}

function FilterCard({ filters, filterOptions, isPending, onSearch }: { filters: Props['filters']; filterOptions: Props['filterOptions']; isPending: boolean; onSearch: (next: { search: string; tipe: string; lantai: string }) => void }) {
    const [search, setSearch] = useState(filters.search || '');
    const [tipe, setTipe] = useState(filters.tipe || '');
    const [lantai, setLantai] = useState(filters.lantai || '');

    const hasActive = !!(filters.search || filters.tipe || filters.lantai);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({ search, tipe, lantai });
    };

    const reset = () => {
        setSearch(''); setTipe(''); setLantai('');
        onSearch({ search: '', tipe: '', lantai: '' });
    };

    return (
        <Card className="neu-card animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Filter className="size-4 text-primary" />
                    Filter & Pencarian
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
                <form onSubmit={submit} className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
                        <Input
                            placeholder="Cari kode, lokasi, lantai..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-11 pl-9 sm:h-10"
                        />
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <Select value={tipe || '_all'} onValueChange={(v) => setTipe(v === '_all' ? '' : v)}>
                            <SelectTrigger className="h-11 sm:h-10"><SelectValue placeholder="Semua Tipe" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_all">Semua Tipe</SelectItem>
                                <SelectItem value="Indoor">Indoor</SelectItem>
                                <SelectItem value="Outdoor">Outdoor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={lantai || '_all'} onValueChange={(v) => setLantai(v === '_all' ? '' : v)}>
                            <SelectTrigger className="h-11 sm:h-10"><SelectValue placeholder="Semua Lantai" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_all">Semua Lantai</SelectItem>
                                {filterOptions.lantai.map((l) => (
                                    <SelectItem key={l} value={l}>{l}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
                        {hasActive ? (
                            <Button type="button" variant="ghost" onClick={reset} className="gap-1.5 text-destructive hover:bg-destructive/5 hover:text-destructive">
                                <X className="size-4" />
                                Hapus filter
                            </Button>
                        ) : <span />}
                        <Button type="submit" disabled={isPending} className="btn-soft-primary gap-2 sm:min-w-[120px]">
                            {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4" />}
                            Terapkan
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function Pagination({ data, isPending, onPage }: { data: PaginatedData<Hydrant>; isPending: boolean; onPage: (url: string | null) => void }) {
    if (data.last_page <= 1) return null;
    const prev = data.links.find((l) => l.label === '&laquo; Previous' || l.label.includes('Previous'));
    const next = data.links.find((l) => l.label === 'Next &raquo;' || l.label.includes('Next'));

    return (
        <nav
            aria-label="Pagination"
            className={cn(
                'flex items-center justify-between gap-3 rounded-2xl border border-border/40 bg-card/80 p-3 backdrop-blur-md sm:justify-center',
                isPending && 'pointer-events-none opacity-70',
            )}
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPage(prev?.url ?? null)}
                disabled={!prev?.url || isPending}
                className="gap-1"
                aria-label="Previous page"
            >
                <ChevronLeft className="size-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
            </Button>

            <div className="flex items-center gap-1">
                {data.links.filter((l) => !l.label.includes('Prev') && !l.label.includes('Next')).map((link, idx) => (
                    <button
                        key={`${link.label}-${idx}`}
                        onClick={() => onPage(link.url)}
                        disabled={!link.url || isPending}
                        aria-current={link.active ? 'page' : undefined}
                        className={cn(
                            'inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-sm font-medium transition-colors',
                            link.active
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-foreground hover:bg-muted',
                            !link.url && 'cursor-not-allowed opacity-40',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPage(next?.url ?? null)}
                disabled={!next?.url || isPending}
                className="gap-1"
                aria-label="Next page"
            >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="size-4" />
            </Button>
        </nav>
    );
}

export default function HydrantIndex({ hydrantdata, filters, filterOptions }: Props) {
    const [isPending, startTransition] = useTransition();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [currentRow, setCurrentRow] = useState<Hydrant | undefined>();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteRow, setDeleteRow] = useState<Hydrant | null>(null);
    const [lantaiList, setLantaiList] = useState<string[]>(filterOptions.lantai);
    const topRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/fire-safety/hydrant/filter-options')
            .then((res) => res.json())
            .then((data) => setLantaiList(data.lantai ?? filterOptions.lantai))
            .catch(() => {});
    }, []);

    const handleSearch = (next: { search: string; tipe: string; lantai: string }) => {
        const params = new URLSearchParams();
        if (next.search) params.set('search', next.search);
        if (next.tipe) params.set('tipe', next.tipe);
        if (next.lantai) params.set('lantai', next.lantai);
        startTransition(() => {
            router.get(`/fire-safety/hydrant${params.toString() ? `?${params.toString()}` : ''}`, {}, {
                preserveScroll: true,
                preserveState: false,
                onSuccess: () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
            });
        });
    };

    const handlePage = (url: string | null) => {
        if (!url) return;
        startTransition(() => {
            router.get(url, {}, {
                preserveScroll: false,
                preserveState: false,
            });
        });
    };

    const openAdd = () => { setCurrentRow(undefined); setDialogMode('add'); setDialogOpen(true); };
    const openEdit = (h: Hydrant) => { setCurrentRow(h); setDialogMode('edit'); setDialogOpen(true); };
    const openDelete = (h: Hydrant) => { setDeleteRow(h); setDeleteOpen(true); };

    const dialFill = 72;
    const dialCirc = 2 * Math.PI * 15.5;

    return (
        <>
            <Head title="Data Hydrant" />
            <div ref={topRef} className="space-y-5 sm:space-y-6">
                {/* ── Hero (glass, floating) ── */}
                <section className="glass-panel relative overflow-hidden px-4 py-5 sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
                    <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="neu-dial relative grid h-16 w-16 shrink-0 place-items-center rounded-full sm:h-20 sm:w-20">
                                <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(195,204,212,0.55)" strokeWidth="3" />
                                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#4db8e8" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${(dialFill / 100) * dialCirc} ${dialCirc}`} />
                                </svg>
                                <span className="text-lg font-bold text-foreground sm:text-xl">{hydrantdata.total}</span>
                            </div>
                            <div className="min-w-0">
                                <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    <Droplet className="size-5 text-primary sm:size-6" />
                                    Data Hydrant
                                </h1>
                                <p className="mt-1 text-xs text-muted-foreground/70 sm:text-sm">
                                    Kelola data hydrant gedung &middot; {hydrantdata.total} unit total
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {HasAnyPermission(['hydrant.create']) && (
                                <Button asChild variant="outline" className="neu-btn hidden sm:inline-flex">
                                    <Link href="/fire-safety/hydrant/upload-excel">
                                        <FileSpreadsheet className="size-4" />
                                        Import Excel
                                    </Link>
                                </Button>
                            )}
                            {HasAnyPermission(['hydrant.create']) && (
                                <Button onClick={openAdd} className="btn-soft-primary gap-2">
                                    <Plus className="size-4" />
                                    Tambah Hydrant
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Stat strip ── */}
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-y-3 duration-400 delay-50">
                    <div className="neu-card flex items-center gap-3 rounded-2xl p-3 sm:p-4">
                        <div className="neu-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white sm:h-10 sm:w-10">
                            <Droplet className="size-4 sm:size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:text-xs">Total Unit</p>
                            <p className="truncate text-base font-bold text-foreground sm:text-lg">{hydrantdata.total}</p>
                        </div>
                    </div>
                    <div className="neu-card flex items-center gap-3 rounded-2xl p-3 sm:p-4">
                        <div className="neu-icon grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white sm:h-10 sm:w-10">
                            <Layers className="size-4 sm:size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:text-xs">Halaman</p>
                            <p className="truncate text-base font-bold text-foreground sm:text-lg">{hydrantdata.current_page}/{hydrantdata.last_page}</p>
                        </div>
                    </div>
                </div>

                <FilterCard filters={filters} filterOptions={filterOptions} isPending={isPending} onSearch={handleSearch} />
                <BulkPrintSection lantaiList={lantaiList} batchCount={Math.max(1, Math.ceil(hydrantdata.total / 30))} />

                {/* ── Results info ── */}
                <div className="flex items-center justify-between gap-3 px-1 text-xs text-muted-foreground sm:text-sm">
                    <p>
                        {hydrantdata.from !== null && hydrantdata.to !== null ? (
                            <>Menampilkan <span className="font-semibold text-foreground">{hydrantdata.from}</span> -{' '}
                            <span className="font-semibold text-foreground">{hydrantdata.to}</span> dari{' '}
                            <span className="font-semibold text-foreground">{hydrantdata.total}</span></>
                        ) : <>Tidak ada data</>}
                    </p>
                    {isPending && (
                        <span className="flex items-center gap-1.5 text-primary">
                            <LoaderCircle className="size-4 animate-spin" />
                            <span className="hidden sm:inline">Memuat...</span>
                        </span>
                    )}
                </div>

                {/* ── Grid ── */}
                {hydrantdata.data.length === 0 && !isPending ? (
                    <Card className="neu-card animate-in fade-in">
                        <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-muted-foreground/50 sm:py-16">
                            <svg className="size-12 text-muted-foreground/20 sm:size-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">Tidak ada data Hydrant</p>
                            <p className="text-xs">Coba ubah filter atau tambah data baru</p>
                        </div>
                    </Card>
                ) : (
                    <div
                        className={cn(
                            'grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4',
                            'transition-opacity duration-200',
                            isPending && 'opacity-60',
                        )}
                        aria-busy={isPending}
                    >
                        {isPending
                            ? Array.from({ length: 4 }).map((_, i) => <HydrantCardSkeleton key={`sk-${i}`} />)
                            : hydrantdata.data.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="animate-in fade-in slide-in-from-y-3 duration-300"
                                    style={{ animationDelay: `${Math.min(index * 35, 350)}ms` }}
                                >
                                    <HydrantCard item={item} isLoading={isPending} onEdit={openEdit} onDelete={openDelete} />
                                </div>
                            ))}
                    </div>
                )}

                <Pagination data={hydrantdata} isPending={isPending} onPage={handlePage} />
            </div>

            <HydrantActionDialog currentRow={currentRow} open={dialogOpen} onOpenChange={setDialogOpen} />
            {deleteRow && (
                <HydrantDeleteDialog currentRow={deleteRow} open={deleteOpen} onOpenChange={setDeleteOpen} />
            )}
        </>
    );
}