import { useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Hydrant } from '@/types';

interface Props {
    currentRow?: Hydrant;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HydrantActionDialog({ onOpenChange, open, currentRow }: Props) {
    const isEdit = !!currentRow;
    const {
        data,
        setData,
        post,
        put,
        processing,
        reset,
        errors: zodError,
    } = useForm({
        id: currentRow?.id,
        kode_unik: currentRow?.kode_unik || '',
        kode_hydrant: currentRow?.kode_hydrant || '',
        tipe: currentRow?.tipe || 'Indoor',
        ukuran: currentRow?.ukuran || '',
        lantai: currentRow?.lantai || '',
        lokasi: currentRow?.lokasi || '',
    });

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(`/fire-safety/hydrant/${currentRow?.id}`, {
                onSuccess: () => {
                    toast.success('Data Hydrant berhasil diubah');
                    setTimeout(() => {
                        handleClose();
                        reset();
                    }, 800);
                },
                preserveScroll: true,
            });
        } else {
            post('/fire-safety/hydrant', {
                onSuccess: () => {
                    toast.success('Data Hydrant berhasil ditambah');
                    setTimeout(() => {
                        handleClose();
                        reset();
                    }, 800);
                },
                preserveScroll: true,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="border-border/60 bg-background/85 max-w-md rounded-xl backdrop-blur-xl backdrop-saturate-[140%]">
                <DialogHeader className="text-left">
                    <DialogTitle>{isEdit ? 'Edit Hydrant' : 'Tambah Hydrant Baru'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="kode_unik">Kode Unik</Label>
                        <Input
                            id="kode_unik"
                            value={data.kode_unik}
                            onChange={(e) => setData('kode_unik', e.target.value)}
                            placeholder="Contoh: HYD-001"
                        />
                        {zodError.kode_unik && <p className="text-xs text-red-500">{zodError.kode_unik}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="kode_hydrant">Kode Hydrant</Label>
                        <Input
                            id="kode_hydrant"
                            value={data.kode_hydrant}
                            onChange={(e) => setData('kode_hydrant', e.target.value)}
                            placeholder="Contoh: HYD Utama"
                        />
                        {zodError.kode_hydrant && <p className="text-xs text-red-500">{zodError.kode_hydrant}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-2">
                            <Label htmlFor="tipe">Tipe</Label>
                            <Select value={data.tipe} onValueChange={(value) => setData('tipe', value as 'Indoor' | 'Outdoor')}>
                                <SelectTrigger id="tipe" className="w-full">
                                    <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Indoor">Indoor</SelectItem>
                                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                                </SelectContent>
                            </Select>
                            {zodError.tipe && <p className="text-xs text-red-500">{zodError.tipe}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="ukuran">Ukuran</Label>
                            <Input
                                id="ukuran"
                                value={data.ukuran}
                                onChange={(e) => setData('ukuran', e.target.value)}
                                placeholder="2.5 inch"
                            />
                            {zodError.ukuran && <p className="text-xs text-red-500">{zodError.ukuran}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lantai">Lantai</Label>
                        <Input
                            id="lantai"
                            value={data.lantai ?? ''}
                            onChange={(e) => setData('lantai', e.target.value)}
                            placeholder="Contoh: Lantai 1"
                        />
                        {zodError.lantai && <p className="text-xs text-red-500">{zodError.lantai}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lokasi">Lokasi</Label>
                        <Input
                            id="lokasi"
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                            placeholder="Contoh: Lobby Utama"
                        />
                        {zodError.lokasi && <p className="text-xs text-red-500">{zodError.lokasi}</p>}
                    </div>

                    <DialogFooter className="flex items-center justify-between gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {isEdit ? 'Update Hydrant' : 'Tambah Hydrant'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}