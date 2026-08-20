import { Head } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
    // No props needed for upload form
}

interface ImportRow {
    kode_apar: string;
    lantai: string;
    lokasi: string;
    jenis: string;
    size: number | string;
}

const REQUIRED = ['kode_apar', 'lokasi', 'jenis', 'size'];

export default function AparUploadExcel({}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ImportRow[]>([]);
    const [invalidRows, setInvalidRows] = useState<number[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const { post, processing, errors, reset, setData } = useForm({
        data: [] as ImportRow[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) {
return;
}

        const allowed = /\.(xlsx|xls|csv)$/i.test(selectedFile.name);

        if (!allowed) {
            alert('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv');

            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');

            return;
        }

        setFile(selectedFile);
        setShowPreview(false);
        setPreviewData([]);
        setInvalidRows([]);

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const arrayBuffer = evt.target?.result as ArrayBuffer;
                const wb = XLSX.read(arrayBuffer, { type: 'array' });
                const ws = wb.Sheets[wb.SheetNames[0]];
                const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

                const invalid = rows
                    .map((r, i) => (REQUIRED.every((k) => r[k]) ? -1 : i))
                    .filter((i) => i !== -1);

                const parsed: ImportRow[] = rows.map((r) => ({
                    kode_apar: (r.kode_apar ?? '').trim(),
                    lantai: (r.lantai ?? '').trim(),
                    lokasi: (r.lokasi ?? '').trim(),
                    jenis: (r.jenis ?? '').trim(),
                    size: (r.size ?? '').trim(),
                }));

                setPreviewData(parsed);
                setInvalidRows(invalid);
                setShowPreview(true);
            } catch (error) {
                console.error('Error parsing file:', error);
                alert('Gagal membaca file. Pastikan format Excel/CSV valid.');
            }
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert('Pilih file terlebih dahulu');

            return;
        }

        if (invalidRows.length > 0) {
            alert('Terdapat baris tidak valid. Perbaiki dahulu sebelum import.');

            return;
        }

        setData('data', previewData);
        post('/fire-safety/apar/import', {
            onSuccess: () => {
                reset();
                setFile(null);
                setPreviewData([]);
                setInvalidRows([]);
                setShowPreview(false);
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;

                if (fileInput) {
fileInput.value = '';
}
            },
            onError: (err) => {
                console.log('Import errors:', err);
            },
        });
    };

    const downloadTemplate = () => {
        const csv = 'kode_apar,lantai,lokasi,jenis,size\nAPAR-001,Lantai 1,Ruang Server,CO2,2\nAPAR-002,Lantai 2,Area Parkir,Powder,4\nAPAR-003,Basement,Gudang,Foam,6';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'template-import-apar.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    };

    return (
        <>
            <Head title="Import APAR Excel" />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400 max-w-3xl">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/fire-safety/apar"
                            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke daftar
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Import Data APAR</h1>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Upload file Excel/CSV untuk menambah data APAR secara massal
                        </p>
                    </div>
                </header>

                <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileSpreadsheet className="size-5 text-primary" />
                            Format File & Instruksi
                        </CardTitle>
                        <CardDescription>Ikuti panduan berikut untuk import yang berhasil</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 p-4 neu-card bg-muted/30 border-border/50 rounded-lg">
                                <h4 className="font-medium text-sm">Kolom Wajib</h4>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li><code className="px-1.5 py-0.5 bg-muted/50 rounded text-xs font-mono">kode_apar</code> - Kode unik APAR (max 25 karakter)</li>
                                    <li><code className="px-1.5 py-0.5 bg-muted/50 rounded text-xs font-mono">lokasi</code> - Lokasi penempatan APAR</li>
                                    <li><code className="px-1.5 py-0.5 bg-muted/50 rounded text-xs font-mono">jenis</code> - CO2, Powder, Foam, atau Air</li>
                                    <li><code className="px-1.5 py-0.5 bg-muted/50 rounded text-xs font-mono">size</code> - Ukuran: 2, 4, 6, atau 9 (kg)</li>
                                </ul>
                            </div>
                            <div className="space-y-2 p-4 neu-card bg-muted/30 border-border/50 rounded-lg">
                                <h4 className="font-medium text-sm">Kolom Opsional</h4>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li><code className="px-1.5 py-0.5 bg-muted/50 rounded text-xs font-mono">lantai</code> - Lantai/area (contoh: Lantai 1, Basement)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-2 p-4 neu-card bg-amber-50/50 border border-amber-200/50 rounded-lg">
                            <h4 className="font-medium text-sm text-amber-800">Catatan Penting</h4>
                            <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                                <li>File harus berformat <strong>.xlsx, .xls, atau .csv</strong></li>
                                <li>Ukuran file maksimal <strong>5MB</strong></li>
                                <li>Kode APAR harus unik (tidak duplikat dengan data existing)</li>
                                <li>Data yang sudah ada akan diperbarui, data baru akan ditambahkan</li>
                                <li>Gunakan template di bawah untuk memastikan format benar</li>
                            </ul>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <Button variant="outline" onClick={downloadTemplate} className="gap-2 neu-btn">
                                <Download className="size-4" />
                                Download Template CSV
                            </Button>
                            <span className="text-sm text-muted-foreground">Contoh format yang benar</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="neu-card border-0 bg-transparent shadow-none animate-in fade-in slide-in-from-y-4 duration-400 delay-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Upload className="size-5 text-primary" />
                            Upload File
                        </CardTitle>
                        <CardDescription>Pilih file Excel/CSV untuk diimport</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="file-upload" className="text-sm font-medium">
                                Pilih File <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".xlsx,.xls,.csv"
                                    onChange={handleFileChange}
                                    className="sr-only"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={cn(
                                        'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                                        file
                                            ? 'border-green-500 bg-green-50/50'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-primary/5 neu-card',
                                    )}
                                >
                                    {file ? (
                                        <>
                                            <CheckCircle className="size-10 text-green-500 mb-2" />
                                            <p className="font-medium text-green-700">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024).toFixed(1)} KB &middot; {previewData.length} baris terbaca
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="size-10 text-muted-foreground/50 mb-2" />
                                            <p className="font-medium text-foreground">Klik atau drag & drop file di sini</p>
                                            <p className="text-sm text-muted-foreground">
                                                Format: .xlsx, .xls, .csv (max 5MB)
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                            {errors.data && (
                                <p className="text-sm text-destructive" role="alert">{errors.data}</p>
                            )}
                        </div>

                        {file && (
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing || invalidRows.length > 0}
                                    className="w-full sm:w-auto gap-2 btn-soft-primary active:scale-[0.98]"
                                >
                                    <Upload className="size-4" />
                                    {processing ? 'Mengimport...' : 'Import Data'}
                                </Button>
                                {invalidRows.length > 0 && (
                                    <span className="text-sm text-destructive">
                                        {invalidRows.length} baris tidak valid
                                    </span>
                                )}
                            </div>
                        )}

                        {showPreview && previewData.length > 0 && (
                            <div className="space-y-3 border-t border-border/50 pt-4 animate-in fade-in slide-in-from-y-2 duration-300">
                                <h4 className="font-medium text-sm">Pratinjau Data ({previewData.length} baris)</h4>
                                <div className="overflow-x-auto glass-panel p-3 rounded-xl">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/60">
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">No</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Kode APAR</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Lantai</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Lokasi</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Jenis</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Ukuran</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, index) => {
                                                const invalid = invalidRows.includes(index);

                                                return (
                                                    <tr key={index} className={cn('border-t border-white/40', invalid && 'bg-red-100/60')}>
                                                        <td className="px-3 py-2 text-muted-foreground">{index + 1}</td>
                                                        <td className="px-3 py-2 font-mono">{row.kode_apar || <span className="text-red-500">?</span>}</td>
                                                        <td className="px-3 py-2">{row.lantai || '-'}</td>
                                                        <td className="px-3 py-2 max-w-[200px] truncate">{row.lokasi || <span className="text-red-500">?</span>}</td>
                                                        <td className="px-3 py-2">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium neu-card bg-primary/10 text-primary border border-primary/20">
                                                                {row.jenis || <span className="text-red-500">?</span>}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 font-mono">{row.size} kg</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <Link
                            href="/fire-safety/apar"
                            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="size-4" />
                            Kembali ke daftar
                        </Link>
                    </CardContent>
                </Card>

                {errors.data && (
                    <Alert variant="destructive" className="border-destructive/50 neu-card animate-in fade-in slide-in-from-y-2 duration-300">
                        <AlertCircle className="size-4" />
                        <AlertDescription>{errors.data}</AlertDescription>
                    </Alert>
                )}
            </div>
        </>
    );
}
