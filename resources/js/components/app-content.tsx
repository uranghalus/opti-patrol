import * as React from 'react';

type Props = React.ComponentProps<'main'>;

export function AppContent({ children, ...props }: Props) {
    return (
        <main className="flex-1 p-6" {...props}>
            {children}
        </main>
    );
}
