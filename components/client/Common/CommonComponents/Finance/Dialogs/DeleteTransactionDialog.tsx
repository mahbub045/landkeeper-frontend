'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteFinanceMutation } from '@/store/api/endpoints/client/Common/Finance/FinanceApi';
import { DeleteTransactionDialogProps } from '@/types/client/Common/Finance/FinanceTypes';
import { Database, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: Receipt, label: 'Transaction' },
  { icon: Database, label: 'Financial records' },
];

const DeleteTransactionDialog: React.FC<DeleteTransactionDialogProps> = ({
  open,
  onClose,
  onSuccess,
  transactionAlias,
  transactionDescription,
}) => {
  const [deleteFinance, { isLoading }] = useDeleteFinanceMutation();

  async function handleDelete() {
    try {
      await deleteFinance({
        finance_alias: transactionAlias,
      }).unwrap();

      toast.success('Transaction deleted successfully.');
      onSuccess?.();
      onClose();
    } catch {
      toast.error('Failed to delete transaction. Please try again.');
    }
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this transaction?'
      targetLabel='Transaction to delete'
      targetName={transactionDescription}
      targetIcon={Receipt}
      impactItems={IMPACT_ITEMS}
      cancelLabel='Keep Transaction'
      confirmLabel='Delete Transaction'
    />
  );
};

export default DeleteTransactionDialog;
