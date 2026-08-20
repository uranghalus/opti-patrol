import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

export default function Page() {
    return (
        <AppLayout>
            <Head title="Laporan Rekap Hydrant" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="neu-card p-6">
                    <h1 className="text-2xl font-bold tracking-tight">Laporan Rekap Hydrant</h1>
                    <p className="mt-1 text-sm text-muted-foreground/70">Halaman sedang dalam pengembangan.</p>
                </div>
            </div>
        </AppLayout>
    );
}
