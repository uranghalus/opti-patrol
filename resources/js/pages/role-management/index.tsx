'use client';

import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Loader2, Edit3, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AppLayout from '@/layouts/app-layout';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    permissions?: Array<{ id: number; name: string }>;
}

interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

interface Props {
    roles: {
        data: Role[];
        meta: PaginationMeta;
    };
    filters: {
        search: string;
        per_page: number;
    };
}

export default function Index({ roles, filters }: Props) {
    const [processing, setProcessing] = useState(false);

    const columns = [
        {
            accessor: 'name',
            header: 'Role Name',
            sortable: true,
        },
        {
            accessor: 'guard_name',
            header: 'Guard',
            sortable: true,
        },
        {
            accessor: 'created_at',
            header: 'Created',
        },
    ];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        router.get('/role-management/role/index', {
            ...filters,
            search: e.target.value,
            page: 1,
        }, { replace: true });
    };

    const handlePerPageChange = (value: string) => {
        router.get(route('role.index'), {
            ...filters,
            per_page: value,
            page: 1,
        }, { replace: true });
    };

    const handlePageChange = (page: number) => {
        router.get(route('role.index'), {
            ...filters,
            page,
        }, { replace: true });
    };

    const handleDelete = (role: Role) => {
        if (confirm(`Are you sure you want to delete "${role.name}"?`)) {
            setProcessing(true);
            router.delete(route('role.destroy', role.id), {
                onSuccess: () => setProcessing(false),
                onError: () => setProcessing(false),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Role Management" />
            <div className="p-6">
                <Card className="border-glass-border bg-glass-surface">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Role Management</CardTitle>
                                <CardDescription>Manage user roles and their permissions</CardDescription>
                            </div>
                            <Button asChild>
                                <Link href={route('role.create')}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Role
                                </Link>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <div className="relative max-w-xs w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                                <Input
                                    type="search"
                                    placeholder="Search roles..."
                                    value={filters.search}
                                    onChange={handleSearchChange}
                                    className="pl-9 bg-glass-surface border-glass-border"
                                />
                            </div>
                            
                            <Select value={filters.per_page?.toString() || roles.meta.per_page.toString()} onValueChange={handlePerPageChange}>
                                <SelectTrigger className="w-[140px] bg-glass-surface border-glass-border">
                                    <SelectValue placeholder="Rows per page" />
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

                        {/* Data Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="bg-glass-surface border-b border-glass-border">
                                    <tr>
                                        {columns.map((column, index) => (
                                            <th
                                                key={index}
                                                scope="col"
                                                className="px-4 py-3 text-left text-sm font-medium text-muted-foreground border-b border-glass-border"
                                            >
                                                {column.header}
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.data.length > 0 ? (
                                        roles.data.map((role) => (
                                            <tr
                                                key={role.id}
                                                className="border-b border-glass-border transition-colors hover:bg-glass-surface/50"
                                            >
                                                <td className="px-4 py-3 text-sm font-medium">{role.name}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">{role.guard_name}</td>
                                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                                    {new Date(role.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            asChild
                                                        >
                                                            <Link href={route('role.edit', role.id)}>
                                                                <Edit3 className="mr-1 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(role)}
                                                            disabled={processing}
                                                        >
                                                            <Trash2 className="mr-1 h-4 w-4" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                No roles found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {roles.meta.from} to {roles.meta.to} of {roles.meta.total} results
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(roles.meta.current_page - 1)}
                                    disabled={roles.meta.current_page <= 1}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {roles.meta.current_page} of {roles.meta.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(roles.meta.current_page + 1)}
                                    disabled={roles.meta.current_page >= roles.meta.last_page}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}