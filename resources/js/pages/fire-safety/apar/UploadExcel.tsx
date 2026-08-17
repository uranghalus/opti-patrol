import { Head } from '@inertiajs/react';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Upload, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface Props {
    // No props needed for upload form
}

interface ImportRow {
    kode_apar: string;
    lantai?: string;
    lokasi: string;
    jenis: string;
    size: number;
}

export default function AparUploadExcel({}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [previewData, setPreviewData] = useState<ImportRow[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        data: [] as ImportRow[],
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const allowedTypes = [
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'application/vnd.ms-excel', // .xls
            'text/csv', // .csv
        ];

        if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
            alert('Format file tidak didukung. Gunakan .xlsx, .xls, atau .csv');
            return;
        }

        // Validate file size (max 5MB)
        if (selectedFile.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar. Maksimal 5MB.');
            return;
        }

        setFile(selectedFile);
        setShowPreview(false);
        setPreviewData([]);
    };

    const handlePreview = async () => {
        if (!file) return;

        try {
            // For preview, we'll read the file using FileReader
            // In a real app, you might want to send to backend for parsing
            const text = await file.text();
            const lines = text.split('\n').filter(line => line.trim());

            if (lines.length < 2) {
                alert('File kosong atau tidak memiliki data');
                return;
            }

            // Parse CSV (simple parsing, for Excel you'd need a library like xlsx)
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const requiredHeaders = ['kode_apar', 'lokasi', 'jenis', 'size'];
            const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));

            if (missingHeaders.length > 0) {
                alert(`Header yang hilang: ${missingHeaders.join(', ')}`);
                return;
            }

            const parsedData: ImportRow[] = [];
            for (let i = 1; i < Math.min(lines.length, 11); i++) { // Preview first 10 rows
                const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                if (values.length >= headers.length) {
                    const row: Record<string, string> = {};
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });

                    parsedData.push({
                        kode_apar: row.kode_apar || '',
                        lantai: row.lantai || '',
                        lokasi: row.lokasi || '',
                        jenis: row.jenis || '',
                        size: parseInt(row.size) || 2,
                    });
                }
            }

            setPreviewData(parsedData);
            setShowPreview(true);
        } catch (error) {
            console.error('Error parsing file:', error);
            alert('Gagal membaca file. Pastikan format CSV valid.');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            alert('Pilih file terlebih dahulu');
            return;
        }

        // Convert file to base64 for sending to backend
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;

            post('/fire-safety/apar/import', {
                data: {
                    data: previewData.length > 0 ? previewData : [],
                    file: base64,
                    filename: file.name,
                },
                onSuccess: () => {
                    reset();
                    setFile(null);
                    setPreviewData([]);
                    setShowPreview(false);
                    // Clear file input
                    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                    if (fileInput) fileInput.value = '';
                },
                onError: (errors) => {
                    console.log('Import errors:', errors);
                },
            });
        };
        reader.readAsDataURL(file);
    };

    const downloadTemplate = () => {
        const csvContent = 'kode_apar,lantai,lokasi,jenis,size\nAPAR-001,Lantai 1,Ruang Server,CO2,2\nAPAR-002,Lantai 2,Area Parkir,Powder,4\nAPAR-003,Basement,Gudang,Foam,6';
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
                {/* Header */}
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Link
                            href="/fire-safety/apar"
                            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Kembali ke daftar
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            Import Data APAR
                        </h1>
                        <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                            Upload file Excel/CSV untuk menambah data APAR secara massal
                        </p>
                    </div>
                </header>

                {/* Instructions Card */}
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
                            <Button variant="outline" onClick={downloadTemplate} className="gap-2 neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200">
                                <Download className="size-4" />
                                Download Template CSV
                            </Button>
                            <span className="text-sm text-muted-foreground">Contoh format yang benar</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Upload Form */}
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
                                    className={cn(
                                        'sr-only',
                                        errors.data && 'border-red-500'
                                    )}
                                />
                                <label
                                    htmlFor="file-upload"
                                    className={cn(
                                        'flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                                        file
                                            ? 'border-green-500 bg-green-50/50'
                                            : 'border-border/50 hover:border-primary/50 hover:bg-primary/5 neu-card'
                                    )}
                                >
                                    {file ? (
                                        <>
                                            <CheckCircle className="size-10 text-green-500 mb-2" />
                                            <p className="font-medium text-green-700">{file.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(file.size / 1024).toFixed(1)} KB
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
                                    variant="outline"
                                    onClick={handlePreview}
                                    disabled={processing}
                                    className="w-full sm:w-auto gap-2 neu-card border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                                >
                                    <FileSpreadsheet className="size-4" />
                                    Pratinjau Data
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={processing}
                                    className="w-full sm:w-auto gap-2 neu-card bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                                >
                                    <Upload className="size-4" />
                                    {processing ? 'Mengimport...' : 'Import Data'}
                                </Button>
                            </div>
                        )}

                        {/* Preview */}
                        {showPreview && previewData.length > 0 && (
                            <div className="space-y-3 border-t border-border/50 pt-4 animate-in fade-in slide-in-from-y-2 duration-300">
                                <h4 className="font-medium text-sm">Pratinjau Data (10 baris pertama)</h4>
                                <div className="overflow-x-auto neu-card border-border/50 rounded-xl">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-muted/50 border-b border-border/50">
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Kode APAR</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Lantai</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Lokasi</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Jenis</th>
                                                <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Ukuran</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {previewData.map((row, index) => (
                                                <tr key={index} className="border-t border-border/50 hover:bg-muted/30 transition-colors">
                                                    <td className="px-3 py-2 font-mono">{row.kode_apar}</td>
                                                    <td className="px-3 py-2">{row.lantai || '-'}</td>
                                                    <td className="px-3 py-2 max-w-[200px] truncate">{row.lokasi}</td>
                                                    <td className="px-3 py-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium neu-card bg-primary/10 text-primary border border-primary/20">
                                                            {row.jenis}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-2 font-mono">{row.size} kg</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {previewData.length >= 10 && (
                                    <p className="text-xs text-muted-foreground">
                                        Menampilkan 10 dari {previewData.length} baris preview
                                    </p>
                                )}
                            </div>
                        )}

                        <Link
                            href="/fire-safety/apar"
                            className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path d="M19 12H5" />
                                <path d="M12 19l-7-7 7-7" />
                            </svg>
                            Kembali ke daftar
                        </Link>
                    </CardContent>
                </Card>

                {/* Result Messages */}
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