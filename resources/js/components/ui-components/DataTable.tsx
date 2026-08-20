'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { DataTable as BaseDataTable, OrderBy } from '@/components/ui-components/DataTable';

type Props = {
    items: any[];
    meta: any;
    filters: any;
    onFiltersChange: (filters: any) => void;
    onPageChange: (page: number) => void;
    columns: any[];
    actions?: (row: any) => ReactNode;
    rowKey: string;
};

export default function DataTable({ items, meta, filters, onFiltersChange, onPageChange, columns, actions, rowKey }: Props) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, page: 1, search: e.target.value });
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFiltersChange({ ...filters, page: 1, per_page: e.target.value });
    };

    const handlePageChange = (page: number) => {
        onPageChange(page);
    };

    return (
        <div className="space-y-4">
            {/* Search and Per Page Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative max-w-xs w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                    <input
                        type="search"
                        placeholder="Search..."
                        value={filters.search || ''}
                        onChange={handleSearchChange}
                        className="pl-9 bg-glass-surface border-glass-border text-sm text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Select value={filters.per_page?.toString() || meta.per_page.toString()} onValueChange={handlePerPageChange}>
                        <SelectTrigger className="w-[100px] bg-glass-surface border-glass-border">
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 15, 20, 25, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size} per page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="relative overflow-x-auto">
                <table className="w-full caption-bottom text-sm" role="grid">
                    <thead className="bg-glass-surface border-b border-glass-border">
                        <tr className="border-b border-glass-border transition-colors hover:bg-glass-surface/50">
                            <tr>
                                {columns.map((column, index) => (
                                    <th
                                        key={index}
                                        scope="col"
                                        className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b border-glass-border transition-colors hover:bg-glass-surface/20"
                                    >
                                        <div className="flex items-center gap-1">
                                            {column.header}
                                            {column.sortable && (
                                                <span className="cursor-pointer ml-1">
                                                    {filters.sortColumn === column.accessor && (
                                                        <span className="ml-1">
                                                            {filters.sortDirection === 'asc' ? '▲' : '▼'}
                                                        </span>
                                                    )}
                                                </div>
                                        </div>
                                    </th>
                                ))}
                                {actions && (
                                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {items && items.length > 0 ? (
                                items.map((row, rowIndex) => (
                                    <tr
                                        key={row[rowKey] || rowIndex}
                                        className="border-b border-glass-border transition-colors hover:bg-glass-surface/50"
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="px-4 py-3 text-sm">
                                                {column.accessor && row[column.accessor] ? 
                                                    column.accessor === 'created_at' ?
                                                        new Date(row[column.accessor]).toLocaleDateString('id-ID') : 
                                                    String(row[column.accessor]) : 
                                                    ''
                                                }
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-4 py-3 text-right">
                                                {actions(row)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                                        No data available
                                    </td>
                                </tr>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}