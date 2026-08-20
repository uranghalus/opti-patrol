import { Link, usePage } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { dashboard } from '@/routes';

export default function AppLogo() {
    const { name } = usePage().props;

    return (
        <Link href={dashboard()} prefetch className="flex items-center gap-2.5">
            <div className="neu-icon flex size-8 items-center justify-center">
                <ShieldCheck
                    className="size-4.5 text-white"
                    strokeWidth={2.25}
                />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground">
                {name}
            </span>
        </Link>
    );
}
