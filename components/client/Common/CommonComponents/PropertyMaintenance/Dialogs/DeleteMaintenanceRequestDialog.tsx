'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeletePropertyMaintenanceMutation } from '@/store/api/endpoints/client/Common/PropertyMaintenance/PropertyMaintenanceApi';
import { DeleteMaintenanceRequestDialogProps } from '@/types/client/Common/PropertyMaintenance/PropertyMaintenanceType';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const DeleteMaintenanceRequestDialog: React.FC<
  DeleteMaintenanceRequestDialogProps
> = ({ isOpen, onClose, maintenanceRequestAlias, maintenanceRequestId }) => {
  const [deleteMaintenanceRequest, { isLoading }] =
    useDeletePropertyMaintenanceMutation();

  const handleClose = () => {
    if (isLoading) return;
    onClose();
  };

  const handleDelete = async () => {
    if (!maintenanceRequestAlias || isLoading) return;

    try {
      await deleteMaintenanceRequest(maintenanceRequestAlias).unwrap();

      toast.success('Maintenance request deleted successfully.');
      onClose();
    } catch {
      toast.error('Failed to delete maintenance request.');
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className='overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md'>
        {/* Header */}
        <DialogHeader className='to-background flex flex-col items-center bg-linear-to-b from-red-50 px-6 pt-8 pb-6 dark:from-red-950/30'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>

          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Maintenance Request
          </DialogTitle>

          <DialogDescription className='mt-2 text-center text-sm'>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='space-y-5 px-6 py-6'>
          <p className='text-muted-foreground text-center text-sm leading-7'>
            You&rsquo;re about to permanently delete this maintenance request.
          </p>

          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center dark:border-red-900/50 dark:bg-red-950/30'>
            <span className='text-lg font-semibold text-red-600'>
              {maintenanceRequestId}
            </span>
          </div>

          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <p className='text-center text-sm leading-6 text-amber-700 dark:text-amber-300'>
              The maintenance request and its associated documents will be
              permanently removed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className='border-t bg-gray-50 px-6 py-6 dark:bg-gray-950/50'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loading className='size-4 text-white!' />}
            {isLoading ? 'Deleting...' : 'Delete Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMaintenanceRequestDialog;
