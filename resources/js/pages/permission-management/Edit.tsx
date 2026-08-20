import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Shield, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
}

interface Props {
    permission: Permission;
    guards: string[];
    flash?: { error?: string };
}

export default function PermissionEdit({ permission, guards, flash }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: permission.name,
        guard_name: permission.guard_name,
    });

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/permission-management/${permission.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Permission berhasil diperbarui.');
                router.visit('/permission-management');
            },
        });
    };

    return (
        <AppLayout>
            <Head title={`Edit: ${permission.name}`} />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* ── Hero (glass, floating) ── */}
                <section className="glass-panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="neu-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white sm:h-14 sm:w-14">
                                <ShieldCheck className="size-5 sm:size-6" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Edit Permission</h1>
                                <p className="mt-0.5 text-xs text-muted-foreground/70 sm:text-sm">Perbarui nama permission dan guard</p>
                            </div>
                        </div>
                        <Link href="/permission-management">
                            <Button variant="ghost" className="neu-btn">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* ── Form (neumorphic card) ── */}
                <Card className="neu-card border-0 shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <ShieldCheck className="size-4 text-primary" />
                            Form Edit Permission
                        </CardTitle>
                        <CardDescription className="text-muted-foreground/70">
                            Perbarui nama permission dan guard. Format:{' '}
                            <code className="neu-well rounded px-1.5 py-0.5 text-xs text-foreground">prefix action</code>
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <CardContent className="space-y-6">
                            <div className="neu-well space-y-4 p-4 sm:p-6">
                                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <ShieldCheck className="size-4 text-primary" />
                                    Informasi Permission
                                </h3>

                                <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nama Permission <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Contoh: users create"
                                            className={cn(
                                                'neu-card border-border/50 bg-white/50 focus:border-primary/50',
                                                errors.name && 'border-destructive',
                                            )}
                                            disabled={processing}
                                        />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="guard_name">
                                            Guard <span className="text-destructive">*</span>
                                        </Label>
                                        <Select value={data.guard_name} onValueChange={(v) => setData('guard_name', v)}>
                                            <SelectTrigger className="neu-card border-border/50 bg-white/50 focus:border-primary/50">
                                                <SelectValue placeholder="Pilih Guard" />
                                            </SelectTrigger>
                                            <SelectContent className="neu-dropdown">
                                                {guards.map((g) => (
                                                    <SelectItem key={g} value={g} className="neu-dropdown-item">{g}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.guard_name && <p className="text-xs text-destructive">{errors.guard_name}</p>}
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col items-start justify-between gap-3 border-t border-border/40 pt-4 sm:flex-row sm:items-center">
                            <Link href="/permission-management">
                                <Button type="button" variant="ghost" className="neu-btn">
                                    <ArrowLeft className="size-4" />
                                    Kembali
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing} className="gap-2 btn-soft-primary active:scale-[0.98] w-full sm:w-auto">
                                {processing && <LoaderCircle className="size-4 animate-spin" />}
                                <ShieldCheck className="size-4" />
                                Simpan Perubahan
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
