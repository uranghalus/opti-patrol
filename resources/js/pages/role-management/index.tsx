import { Head, Link, router } from '@inertiajs/react';
import {
    Copy,
    Download,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Shield,
    ShieldCheck,
    Trash2,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    KeyRound,
    RefreshCw,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { cn } from '@/lib/utils';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    permissions_count: number;
    permissions: Array<{ id: number; name: string }>;
    created_at: string;
    updated_at: string;
}

interface PaginationLinks {
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
    links: PaginationLinks[];
}

interface Props {
    roles: PaginatedData<Role>;
    filters: { search?: string; guard?: string; per_page?: number };
    guards: string[];
    flash?: { success?: string; error?: string };
}

const RoleBadgeColors: Record<string, string> = {
    superadmin: 'bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20',
    admin: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
    petugas: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
    staff: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20',
    default: 'bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20',
};

function getRoleBadge(name: string): { class: string; icon: React.ReactNode } {
    if (name === 'superadmin') {
        return { class: RoleBadgeColors.superadmin, icon: <ShieldCheck className="h-3 w-3" /> };
    }

    if (name === 'admin') {
        return { class: RoleBadgeColors.admin, icon: <Shield className="h-3 w-3" /> };
    }

    return {
        class: RoleBadgeColors[name] ?? RoleBadgeColors.default,
        icon: <KeyRound className="h-3 w-3" />,
    };
}

export default function RoleIndex({ roles, filters, guards, flash }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [guard, setGuard] = useState(filters.guard ?? '');
    const [perPage, setPerPage] = useState(filters.per_page ?? 15);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const applyFilters = useCallback(
        (params: { search?: string; guard?: string; per_page?: number }) => {
            const queryString = new URLSearchParams();

            if (params.search) {
                queryString.set('search', params.search);
            }

            if (params.guard) {
                queryString.set('guard', params.guard);
            }

            if (params.per_page && params.per_page !== 15) {
                queryString.set('per_page', String(params.per_page));
            }

            const url = '/role-management' + (queryString.toString() ? `?${queryString.toString()}` : '');

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
        },
        [],
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({ search, guard, per_page: perPage });
    };

    const handleReset = () => {
        setSearch('');
        setGuard('');
        setPerPage(15);
        applyFilters({ search: '', guard: '', per_page: 15 });
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
        applyFilters({ search, guard, per_page: newPerPage });
    };

    const handleDelete = (id: number, name: string) => {
        if (!confirm(`Yakin ingin menghapus role "${name}"?`)) {
            return;
        }

        router.delete(`/role-management/${id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Role berhasil dihapus.'),
        });
    };

    const handleClone = (id: number) => {
        router.post(
            `/role-management/${id}/clone`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Role berhasil diduplikasi.'),
            },
        );
    };

    const handleBulkDelete = () => {
        setIsDeleting(true);
        router.post(
            '/role-management/bulk-delete',
            { ids: selectedIds },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${selectedIds.length} Role berhasil dihapus.`);
                    setSelectedIds([]);
                    setShowBulkDelete(false);
                },
                onError: () => toast.error('Gagal menghapus role.'),
                onFinish: () => setIsDeleting(false),
            },
        );
    };

    const handleExport = () => {
        window.location.href = '/role-management/export?' + new URLSearchParams({
            ...(search && { search }),
            ...(guard && { guard }),
        }).toString();
    };

    const allSelected = useMemo(
        () => roles.data.length > 0 && selectedIds.length === roles.data.length,
        [selectedIds, roles.data],
    );

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(roles.data.map((r) => r.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const hasActiveFilters = !!(search || guard);

    const startPage = Math.max(1, roles.current_page - 2);
    const endPage = Math.min(roles.last_page, startPage + 4);
    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
        <>
            <Head title="Role Management" />

            <div className="space-y-5 px-1 sm:px-0">
                {/* Hero Header */}
                <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 px-4 py-5 backdrop-blur-md sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg sm:h-14 sm:w-14">
                                <Shield className="size-5 sm:size-6" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Role Management</h1>
                                <p className="text-xs text-muted-foreground/70 sm:text-sm">
                                    Kelola peran dan hak akses pengguna
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                                <Download className="size-4" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                            <Button asChild size="sm" className="gap-2">
                                <Link href="/role-management/create">
                                    <Plus className="size-4" />
                                    <span className="hidden sm:inline">Tambah Role</span>
                                    <span className="sm:hidden">Tambah</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-in fade-in slide-in-from-y-3 duration-400 delay-50">
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                                    <Shield className="size-4 sm:size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground/70">Total Role</p>
                                    <p className="text-base sm:text-lg font-bold">{roles.total}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-purple-500/10 text-purple-600">
                                    <ShieldCheck className="size-4 sm:size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground/70">Super Admin</p>
                                    <p className="text-base sm:text-lg font-bold">
                                        {roles.data.filter((r) => r.name === 'superadmin').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-600">
                                    <KeyRound className="size-4 sm:size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground/70">Total Izin</p>
                                    <p className="text-base sm:text-lg font-bold">
                                        {roles.data.reduce((sum, r) => sum + r.permissions_count, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-border/40 bg-card/80">
                        <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="grid h-8 w-8 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-600">
                                    <Filter className="size-4 sm:size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs text-muted-foreground/70">Halaman</p>
                                    <p className="text-base sm:text-lg font-bold">{roles.current_page}/{roles.last_page}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="border-border/40 animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="size-4 text-primary" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row sm:items-end">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/40" />
                                <Input
                                    placeholder="Cari nama role..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 pl-9 sm:h-10"
                                />
                            </div>
                            <Select value={guard || 'all'} onValueChange={(v) => setGuard(v === 'all' ? '' : v)}>
                                <SelectTrigger className="h-11 w-full sm:h-10 sm:w-[180px]">
                                    <SelectValue placeholder="Semua Guard" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Guard</SelectItem>
                                    {guards.map((g) => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <div className="flex gap-2">
                                {hasActiveFilters && (
                                    <Button type="button" variant="ghost" onClick={handleReset} className="h-11 gap-1.5 text-destructive hover:bg-destructive/5 sm:h-10">
                                        <X className="size-4" />
                                        Reset
                                    </Button>
                                )}
                                <Button type="submit" disabled={isLoading} className="h-11 gap-2 sm:h-10 sm:min-w-[120px]">
                                    {isLoading ? (
                                        <RefreshCw className="size-4 animate-spin" />
                                    ) : (
                                        <Search className="size-4" />
                                    )}
                                    Terapkan
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                    <Alert className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-200">
                        <ShieldCheck className="size-4" />
                        <AlertTitle className="text-sm font-medium">
                            {selectedIds.length} role dipilih
                        </AlertTitle>
                        <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">Pilih aksi untuk role yang dipilih.</span>
                            <div className="flex gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedIds([])}
                                >
                                    Batal
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setShowBulkDelete(true)}
                                    className="gap-1.5"
                                >
                                    <Trash2 className="size-4" />
                                    Hapus
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Table */}
                <Card className="border-border/40 overflow-hidden animate-in fade-in duration-400 delay-150">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[40px] sm:w-[50px]">
                                        <Checkbox
                                            checked={allSelected}
                                            onCheckedChange={toggleSelectAll}
                                            aria-label="Pilih semua"
                                        />
                                    </TableHead>
                                    <TableHead className="min-w-[160px]">Role</TableHead>
                                    <TableHead className="hidden md:table-cell w-[100px]">Guard</TableHead>
                                    <TableHead className="hidden lg:table-cell min-w-[280px]">Permissions</TableHead>
                                    <TableHead className="hidden sm:table-cell w-[100px] text-center">Jumlah</TableHead>
                                    <TableHead className="w-[60px] text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {roles.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                                                <Shield className="size-10 text-muted-foreground/20" />
                                                <p className="text-sm">Tidak ada data role</p>
                                                <p className="text-xs">Coba ubah filter atau tambah role baru</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    roles.data.map((role) => {
                                        const badge = getRoleBadge(role.name);
                                        const isSuperadmin = role.name === 'superadmin';

                                        return (
                                            <TableRow key={role.id} className="group">
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedIds.includes(role.id)}
                                                        onCheckedChange={() => toggleSelect(role.id)}
                                                        aria-label={`Pilih ${role.name}`}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Badge className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0', badge.class)}>
                                                            {badge.icon}
                                                            <span className="ml-1">{role.name}</span>
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <Badge variant="outline" className="font-mono text-xs">{role.guard_name}</Badge>
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {isSuperadmin ? (
                                                            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600">
                                                                <ShieldCheck className="mr-1 size-3" />
                                                                all-permissions
                                                            </Badge>
                                                        ) : role.permissions.length === 0 ? (
                                                            <span className="text-xs text-muted-foreground italic">Tidak ada izin</span>
                                                        ) : (
                                                            <>
                                                                {role.permissions.slice(0, 3).map((p) => (
                                                                    <Badge key={p.id} variant="outline" className="text-xs font-normal">
                                                                        {p.name}
                                                                    </Badge>
                                                                ))}
                                                                {role.permissions.length > 3 && (
                                                                    <Badge variant="outline" className="text-xs font-normal bg-muted">
                                                                        +{role.permissions.length - 3} lainnya
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden sm:table-cell text-center">
                                                    <Badge variant="secondary" className="font-mono">
                                                        {role.permissions_count}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-44">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/role-management/${role.id}/edit`} className="cursor-pointer">
                                                                    <Shield className="mr-2 size-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleClone(role.id)}>
                                                                <Copy className="mr-2 size-4" />
                                                                Duplikasi
                                                            </DropdownMenuItem>
                                                            {!isSuperadmin && (
                                                                <>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDelete(role.id, role.name)}
                                                                        className="text-destructive focus:text-destructive"
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
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>

                {/* Pagination */}
                {roles.total > 0 && (
                    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-border/40 bg-card/80 p-3 backdrop-blur-md sm:flex-row sm:items-center sm:gap-0">
                        <p className="text-xs text-muted-foreground sm:text-sm">
                            Menampilkan <span className="font-semibold text-foreground">{roles.from ?? 0}</span> -{' '}
                            <span className="font-semibold text-foreground">{roles.to ?? 0}</span> dari{' '}
                            <span className="font-semibold text-foreground">{roles.total}</span> role
                        </p>
                        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                            <div className="flex items-center gap-2 sm:hidden">
                                <Label className="text-xs">Per halaman:</Label>
                                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 15, 25, 50, 100].map((n) => (
                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="hidden sm:flex items-center gap-2">
                                <Label className="text-xs">Per halaman:</Label>
                                <Select value={String(perPage)} onValueChange={handlePerPageChange}>
                                    <SelectTrigger className="h-8 w-[70px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[10, 15, 25, 50, 100].map((n) => (
                                            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(roles.links.find((l) => l.label.includes('Previous'))?.url ?? null)}
                                    disabled={!roles.links.find((l) => l.label.includes('Previous'))?.url}
                                >
                                    <ChevronsLeft className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(roles.links.find((l) => l.label === '&laquo; Previous')?.url ?? null)}
                                    disabled={!roles.links.find((l) => l.label === '&laquo; Previous')?.url}
                                >
                                    <ChevronLeft className="size-4" />
                                </Button>
                                <div className="hidden items-center gap-1 sm:flex">
                                    {pageNumbers.map((n) => {
                                        const link = roles.links.find((l) => l.label === String(n));

                                        return (
                                            <Button
                                                key={n}
                                                variant={n === roles.current_page ? 'default' : 'ghost'}
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => handlePageChange(link?.url ?? null)}
                                                disabled={!link?.url}
                                            >
                                                {n}
                                            </Button>
                                        );
                                    })}
                                </div>
                                <span className="px-2 text-sm font-medium sm:hidden">
                                    {roles.current_page} / {roles.last_page}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(roles.links.find((l) => l.label === 'Next &raquo;')?.url ?? null)}
                                    disabled={!roles.links.find((l) => l.label === 'Next &raquo;')?.url}
                                >
                                    <ChevronRight className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handlePageChange(roles.links.find((l) => l.label.includes('Next'))?.url ?? null)}
                                    disabled={!roles.links.find((l) => l.label.includes('Next'))?.url}
                                >
                                    <ChevronsRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bulk Delete Confirmation */}
            <AlertDialog open={showBulkDelete} onOpenChange={setShowBulkDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus {selectedIds.length} Role?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Role yang terkait dengan izin akan kehilangan hak aksesnya.
                            Role <strong>superadmin</strong> tidak akan dihapus.
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
        </>
    );
}
