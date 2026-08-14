import { Head } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aparJenisApar, aparSizes } from '@/types';

interface Apar {
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
}

interface Props {
    apar: Apar;
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/apar/${apar.id}`, {
            onSuccess: () => reset(),
            onError: (errors) => console.log('Errors:', errors),
        });
    };

    return (
        <>
            <Head title={`Edit APAR - ${apar.kode_apar}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/apar" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Kembali
                        </Link>
                        <h1 className="text-xl font-bold text-foreground">Edit APAR</h1>
                        <p className="text-sm text-muted-foreground/50">Edit data APAR: {apar.kode_apar}</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi APAR</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kode_apar">Kode APAR <span className="text-red-500">*</span></Label>
                                    <Input
                                        id="kode_apar"
                                        value={data.kode_apar}
                                        onChange={(e) => setData('kode_apar', e.target.value)}
                                        placeholder="Contoh: APAR-001"
                                        className={cn(errors.kode_apar && 'border-red-500 focus-visible:ring-red-500')}
                                        maxLength={25}
                                    />
                                    {errors.kode_apar && <p className="text-sm text-red-500" role="alert">{errors.kode_apar}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="jenis">Jenis <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.jenis}
                                        onValueChange={(value) => setData('jenis', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih jenis APAR" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Apar.jenisApar.map((jenis) => (
                                                <SelectItem key={jenis} value={jenis}>{jenis}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.jenis && <p className="text-sm text-red-500" role="alert">{errors.jenis}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="size">Ukuran (kg) <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={data.size}
                                        onValueChange={(value) => setData('size', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih ukuran" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {aparSizes.map((size) => (
                                                <SelectItem key={size} value={size.toString()}>{size} kg</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.size && <p className="text-sm text-red-500" role="alert">{errors.size}</p>}
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="lantai">Lantai</Label>
                                    <Input
                                        id="lantai"
                                        value={data.lantai}
                                        onChange={(e) => setData('lantai', e.target.value)}
                                        placeholder="Contoh: Lantai 1, Basement, Roof"
                                    />
                                    {errors.lantai && <p className="text-sm text-red-500" role="alert">{errors.lantai}</p>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="lokasi">Lokasi <span className="text-red-500">*</span></Label>
                                <Input
                                    id="lokasi"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    placeholder="Contoh: Lantai 1, Ruang Server, Area Parkir"
                                />
                                {errors.lokasi && <p className="text-sm text-red-500" role="alert">{errors.lokasi}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Penanggung Jawab (Opsional)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="user_id">PIC / Penanggung Jawab</Label>
                                <Select
                                    value={data.user_id}
                                    onValueChange={(value) => setData('user_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih penanggung jawab (opsional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">-- Pilih PIC --</SelectItem>
                                        {users.map((user) => (
                                            <SelectItem key={user.id} value={user.id.toString()}>{user.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.user_id && <p className="text-sm text-red-500" role="alert">{errors.user_id}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Link href="/apar">
                            <Button type="button" variant="outline">
                                <svg className="mr-2 size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path d="M19 12H5" />
                                    <path d="M12 19l-7-7 7-7" />
                                </svg>
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="gap-2">
                            <Save className="size-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}