import ConfirmDialog from '@/components/confirm-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from '@inertiajs/react';
import { TriangleAlert } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Hydrant } from '@/types';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentRow: Hydrant;
}

export default function HydrantDeleteDialog({ open, onOpenChange, currentRow }: Props) {
    const [value, setValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { delete: destroy, processing } = useForm();

    const handleClose = () => {
        setValue('');
        setErrorMessage('');
        onOpenChange(false);
    };

    const handleDelete = () => {
        if (value !== currentRow.kode_unik) {
            setErrorMessage('Kode unik tidak sesuai');
            return;
        }
        destroy(`/fire-safety/hydrant/${currentRow.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Data Hydrant berhasil dihapus');
                setTimeout(() => {
                    handleClose();
                }, 800);
            },
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (errorMessage) setErrorMessage('');
    };

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            title={
                <span className="text-destructive">
                    <TriangleAlert className="stroke-destructive mr-1 inline-block" size={18} /> Hapus Data
                </span>
            }
            desc={
                <span className="text-muted-foreground">
                    Apakah Anda yakin ingin menghapus Hydrant <span className="font-bold text-foreground">{currentRow.kode_unik}</span>?
                </span>
            }
            confirmText={processing ? 'Menghapus...' : 'Hapus'}
            cancelBtnText="Batal"
            destructive
        >
            <div className="grid gap-3">
                <Label className="text-sm text-muted-foreground">
                    Untuk mengkonfirmasi, silakan ketik kode unik <span className="font-bold text-foreground">{currentRow.kode_unik}</span>:
                </Label>
                <Alert variant="destructive">
                    <AlertTitle>Perhatian!</AlertTitle>
                    <AlertDescription>Tindakan ini tidak dapat dibatalkan.</AlertDescription>
                </Alert>
                <Separator />
                <div className="flex w-full items-center gap-2 rounded-md border border-red-300/60 bg-red-50 p-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                    <span>
                        Ketik: <span className="font-bold">{currentRow.kode_unik}</span>
                    </span>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Label htmlFor="confirmation" className="text-sm font-medium">
                    Konfirmasi Penghapusan
                </Label>
                <Input
                    type="text"
                    id="confirmation"
                    value={value}
                    onChange={handleChange}
                    placeholder={`Ketik "${currentRow.kode_unik}" untuk konfirmasi`}
                    disabled={processing}
                />
                {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>}
            </div>
        </ConfirmDialog>
    );
}