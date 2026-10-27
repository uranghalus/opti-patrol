'use client';

import { ShieldCheck as ShieldIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
    value: number; // 0-100
    label?: string;
    subLabel?: string;
};

export function ComplianceGauge({
    value,
    label = 'Terasampai Inspeksi',
    subLabel,
}: Props) {
    const pct = Math.max(0, Math.min(100, value));
    const radius = 38;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;

    const isCritical = pct < 50;
    const isWarning = pct < 80;

    const gaugeColor = isCritical
        ? '#F9F871'
        : isWarning
          ? '#32C292'
          : '#005377';
    const gaugeGlow = isCritical
        ? '#F9F871'
        : isWarning
          ? '#32C292'
          : '#007994';

    return (
        <div className="flex flex-col items-center gap-3 rounded-[20px] border border-white/60 bg-white/80 p-6 shadow-[var(--shadow-md-stripe)] backdrop-blur-sm">
            <div className="relative h-24 w-24">
                <svg
                    className="h-full w-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                >
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke="#e5edf5"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        className="text-border"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        stroke={gaugeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: offset,
                        }}
                        className="drop-shadow-[0_0_8px_rgba(0,83,119,0.4)] transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-2xl font-bold text-[#005377]">
                        {pct}%
                    </div>
                    <div className="text-[10px] font-semibold tracking-wider text-[#007994] uppercase opacity-80">
                        compliance
                    </div>
                </div>
            </div>
            <div className="text-center">
                <div className="text-sm font-bold text-[#005377]">{label}</div>
                {subLabel && (
                    <div className="text-xs font-medium text-[#007994]">
                        {subLabel}
                    </div>
                )}
            </div>
        </div>
    );
}
