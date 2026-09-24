'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteMortgageMutation } from '@/store/api/endpoints/client/Common/Mortgage/MortgageApi';
import { DeleteMortgageDialogProps } from '@/types/client/Common/Mortgage/MortgageTypes';
import { Database, History, Landmark } from 'lucide-react';
import { toast } from 'sonner';

const IMPACT_ITEMS = [
  { icon: Landmark, label: 'Mortgage record' },
  { icon: History, label: 'Payment history' },
  { icon: Database, label: 'Related info' },
];

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
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this mortgage?'
      impactItems={IMPACT_ITEMS}
      impactNote='Please make sure you no longer need this mortgage record before continuing.'
      cancelLabel='Keep Mortgage'
      confirmLabel='Delete Mortgage'
    />
  );
};

export default DeleteMortgageDialog;
