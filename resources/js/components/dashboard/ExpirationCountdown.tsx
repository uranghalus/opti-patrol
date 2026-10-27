'use client';

import { AlertTriangle as AlertIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Item = {
    id: string | number;
    kode: string;
    lokasi: string;
    status: string;
    tanggal?: string | null;
    onScan?: (id: string | number) => void;
};

type Props = {
    title: string;
    items: Item[];
    emptyMessage?: string;
};

export function ExpirationCountdown({ title, items, emptyMessage }: Props) {
    return (
        <div className="rounded-[20px] border border-[#e5edf5]/60 bg-white/80 p-5 shadow-[var(--shadow-md-stripe)] backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F9F871]/20">
                    <AlertIcon className="size-4 text-[#F9F871]" />
                </div>
                <h3 className="text-sm font-bold text-[#005377]">{title}</h3>
            </div>
            {items.length === 0 ? (
                <div className="py-6 text-center">
                    <div className="text-sm font-bold text-[#32C292]">
                        Semua APAR aman
                    </div>
                    <div className="mt-1 text-xs text-[#007994]/70">
                        Tidak ada yang mendekati kadaluarsa
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {items.map((item) => {
                        const expired =
                            item.status === 'kadaluarsa' ||
                            item.status === 'expired';
                        const warning =
                            item.status === 'perlu_perhatian' ||
                            item.status === 'warning';
                        return (
                            <div
                                key={item.id}
                                className={cn(
                                    'flex cursor-default items-center justify-between gap-3 rounded-[12px] border p-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md',
                                    expired
                                        ? 'border-[#F9F871]/40 bg-[#F9F871]/10'
                                        : warning
                                          ? 'border-[#32C292]/40 bg-[#32C292]/10'
                                          : 'border-transparent',
                                )}
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="truncate font-semibold text-[#005377]">
                                        {item.kode}
                                    </div>
                                    <div className="truncate text-[11px] text-[#007994]">
                                        {item.lokasi}
                                    </div>
                                    {item.tanggal && (
                                        <div className="mt-0.5 text-[10px] text-[#007994]/60">
                                            {item.tanggal}
                                        </div>
                                    )}
                                </div>
                                <Badge
                                    variant={
                                        expired
                                            ? 'destructive'
                                            : warning
                                              ? 'secondary'
                                              : 'default'
                                    }
                                    className={cn(
                                        'text-xs font-bold tracking-tighter whitespace-nowrap uppercase',
                                        expired
                                            ? 'border-transparent bg-[#F9F871] text-[#005377]'
                                            : warning
                                              ? 'border-transparent bg-[#32C292] text-white'
                                              : 'border-transparent bg-[#005377] text-white',
                                    )}
                                    role="status"
                                    aria-atomic="true"
                                >
                                    {item.status}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
