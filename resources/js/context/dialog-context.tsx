import { createContext, useContext, useState } from 'react';

type DialogType = string | boolean | null;

interface DialogContextType<T> {
    open: DialogType;
    setOpen: (val: DialogType) => void;
    currentRow: T | null;
    setCurrentRow: React.Dispatch<React.SetStateAction<T | null>>;
}

const DialogContext = createContext<DialogContextType<any> | null>(null);

interface Props {
    children: React.ReactNode;
}

export function DialogProvider<T>({ children }: Props) {
    const [open, setOpen] = useState<DialogType>(null);
    const [currentRow, setCurrentRow] = useState<T | null>(null);

    return (
        <DialogContext.Provider value={{ open, setOpen, currentRow, setCurrentRow }}>
            {children}
        </DialogContext.Provider>
    );
}

export function useDialog<T>() {
    const context = useContext(DialogContext);
    if (!context) throw new Error('useDialog must be used within <DialogProvider>');
    return context as DialogContextType<T>;
}