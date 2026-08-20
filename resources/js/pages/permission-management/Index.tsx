import { Head, Link, router } from '@inertiajs/react';
import {
    Download,
    Filter,
    KeyRound,
    Layers,
    MoreHorizontal,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Trash2,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { HasAnyPermission } from '@/lib/permission';
import { cn } from '@/lib/utils';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    roles_count: number;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    permissions: {
        data: Permission[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number | null;
        to: number | null;
        links: PaginationLinks[];
    };
    filters: { search?: string; guard?: string; group?: string; per_page?: number };
    guards: string[];
    groups: string[];
    flash?: { success?: string; error?: string };
}

const GUARD_COLORS: Record<string, string> = {
    web: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
    api: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
};

export default function PermissionIndex({ permissions, filters, guards, groups, flash }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [guard, setGuard] = useState(filters.guard ?? '');
    const [group, setGroup] = useState(filters.group ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 20);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, startTransition] = useTransition();

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const applyFilters = useCallback((params: { search?: string; guard?: string; group?: string; per_page?: number }) => {
        const queryString = new URLSearchParams();

        if (params.search) {
            queryString.set('search', params.search);
        }

        if (params.guard) {
            queryString.set('guard', params.guard);
        }

        if (params.group) {
            queryString.set('group', params.group);
        }

        if (params.per_page && params.per_page !== 20) {
            queryString.set('per_page', String(params.per_page));
        }

        const url = '/permission-management' + (queryString.toString() ? `?${queryString.toString()}` : '');

        startTransition(() => {
            setIsLoading(true);
            router.get(
                url,
                {},
                {
                    preserveScroll: true,
                    preserveState: false,
                    onFinish: () => setIsLoading(false),
                },
            );
        });
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search, guard, group, per_page: perPage });
    };

    const handleReset = () => {
        setSearch('');
        setGuard('');
        setGroup('');
        setPerPage(20);
        applyFilters({ search: '', guard: '', group: '', per_page: 20 });
    };

    const handlePageChange = (url: string | null) => {
        if (!url) {
            return;
        }

        startTransition(() => {
            setIsLoading(true);
            router.get(
                url,
                {},
                {
                    preserveScroll: true,
                    preserveState: false,
                    onFinish: () => setIsLoading(false),
                },
            );
        });
    };

    const handlePerPageChange = (value: string) => {
        const newPerPage = Number(value);
        setPerPage(newPerPage);
        applyFilters({ search, guard, group, per_page: newPerPage });
    };

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Yakin ingin menghapus permission "${name}"?`)) {
            return;
        }

        router.delete(`/permission-management/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Permission berhasil dihapus.'),
        });
    };

    const handleBulkDelete = () => {
        setIsDeleting(true);
        router.post(
            '/permission-management/bulk-delete',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${selectedIds.length} Permission berhasil dihapus.`);
                    setSelectedIds([]);
                    setShowBulkDelete(false);
                },
                onError: () => toast.error('Gagal menghapus permission.'),
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const handleExport = () => {
        window.location.href =
            '/permission-management/export?' +
            new URLSearchParams({
                ...(search && { search }),
                ...(guard && { guard }),
                ...(group && { group }),
            }).toString();
    };

    const allSelected = selectedIds.length > 0 && selectedIds.length === permissions.data.length;

    const toggleSelectAll = () => {
        setSelectedIds(allSelected ? [] : permissions.data.map((p) => p.id));
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const hasActiveFilters = !!(search || guard || group);

    const dialFill = permissions.total > 0 ? Math.min(100, Math.round((permissions.data.length / permissions.per_page) * 100)) : 0;
    const dialCirc = 2 * Math.PI * 15.5;

    return (
        <AppLayout>
            <Head title="Permission Management" />

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
                                <span className="text-xl font-bold text-foreground">{permissions.total}</span>
                            </div>
                            <div>
                                <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    <KeyRound className="size-6 text-primary" />
                                    Permission Management
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground/70">
                                    Kelola izin akses sistem &middot; {permissions.data.length} izin di halaman ini
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {HasAnyPermission(['permissions export']) && (
                                <Button variant="ghost" onClick={handleExport} className="neu-btn">
                                    <Download className="size-4" />
                                    <span className="hidden sm:inline">Export</span>
                                </Button>
                            )}
                            {HasAnyPermission(['permissions create']) && (
                                <Link href="/permission-management/create">
                                    <Button className="gap-2 btn-soft-primary active:scale-[0.98]">
                                        <Plus className="size-4" />
                                        Tambah Permission
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Stat strip (neumorphic) ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {[
                        { label: 'Total Izin', value: permissions.total, icon: KeyRound },
                        { label: 'Grup Modul', value: groups.length, icon: Layers },
                        { label: 'Halaman', value: `${permissions.current_page}/${permissions.last_page}`, icon: ShieldCheck },
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

                {/* ── Filters (neumorphic card) ── */}
                <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-75">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="size-4 text-primary" />
                            Filter &amp; Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 lg:flex-row lg:items-end">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                <Input
                                    placeholder="Cari nama permission..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 pl-9 neu-card border-border/50 bg-white/50 focus:border-primary/50 lg:h-10"
                                />
                            </div>
                            <Select value={guard || 'all'} onValueChange={(v) => setGuard(v === 'all' ? '' : v)}>
                                <SelectTrigger className="h-11 w-full neu-card border-border/50 bg-white/50 focus:border-primary/50 lg:h-10 lg:w-[160px]">
                                    <SelectValue placeholder="Semua Guard" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all" className="neu-dropdown-item">Semua Guard</SelectItem>
                                    {guards.map((g) => (
                                        <SelectItem key={g} value={g} className="neu-dropdown-item">{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={group || 'all'} onValueChange={(v) => setGroup(v === 'all' ? '' : v)}>
                                <SelectTrigger className="h-11 w-full neu-card border-border/50 bg-white/50 focus:border-primary/50 lg:h-10 lg:w-[180px]">
                                    <SelectValue placeholder="Semua Grup" />
                                </SelectTrigger>
                                <SelectContent className="neu-dropdown">
                                    <SelectItem value="all" className="neu-dropdown-item">Semua Grup</SelectItem>
                                    {groups.map((g) => (
                                        <SelectItem key={g} value={g} className="neu-dropdown-item">{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleReset}
                                        className="neu-btn h-11 gap-1.5 !text-destructive hover:!border-destructive/50 hover:!bg-destructive/5 lg:h-10"
                                    >
                                        <X className="size-4" />
                                        Reset
                                    </Button>
                                )}
                                <Button type="submit" disabled={isLoading} className="h-11 gap-2 btn-soft-primary active:scale-[0.98] lg:h-10 lg:min-w-[120px]">
                                    {isLoading ? <RefreshCw className="size-4 animate-spin" /> : <Search className="size-4" />}
                                    Terapkan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* ── Bulk actions bar ── */}
                {selectedIds.length > 0 && (
                    <div className="glass-panel flex flex-wrap items-center justify-between gap-3 px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        <p className="text-sm font-medium text-foreground">
                            <span className="font-bold text-primary">{selectedIds.length}</span> permission dipilih
                        </p>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])} className="neu-btn h-8">
                                Batal
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setShowBulkDelete(true)}
                                className="gap-1.5 rounded-xl shadow-[4px_4px_12px_rgba(195,204,212,0.4)]"
                            >
                                <Trash2 className="size-4" />
                                Hapus
                            </Button>
                        </div>
                    </div>
                )}

                {/* ── Results info ── */}
                <div className="flex items-center justify-between text-sm text-muted-foreground animate-in fade-in duration-300">
                    <p>
                        {permissions.from !== null && permissions.to !== null ? (
                            <>
                                Menampilkan <span className="font-semibold text-foreground">{permissions.from}</span> -{' '}
                                <span className="font-semibold text-foreground">{permissions.to}</span> dari{' '}
                                <span className="font-semibold text-foreground">{permissions.total}</span> permission
                            </>
                        ) : (
                            <>Tidak ada data</>
                        )}
                    </p>
                    {isLoading && (
                        <span className="flex items-center gap-1.5 text-sm text-primary">
                            <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                            </svg>
                            Memuat...
                        </span>
                    )}
                </div>

                {/* ── Table (neumorphic card) ── */}
                <Card className="neu-card overflow-hidden animate-in fade-in duration-400 delay-100">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[40px] sm:w-[50px]">
                                        <Checkbox checked={allSelected} onCheckedChange={toggleSelectAll} aria-label="Pilih semua" />
                                    </TableHead>
                                    <TableHead className="min-w-[200px]">Permission</TableHead>
                                    <TableHead className="w-[100px]">Guard</TableHead>
                                    <TableHead className="hidden w-[120px] text-center sm:table-cell">Dipakai Role</TableHead>
                                    <TableHead className="hidden w-[140px] md:table-cell">Dibuat</TableHead>
                                    <TableHead className="w-[60px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                                                <KeyRound className="size-10 text-muted-foreground/20" />
                                                <p className="text-sm">Tidak ada data permission</p>
                                                <p className="text-xs">Coba ubah filter atau tambah permission baru</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    permissions.data.map((permission) => (
                                        <TableRow key={permission.id} className="group">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(permission.id)}
                                                    onCheckedChange={() => toggleSelect(permission.id)}
                                                    aria-label={`Pilih ${permission.name}`}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-mono text-sm font-medium text-foreground">{permission.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        'rounded-full px-2.5 py-0.5 text-xs font-medium',
                                                        GUARD_COLORS[permission.guard_name] ??
                                                            'bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20',
                                                    )}
                                                >
                                                    {permission.guard_name}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden text-center sm:table-cell">
                                                <Badge variant="secondary" className="neu-well border-0 font-mono text-foreground">
                                                    {permission.roles_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                                                {new Date(permission.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 neu-dropdown-item">
                                                            <MoreHorizontal className="size-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-44 neu-dropdown">
                                                        {HasAnyPermission(['permissions edit']) && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/permission-management/${permission.id}/edit`} className="neu-dropdown-item">
                                                                    <Pencil className="mr-2 size-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {HasAnyPermission(['permissions delete']) && (
                                                            <>
                                                                <DropdownMenuSeparator className="my-1 border-border/50" />
                                                                <DropdownMenuItem
                                                                    className="neu-dropdown-item text-destructive focus:text-destructive"
                                                                    onClick={() => handleDelete(permission.id, permission.name)}
                                                                >
                                                                    <Trash2 className="mr-2 size-4" />
                                                                    Hapus
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* ── Pagination ── */}
                {permissions.last_page > 1 && (
                    <Card className="neu-card animate-in fade-in">
                        <div className="flex flex-col items-center justify-between gap-3 p-4 sm:flex-row">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs text-muted-foreground">Per halaman:</Label>
                                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-8 w-[70px] neu-card border-border/50 bg-white/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="neu-dropdown">
                                        {[10, 20, 50, 100].map((n) => (
                                            <SelectItem key={n} value={String(n)} className="neu-dropdown-item">{n}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
                                {permissions.links.map((link) =>
                                    link.url ? (
                                        <button
                                            key={link.label}
                                            type="button"
                                            onClick={() => handlePageChange(link.url)}
                                            className={cn(
                                                'insp-pagination-btn neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5',
                                                link.active && 'insp-pagination-btn-active',
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={link.label}
                                            className="insp-pagination-btn neu-card cursor-not-allowed border-border/50 opacity-50"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ),
                                )}
                            </nav>
                        </div>
                    </Card>
                )}
            </div>

            {/* Bulk delete confirmation */}
            <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
                <AlertDialogContent className="glass-panel">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus {selectedIds.length} Permission?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Role yang memakai permission ini akan kehilangan hak aksesnya.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleBulkDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Semua'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
