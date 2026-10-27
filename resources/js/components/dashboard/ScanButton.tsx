'use client';

import { Scan as ScanIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type Props = {
    href: string;
    label?: string;
    disabled?: boolean;
};

export function ScanButton({ href, label = 'Scan QR', disabled }: Props) {
    return (
        <Link href={href} asChild prefetch>
            <Button
                disabled={disabled}
                size="lg"
                className={cn(
                    'h-14 w-full justify-center gap-2 rounded-[16px] text-base font-bold',
                    'bg-gradient-to-br from-[#005377] to-[#007994]',
                    'hover:from-[#007994] hover:to-[#009E9D]',
                    'shadow-lg shadow-[#005377]/30',
                    'hover:-translate-y-1 hover:shadow-[#007994]/40',
                    'active:scale-[0.97]',
                    disabled && 'cursor-not-allowed opacity-60',
                )}
            >
                <ScanIcon className="size-5" />
                {label}
            </Button>
        </Link>
    );
}
