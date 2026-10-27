'use client';

import {
    MoreHorizontal as KebabIcon,
    TrendingUp as UpIcon,
    TrendingDown as DownIcon,
    Activity as ActivityIcon,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'neutral' | 'paused';

type Props = {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: string; // hex for icon + badge accent
    trend?: {
        label: string;
        type: Trend;
    };
    onMenuClick?: () => void;
};

export function StatCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
    onMenuClick,
}: Props) {
    const trendConfig = {
        up: { icon: UpIcon, badge: '#32C292', text: '#32C292' },
        down: { icon: DownIcon, badge: '#F9F871', text: '#005377' },
        neutral: { icon: null, badge: '#e5edf5', text: '#007994' },
        paused: { icon: null, badge: '#F9F871', text: '#005377' },
    }[trend?.type ?? 'neutral'];

    return (
        <Card
            className={cn(
                'group border-none shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
                'border border-[#e5edf5]/60 bg-white/90 backdrop-blur-sm',
            )}
        >
            <CardContent className="p-5 pt-4">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg',
                                `bg-[${color}]/10 text-[${color}]`,
                            )}
                        >
                            <Icon className="size-4" />
                        </div>
                        <h3 className="text-xs font-semibold tracking-tighter text-[#007994]/60 uppercase">
                            {title}
                        </h3>
                    </div>
                    {onMenuClick ? (
                        <button
                            onClick={onMenuClick}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#007994]/40 transition-colors hover:bg-[#005377]/10 hover:text-[#005377]"
                            aria-label={`Menu untuk ${title}`}
                        >
                            <KebabIcon className="size-4" />
                        </button>
                    ) : (
                        <div className="h-8 w-8" />
                    )}
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-[#0a2540]">
                        {value}
                    </span>
                    {trend && (
                        <Badge
                            variant={
                                trend.type === 'paused'
                                    ? 'secondary'
                                    : 'default'
                            }
                            className={cn(
                                'text-xs font-bold tracking-tighter uppercase',
                                trend.type === 'up'
                                    ? 'border-transparent bg-[#32C292]/20 text-[#32C292]'
                                    : trend.type === 'down'
                                      ? 'border-transparent bg-[#F9F871]/20 text-[#005377]'
                                      : trend.type === 'paused'
                                        ? 'border-transparent bg-[#F9F871]/20 text-[#005377]'
                                        : 'border-transparent bg-[#e5edf5] text-[#007994]',
                            )}
                        >
                            {trendConfig.icon && (
                                <trendConfig.icon className="mr-1 size-3" />
                            )}
                            {trend.label}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
