'use client';

import Loading from '@/components/common/CustomLoader/Loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteMortgageMutation } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { DeleteMortgageDialogProps } from '@/types/client/Common/Mortgage/MortgageTypes';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const DeleteMortgageDialog: React.FC<DeleteMortgageDialogProps> = ({
  open,
  onClose,
  onSuccess,
  mortgageAlias,
}) => {
  const [deleteMortgage, { isLoading }] = useDeleteMortgageMutation();

  async function handleDelete() {
    try {
      await deleteMortgage({
        mortgage_alias: mortgageAlias,
      }).unwrap();
      toast.success('Mortgage deleted successfully.');
      onSuccess?.();
      onClose();
      window.history.back();
    } catch {
      toast.error('Failed to delete mortgage. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='overflow-hidden rounded-2xl border-0 p-0 shadow-2xl sm:max-w-md'>
        {/* Header */}
        <DialogHeader className='to-background flex flex-col items-center bg-linear-to-b from-red-50 px-6 pt-8 pb-6 dark:from-red-950/30'>
          <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30'>
            <AlertTriangle className='h-8 w-8 text-red-600' />
          </div>

          <DialogTitle className='text-center text-2xl font-bold'>
            Delete Mortgage
          </DialogTitle>

          <DialogDescription className='mt-2 text-center text-sm'>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        <div className='space-y-5 px-6'>
          <p className='text-muted-foreground text-center text-sm leading-7'>
            You&rsquo;re about to permanently delete this mortgage record.
          </p>

          <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-4 dark:border-red-900/50 dark:bg-red-950/30'>
            <p className='text-center text-sm font-medium text-red-600'>
              Once deleted, the mortgage record and any associated payment
              history or related information will be permanently removed.
            </p>
          </div>

          <div className='rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/20'>
            <p className='text-center text-sm leading-6 text-amber-700 dark:text-amber-300'>
              Please make sure you no longer need this mortgage record before
              continuing.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-muted/20 flex justify-end gap-3 border-t px-6 py-5'>
          <Button
            variant='outline'
            onClick={onClose}
            disabled={isLoading}
            className='min-w-24'
          >
            Cancel
          </Button>

          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
            className='min-w-40'
          >
            {isLoading && <Loading className='text-danger/50!' />}
            Delete Mortgage
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMortgageDialog;
