import { DataTableFacetedFilter } from '@/components/datatable-faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { Printer, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props<TData> {
    table: Table<TData>;
}

export default function HydrantToolbar<TData>({ table }: Props<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0;

    const [lantaiList, setLantaiList] = useState<string[]>([]);
    const [batchCount, setBatchCount] = useState(1);
    const [selectedLantai, setSelectedLantai] = useState('');
    const [selectedBatch, setSelectedBatch] = useState('1');

    useEffect(() => {
        fetch('/fire-safety/hydrant/filter-options')
            .then((res) => res.json())
            .then((data) => {
                setBatchCount(data.totalBatch ?? 1);
                setLantaiList(data.lantai ?? []);
            });
    }, []);

    const handlePrint = () => {
        const params = new URLSearchParams();
        if (selectedLantai) params.append('lantai', selectedLantai);
        params.append('batch', selectedBatch);

        window.open(`/fire-safety/hydrant/generate-mass-qr?${params.toString()}`, '_blank');
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col-reverse items-start gap-2 sm:flex-row sm:items-center sm:gap-2">
                <Input
                    placeholder="Cari Kode Hydrant..."
                    value={(table.getColumn('kode_hydrant')?.getFilterValue() as string) ?? ''}
                    onChange={(event) => table.getColumn('kode_hydrant')?.setFilterValue(event.target.value)}
                    className="h-9 w-full sm:w-[260px] lg:w-[320px]"
                />
                <div className="flex flex-wrap gap-2">
                    {table.getColumn('lantai') && (
                        <DataTableFacetedFilter
                            column={table.getColumn('lantai')}
                            title="Lantai"
                            options={lantaiList.map((lt) => ({ label: lt, value: lt }))}
                        />
                    )}
                </div>
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-9 px-2 lg:px-3">
                        Reset
                        <RefreshCw className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedLantai} onValueChange={setSelectedLantai}>
                    <SelectTrigger className="h-9 w-[180px]">
                        <SelectValue placeholder="Pilih Lantai" />
                    </SelectTrigger>
                    <SelectContent>
                        {lantaiList.map((lok, i) => (
                            <SelectItem key={i} value={lok}>
                                {lok}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="h-9 w-[120px]">
                        <SelectValue placeholder="Batch ke-" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: batchCount }, (_, i) => (
                            <SelectItem key={i} value={`${i + 1}`}>
                                Batch {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Button size="sm" variant="secondary" onClick={handlePrint} className="h-9">
                    <Printer className="mr-1.5 h-4 w-4" />
                    Cetak QR Code
                </Button>
            </div>
        </div>
    );
}