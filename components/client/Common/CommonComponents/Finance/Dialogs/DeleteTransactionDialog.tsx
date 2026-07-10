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
import { useDeleteFinanceMutation } from '@/store/api/endpoints/client/Common/Finance/FinanceApi';
import { DeleteTransactionDialogProps } from '@/types/client/Common/Finance/FinanceTypes';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  open,
  onClose,
  onSuccess,
  transactionAlias,
  transactionDescription,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteFinance, { isLoading }] = useDeleteFinanceMutation();

  async function handleDelete() {
    try {
      await deleteFinance({ finance_alias: transactionAlias }).unwrap();
      toast.success('Transaction deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete transaction. Please try again.');
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className='w-full p-0 sm:max-w-md'>
        <DialogHeader className='border-b px-6 pt-6 pb-4'>
          <DialogTitle className='text-foreground flex items-center gap-2 text-xl font-bold'>
            <AlertTriangle className='text-destructive size-5' />
            Delete Transaction
          </DialogTitle>
          <DialogDescription>This action is irreversible.</DialogDescription>
        </DialogHeader>

        <div className='px-6 py-5'>
          {error && (
            <p className='text-danger mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm dark:border-red-900/40 dark:bg-red-950/30'>
              {error}
            </p>
          )}

          <p className='text-foreground text-center'>
            Are you sure you want to delete{' '}
            <span className='text-danger font-bold'>
              {transactionDescription}
            </span>
            ?<br /> This will permanently remove the transaction and all
            associated data.
          </p>
          <p className='text-danger mt-3 text-center text-sm'>
            This action cannot be undone.
          </p>
        </div>

        <div className='flex items-center justify-end gap-3 border-t px-6 py-4'>
          <Button variant='outline' onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant='danger' onClick={handleDelete} disabled={loading}>
            {loading && <Loading className='text-white!' />}
            Delete Transaction
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransactionDialog;
