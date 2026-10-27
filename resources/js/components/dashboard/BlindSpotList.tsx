'use client';

import { Scan as ScanIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type Item = {
    id: string | number;
    kode: string;
    lokasi: string;
    jenis?: string;
    onScan?: (id: string | number) => void;
};

type Props = {
    title: string;
    items: Item[];
    emptyMessage?: string;
};

export function BlindSpotList({ title, items, emptyMessage }: Props) {
    return (
        <div className="overflow-hidden rounded-[20px] border border-[#e5edf5]/60 bg-white/80 shadow-[var(--shadow-md-stripe)] backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2 px-5 py-4">
                <h3 className="text-sm font-bold text-[#005377]">{title}</h3>
                <span
                    className="rounded-full bg-[#007994]/10 px-2 py-0.5 text-[10px] font-bold tracking-tighter text-[#007994] uppercase"
                    aria-label={`${items.length} aset belum diinspeksi`}
                >
                    {items.length} aset
                </span>
            </div>
            {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 p-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#97E17E]/20">
                        <ScanIcon className="size-5 text-[#32C292]" />
                    </div>
                    <div className="text-sm font-semibold text-[#005377]">
                        {emptyMessage ?? 'Semua aset telah diinspeksi.'}
                    </div>
                    <div className="text-[11px] text-[#007994]/60">
                        Tidak ada blind spot saat ini
                    </div>
                </div>
            ) : (
                <div className="divide-y divide-[#e5edf5]/40">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/inspection/apar/${item.id}`}
                            prefetch
                            className={cn(
                                'flex cursor-pointer items-center justify-between gap-3 border-b border-[#e5edf5]/20 px-5 py-3.5 text-sm transition-all duration-200 last:border-0 hover:-translate-y-0.5 hover:bg-[#97E17E]/10',
                            )}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="truncate font-semibold text-[#005377]">
                                    {item.kode}
                                </div>
                                <div className="truncate text-[11px] text-[#007994]">
                                    {item.lokasi}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.jenis && (
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'px-2 py-0.5 text-[10px] font-bold',
                                            'border-[#009E9D]/40 bg-[#009E9D]/10 text-[#009E9D]',
                                        )}
                                    >
                                        {item.jenis}
                                    </Badge>
                                )}
                                <ScanIcon className="size-4 text-[#007994]/60" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
