import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Download, KeyRound, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';

interface Props {
    headers: string[];
    rows: (string | number | null)[][];
    filename: string;
}

export default function PermissionExport({ headers, rows, filename }: Props) {
    const downloadCsv = () => {
        const escape = (value: string | number | null) => {
            const str = String(value ?? '');

            return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
        };

        const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout>
            <Head title="Export Permission" />

            <div className="space-y-6 animate-in fade-in slide-in-from-y-4 duration-400">
                {/* ── Hero (glass, floating) ── */}
                <section className="glass-panel relative overflow-hidden px-5 py-6 sm:px-8 sm:py-7 animate-in fade-in duration-400">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="neu-icon grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white sm:h-14 sm:w-14">
                                <KeyRound className="size-5 sm:size-6" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">Export Permission</h1>
                                <p className="mt-0.5 text-xs text-muted-foreground/70 sm:text-sm">
                                    {rows.length} permission &middot; {filename}.csv
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="ghost" onClick={() => router.visit('/permission-management')} className="neu-btn">
                                <ArrowLeft className="size-4" />
                                Kembali
                            </Button>
                            <Button variant="ghost" onClick={() => window.print()} className="neu-btn">
                                <Printer className="size-4" />
                                Print
                            </Button>
                            <Button onClick={downloadCsv} className="gap-2 btn-soft-primary active:scale-[0.98]">
                                <Download className="size-4" />
                                Download CSV
                            </Button>
                        </div>
                    </div>
                </section>

                {/* ── Table (neumorphic card) ── */}
                <Card className="neu-card overflow-hidden animate-in fade-in duration-400 delay-100">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    {headers.map((header) => (
                                        <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rows.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={headers.length} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
                                                <KeyRound className="size-10 text-muted-foreground/20" />
                                                <p className="text-sm">Tidak ada data untuk diexport</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    rows.map((row, index) => (
                                        <TableRow key={index}>
                                            {row.map((cell, cellIndex) => (
                                                <TableCell key={cellIndex} className="whitespace-nowrap text-sm text-foreground/80">
                                                    {cell ?? '-'}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
}
