import { Head, Link, router, useForm } from '@inertiajs/react';
import { Shield, KeyRound, ShieldCheck, Plus, LoaderCircle, ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface PermissionGroup {
    [group: string]: Array<{ id: number; name: string }>;
}

interface Props {
    permissions: PermissionGroup;
    guards: string[];
    flash?: { error?: string };
}

export default function RoleCreate({ permissions, guards, flash }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as number[],
    });

    useEffect(() => {
        if (flash?.error) {
toast.error(flash.error);
}
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/role-management', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Role berhasil dibuat.');
                router.visit('/role-management');
            },
        });
    };

    const handlePermissionToggle = (permissionId: number) => {
        const current = data.permissions as number[];
        const isChecked = current.includes(permissionId);

        setData('permissions', isChecked
            ? current.filter((id) => id !== permissionId)
            : [...current, permissionId]);
    };

    const selectAllPermissions = () => {
        const allIds = Object.values(permissions).flatMap((p) => p.map((perm) => perm.id));
        setData('permissions', allIds);
    };

    const clearAllPermissions = () => {
        setData('permissions', []);
    };

    const RoleBadgeColors: Record<string, string> = {
        superadmin: 'bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/20',
        admin: 'bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20',
        petugas: 'bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20',
        staff: 'bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/20',
    };

    const getBadgeClass = (group: string) => {
        return RoleBadgeColors[group] ?? 'bg-slate-500/10 text-slate-600 ring-1 ring-slate-500/20';
    };

    const getGroupIcon = (group: string) => {
        if (group === 'superadmin') {
return <ShieldCheck className="h-3.5 w-3.5" />;
}

        if (group === 'admin') {
return <Shield className="h-3.5 w-3.5" />;
}

        if (group === 'user' || group === 'users') {
return <KeyRound className="h-3.5 w-3.5" />;
}

        return <KeyRound className="h-3.5 w-3.5" />;
    };

    return (
        <AppLayout>
            <Head title="Tambah Role" />
            <div className="flex flex-col gap-4 px-1 sm:px-0">
                {/* Page Header */}
                <section className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/80 px-4 py-5 backdrop-blur-md sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-lg">
                                <Shield className="size-5" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold tracking-tight text-foreground">Tambah Role Baru</h1>
                                <p className="text-xs text-muted-foreground/70">Definisikan nama role dan pilih hak aksesnya</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/role-management">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Kembali
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Form Card */}
                <Card className="border-border/40 animate-in fade-in slide-in-from-y-3 duration-400 delay-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="size-4 text-primary" />
                            Form Role
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/70">
                            Isi nama role dan pilih guard. Pilih izin yang akan diberikan ke role ini.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <CardContent className="space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4 rounded-xl border border-border/40 bg-muted/30 p-4 sm:p-6">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <KeyRound className="size-4 text-primary" />
                                    Informasi Dasar
                                </h3>

                                <div className="grid gap-2 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nama Role <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: manager_gudang"
                                            className={cn(errors.name && 'border-destructive')}
                                            disabled={processing}
                                        />
                                        {errors.name && (
                                            <p className="text-xs text-destructive">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guard_name">Guard <span className="text-destructive">*</span></Label>
                                        <Select
                                            value={data.guard_name}
                                            onValueChange={(v) => setData('guard_name', v)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Pilih Guard" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {guards.map((g) => (
                                                    <SelectItem key={g} value={g}>
                                                        {g}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.guard_name && (
                                            <p className="text-xs text-destructive">{errors.guard_name}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Selection */}
                            <div className="space-y-4 rounded-xl border border-border/40 bg-muted/30 p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <ShieldCheck className="size-4 text-primary" />
                                        Hak Akses (Permissions)
                                    </h3>
                                    <div className="flex gap-1.5">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={selectAllPermissions}
                                            className="gap-1.5"
                                        >
                                            <Plus className="size-3.5" />
                                            Pilih Semua
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearAllPermissions}
                                            className="gap-1.5"
                                        >
                                            Hapus Semua
                                        </Button>
                                    </div>
                                </div>

                                {errors.permissions && (
                                    <p className="text-xs text-destructive">{errors.permissions}</p>
                                )}

                                <div className="space-y-3">
                                    {Object.entries(permissions).map(([group, perms], groupIndex) => (
                                        <div key={groupIndex} className="rounded-lg border border-border/40 bg-background/50 p-3 sm:p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                                <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                                    <Badge className={cn('rounded-full px-2 py-0.5 text-[10px]', getBadgeClass(group))}>
                                                        {getGroupIcon(group)}
                                                        <span className="ml-1 capitalize">{group}</span>
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{perms.length} izin</span>
                                                </h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {perms.map((perm) => {
                                                    const isChecked = (data.permissions as number[]).includes(perm.id);

                                                    return (
                                                        <label
                                                            key={perm.id}
                                                            className={cn(
                                                                'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition-all duration-150 cursor-pointer',
                                                                isChecked
                                                                    ? 'bg-primary/10 text-primary border-primary/30 ring-1 ring-primary/20'
                                                                    : 'bg-background border-border/40 hover:bg-muted/50 text-foreground',
                                                            )}>
                                                            <Checkbox
                                                                checked={isChecked}
                                                                onCheckedChange={() => handlePermissionToggle(perm.id)}
                                                                className="translate-y-[1px]"
                                                            />
                                                            <span className="truncate max-w-[200px]">{perm.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {Object.keys(permissions).length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Shield className="mx-auto size-8 text-muted-foreground/30 mb-2" />
                                        <p className="text-sm">Tidak ada permission tersedia.</p>
                                        <p className="text-xs mt-1">Buat permission terlebih dahulu di halaman Permission Management.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-border/40">
                            <Button variant="outline" asChild>
                                <Link href="/role-management">
                                    <ArrowLeft className="mr-2 size-4" />
                                    Kembali
                                </Link>
                            </Button>
                            <Button type="submit" disabled={processing} className="gap-2 w-full sm:w-auto">
                                {processing && <LoaderCircle className="size-4 animate-spin" />}
                                <ShieldCheck className="size-4" />
                                Simpan Role
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}