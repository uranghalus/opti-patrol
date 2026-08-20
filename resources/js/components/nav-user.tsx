import { usePage } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, Settings } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';

export function NavUser() {
    const { auth } = usePage().props;

    if (!auth.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="neu-user-btn flex items-center gap-2.5 px-2.5 py-1.5">
                    <UserInfo user={auth.user} />
                    <ChevronsUpDown className="size-3.5 text-muted-foreground/40" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-52 rounded-xl border border-border/30 bg-card/80 shadow-lg backdrop-blur-xl"
                align="end"
            >
                <DropdownMenuItem asChild>
                    <Link href="/settings/profile" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:text-destructive"
                    onSelect={() =>
                        document
                            .getElementById('nav-logout-form')
                            ?.requestSubmit()
                    }
                >
                    <LogOut className="mr-2 size-4" />
                    Keluar
                </DropdownMenuItem>
            </DropdownMenuContent>
            <form
                id="nav-logout-form"
                action="/logout"
                method="POST"
                className="hidden"
            >
                <input
                    type="hidden"
                    name="_token"
                    value={
                        typeof document !== 'undefined'
                            ? ((
                                  document.querySelector(
                                      'meta[name="csrf-token"]',
                                  ) as HTMLMetaElement
                              )?.content ?? '')
                            : ''
                    }
                />
            </form>
        </DropdownMenu>
    );
}
