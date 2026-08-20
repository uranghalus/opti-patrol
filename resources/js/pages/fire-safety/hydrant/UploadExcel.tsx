import { Head, router } from '@inertiajs/react';
import { ArrowLeft, FileSpreadsheet, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Hydrant } from '@/types';

interface HydrantRow {
    kode_unik: string;
    kode_hydrant: string;
    tipe: 'Indoor' | 'Outdoor';
    ukuran: string;
    lantai?: string | null;
    lokasi: string;
}

export default function HydrantUploadExcel() {
    const [items, setItems] = useState<HydrantRow[]>([]);
    const [errors, setErrors] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
return;
}

        const reader = new FileReader();
        reader.onload = (evt) => {
            const arrayBuffer = evt.target?.result as ArrayBuffer;
            const wb = XLSX.read(arrayBuffer, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: HydrantRow[] = XLSX.utils.sheet_to_json(ws, { header: 0 });

            const newErrors = data.reduce((acc: number[], item, index) => {
                if (!item.kode_unik || !item.kode_hydrant || !item.ukuran || !item.lokasi) {
                    acc.push(index);
                }

                return acc;
            }, []);

            setErrors(newErrors);
            setItems(data);
        };
        reader.readAsArrayBuffer(file);
    };

    const handleSubmit = () => {
        const formData = new FormData();

        items.forEach((item, index) => {
            formData.append(`data[${index}][kode_unik]`, item.kode_unik);
            formData.append(`data[${index}][kode_hydrant]`, item.kode_hydrant);
            formData.append(`data[${index}][ukuran]`, item.ukuran);
            formData.append(`data[${index}][lantai]`, item.lantai ?? '');
            formData.append(`data[${index}][lokasi]`, item.lokasi);
        });

        setProcessing(true);
        router.post('/fire-safety/hydrant/import', formData, {
            preserveScroll: true,
            onStart: () => {
                toast.loading('Mengimpor data hydrant...');
            },
            onSuccess: () => {
                toast.dismiss();
                toast.success('Import berhasil!');
            },
            onError: () => {
                toast.dismiss();
                toast.error('Gagal mengimpor data. Periksa kembali isian!');
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <>
            <Head title="Upload Hydrant Data" />
            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* Hero */}
                <section className="glass-panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="neu-icon grid h-14 w-14 place-items-center rounded-2xl text-white">
                                <FileSpreadsheet className="size-7" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Upload Hydrant</h1>
                                <p className="mt-1 text-sm text-muted-foreground/70">
                                    Import data hydrant dari file Excel (.xlsx / .xls)
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            className="neu-btn"
                            onClick={() => router.visit('/fire-safety/hydrant')}
                        >
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Button>
                    </div>
                </section>

                <Card className="neu-card animate-in fade-in slide-in-from-y-4 duration-400 delay-75">
                    <CardHeader>
                        <CardTitle>File Excel</CardTitle>
                        <p className="text-xs text-muted-foreground/70">
                            Kolom wajib: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">kode_unik</code>,{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">kode_hydrant</code>,{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">ukuran</code>,{' '}
                            <code className="rounded bg-muted px-1.5 py-0.5 font-mono">lokasi</code>
                            . Kolom <code className="rounded bg-muted px-1.5 py-0.5 font-mono">lantai</code> opsional.
                        </p>
                    </CardHeader>
                    <CardContent>
                        <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-white/30 p-8 transition-colors hover:border-primary/40 hover:bg-primary/5">
                            <Upload className="size-8 text-muted-foreground/40" />
                            <span className="text-sm font-medium text-foreground">Pilih file Excel</span>
                            <span className="text-xs text-muted-foreground/60">.xlsx atau .xls</span>
                            <Input
                                type="file"
                                accept=".xlsx,.xls"
                                onChange={handleFile}
                                className="hidden"
                            />
                        </label>
                    </CardContent>
                </Card>

                {items.length > 0 && (
                    <Card className="neu-card animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Preview Data ({items.length} baris)
                                {errors.length > 0 && (
                                    <span className="ml-2 text-xs font-normal text-destructive">
                                        {errors.length} baris tidak valid
                                    </span>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="max-h-[500px] overflow-auto rounded-xl border border-border/40">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-muted/40 sticky top-0">
                                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground/70">
                                            <th className="border-b border-border/40 p-3">#</th>
                                            <th className="border-b border-border/40 p-3">Kode Unik</th>
                                            <th className="border-b border-border/40 p-3">Kode Hydrant</th>
                                            <th className="border-b border-border/40 p-3">Ukuran</th>
                                            <th className="border-b border-border/40 p-3">Lantai</th>
                                            <th className="border-b border-border/40 p-3">Lokasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item, idx) => {
                                            const invalid = errors.includes(idx);

                                            return (
                                                <tr
                                                    key={idx}
                                                    className={invalid ? 'bg-destructive/10' : 'hover:bg-muted/20'}
                                                >
                                                    <td className="border-b border-border/30 p-3 font-mono text-xs text-muted-foreground/70">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="border-b border-border/30 p-3 font-mono">{item.kode_unik ?? '-'}</td>
                                                    <td className="border-b border-border/30 p-3">{item.kode_hydrant ?? '-'}</td>
                                                    <td className="border-b border-border/30 p-3">{item.ukuran ?? '-'}</td>
                                                    <td className="border-b border-border/30 p-3 text-muted-foreground">{item.lantai ?? '-'}</td>
                                                    <td className="border-b border-border/30 p-3">{item.lokasi ?? '-'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                        <CardFooter className="space-x-2">
                            <Button
                                onClick={handleSubmit}
                                disabled={processing || errors.length > 0}
                                className="btn-soft-primary gap-2"
                            >
                                <Upload className="size-4" />
                                {processing ? 'Mengimpor...' : 'Simpan ke Database'}
                            </Button>
                            <span className="text-xs text-muted-foreground/70">
                                {errors.length > 0 ? 'Perbaiki baris merah sebelum menyimpan' : 'Data siap diimpor'}
                            </span>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </>
    );
}