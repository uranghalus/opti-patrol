import { Head } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
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
    apar: {
        id: number;
        kode_apar: string;
        lantai: string | null;
        lokasi: string;
        jenis: string;
        size: number;
        user_id: number | null;
        created_at: string;
        updated_at: string;
        user?: {
            id: number;
            name: string;
            email: string;
        };
    };
    users: { id: number; name: string }[];
}

export default function AparEdit({ apar, users }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        kode_apar: apar.kode_apar,
        lokasi: apar.lokasi,
        lantai: apar.lantai ?? '',
        jenis: apar.jenis,
        size: apar.size.toString(),
        user_id: apar.user_id?.toString() ?? '',
    });

    const [showErrors, setShowErrors] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowErrors(true);
        put(`/fire-safety/apar/${apar.id}`, {
            onSuccess: () => {
                reset();
                setShowErrors(false);
            },
            onError: (errors) => console.log('Errors:', errors),
        });
    };

    return (
        <>
            <Head title={`Edit APAR - ${apar.kode_apar}`} />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/fire-safety/apar"
                            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Kembali ke daftar
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Edit APAR
                        </h1>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Edit data APAR: <span className="font-mono font-medium">{apar.kode_apar}</span>
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
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
                                    </Label>
                                    <Select
                                        value={data.jenis}
                                        onValueChange={(value) => setData('jenis', value)}
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
                                    {showErrors && errors.jenis && (
                                        <p className="text-sm text-destructive" role="alert">{errors.jenis}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="size" className="flex items-center gap-1.5">
                                        Ukuran (kg) <span className="text-red-500">*</span>
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
                                    {showErrors && errors.size && (
                                        <p className="text-sm text-destructive" role="alert">{errors.size}</p>
                                    )}
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
                                    {showErrors && errors.lantai && (
                                        <p className="text-sm text-destructive" role="alert">{errors.lantai}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="lokasi" className="flex items-center gap-1.5">
                                    Lokasi <span className="text-red-500">*</span>
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

                    <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-200">
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
                            <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                <path d="M17 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7" />
                            </svg>
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}