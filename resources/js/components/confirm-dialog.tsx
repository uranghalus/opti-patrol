import type { JSX, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    disabled?: boolean;
    desc: JSX.Element | string;
    cancelBtnText?: string;
    confirmText?: ReactNode;
    destructive?: boolean;
    handleConfirm: () => void;
    isLoading?: boolean;
    className?: string;
    children?: ReactNode;
    confirmDisabled?: boolean;
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
    const {
        title,
        desc,
        children,
        className,
        confirmText,
        cancelBtnText,
        destructive,
        isLoading,
        disabled = false,
        handleConfirm,
        ...actions
    } = props;

    return (
        <AlertDialog {...actions}>
            <AlertDialogContent className={cn(className && className)}>
                <AlertDialogHeader className="text-left">
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div>{desc}</div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {children}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        {cancelBtnText ?? 'Cancel'}
                    </AlertDialogCancel>
                    <Button
                        variant={destructive ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={disabled || isLoading}
                    >
                        {confirmText ?? 'Continue'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
