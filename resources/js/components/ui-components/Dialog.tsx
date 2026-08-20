'use client';

import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
};

export function Dialog({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
    size = 'md',
}: DialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const overlay = (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
        />
    );

    const content = (
        <div
            ref={contentRef}
            className={cn(
                'bg-glass-surface border-glass-border fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-2xl transition-all',
                'p-6',
                sizeClasses[size],
                className,
            )}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'dialog-title' : undefined}
            aria-describedby={description ? 'dialog-description' : undefined}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    {title && (
                        <h2
                            id="dialog-title"
                            className="text-lg font-semibold text-foreground"
                        >
                            {title}
                        </h2>
                    )}
                    {description && (
                        <p
                            id="dialog-description"
                            className="mt-1 text-sm text-muted-foreground"
                        >
                            {description}
                        </p>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="hover:bg-glass-border/50 text-muted-foreground hover:text-foreground"
                >
                    <X className="size-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>
            <div className="mt-4">{children}</div>
        </div>
    );

    return createPortal(
        Fragment({ children: [overlay, content] }),
        document.body,
    );
}
