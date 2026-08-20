import { useDialog } from '@/context/dialog-context';
import { Hydrant } from '@/types';
import HydrantActionDialog from './hydrant-action-dialog';
import HydrantDeleteDialog from './hydrant-delete-dialog';

export default function HydrantDialogs() {
    const { open, setOpen, currentRow } = useDialog<Hydrant>();
    return (
        <>
            <HydrantActionDialog key={'hydrant-add'} open={open === 'add'} onOpenChange={() => setOpen('add')} />
            {currentRow && (
                <HydrantActionDialog
                    key={`hydrant-edit-${currentRow.id}`}
                    open={open === 'edit'}
                    onOpenChange={() => setOpen('edit')}
                    currentRow={currentRow}
                />
            )}
            {currentRow && (
                <HydrantDeleteDialog
                    key={`hydrant-delete-${currentRow.id}`}
                    open={open === 'delete'}
                    onOpenChange={() => setOpen('delete')}
                    currentRow={currentRow as Hydrant}
                />
            )}
        </>
    );
}