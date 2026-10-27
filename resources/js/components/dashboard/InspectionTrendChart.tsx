'use client';

import * as React from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Point = {
    bulan: string;
    apar: number;
    hydrant: number;
};

type Props = {
    title: string;
    data: Point[];
    height?: number;
};

export function InspectionTrendChart({ title, data, height = 180 }: Props) {
    if (data.length === 0) {
        return (
            <div className="rounded-[20px] border border-[#e5edf5]/60 bg-white/80 p-6 shadow-[var(--shadow-md-stripe)] backdrop-blur-sm">
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#97E17E]/20">
                        <ActivityIcon className="size-4 text-[#32C292]" />
                    </div>
                    <h3 className="text-sm font-bold text-[#005377]">
                        {title}
                    </h3>
                </div>
                <div className="py-4 text-center">
                    <div className="text-xs font-bold text-[#005377]">
                        Tidak ada data inspeksi
                    </div>
                    <div className="mt-0.5 text-[10px] text-[#007994]/60">
                        Mulai scan QR untuk melihat tren
                    </div>
                </div>
            </div>
        );
    }

    const maxVal = Math.max(...data.flatMap((d) => [d.apar, d.hydrant]), 1);
    const width = 320;
    const pad = 40;

    const xFor = (i: number) =>
        pad + (i / Math.max(data.length - 1, 1)) * (width - 2 * pad);
    const yFor = (v: number) =>
        height - pad - (v / maxVal) * (height - 2 * pad);

    const aparLine = data.map((d, i) => `${xFor(i)},${yFor(d.apar)}`).join(' ');
    const hydrantLine = data
        .map((d, i) => `${xFor(i)},${yFor(d.hydrant)}`)
        .join(' ');

    return (
        <div className="rounded-[20px] border border-[#e5edf5]/60 bg-white/80 p-4 shadow-[var(--shadow-md-stripe)] backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005377]/10">
                    <ActivityIcon className="size-4 text-[#005377]" />
                </div>
                <h3 className="text-sm font-bold text-[#005377]">{title}</h3>
            </div>
            <div className="relative h-[180px] w-full">
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox={`0 0 ${width} ${height}`}
                    preserveAspectRatio="none"
                >
                    {/* APAR line */}
                    <path
                        d={`M ${aparLine}`}
                        fill="none"
                        stroke="#005377"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {/* Hydrant line */}
                    <path
                        d={`M ${hydrantLine}`}
                        fill="none"
                        stroke="#009E9D"
                        strokeWidth={3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8,6"
                    />
                    {/* Gradient fills under lines */}
                    <defs>
                        <linearGradient
                            id="grad-apar"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#005377"
                                stopOpacity="0.3"
                            />
                            <stop
                                offset="100%"
                                stopColor="#005377"
                                stopOpacity="0"
                            />
                        </linearGradient>
                        <linearGradient
                            id="grad-hydrant"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="0%"
                                stopColor="#009E9D"
                                stopOpacity="0.3"
                            />
                            <stop
                                offset="100%"
                                stopColor="#009E9D"
                                stopOpacity="0"
                            />
                        </linearGradient>
                    </defs>
                    <path
                        d={`M ${aparLine} L ${xFor(data.length - 1)},${height - pad} L ${xFor(0)},${height - pad} Z`}
                        fill="url(#grad-apar)"
                    />
                    <path
                        d={`M ${hydrantLine} L ${xFor(data.length - 1)},${height - pad} L ${xFor(0)},${height - pad} Z`}
                        fill="url(#grad-hydrant)"
                    />
                    {/* Dots */}
                    {data.map((d, i) => (
                        <React.Fragment key={i}>
                            <circle
                                cx={xFor(i)}
                                cy={yFor(d.apar)}
                                r={4}
                                fill="#005377"
                            />
                            <circle
                                cx={xFor(i)}
                                cy={yFor(d.hydrant)}
                                r={4}
                                fill="#009E9D"
                            />
                        </React.Fragment>
                    ))}
                </svg>
                {/* Labels */}
                <div className="absolute right-0 bottom-0 left-0 mt-1 flex justify-between px-2 text-[10px] font-semibold text-[#007994]">
                    {data.map((d, i) => (
                        <span key={i}>{d.bulan}</span>
                    ))}
                </div>
            </div>
            <div className="mt-3 flex gap-4 text-[10px] font-bold tracking-tighter uppercase">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#005377]" /> APAR
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#009E9D]" />{' '}
                    Hydrant
                </span>
            </div>
        </div>
    );
}
