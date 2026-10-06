'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteMarketplaceProviderMutation } from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import { DeleteProviderDialogProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { Store } from 'lucide-react';
import { toast } from 'sonner';

const DeleteProviderDialog: React.FC<DeleteProviderDialogProps> = ({
  open,
  onClose,
  provider,
}) => {
  const [deleteProvider, { isLoading }] =
    useDeleteMarketplaceProviderMutation();

  async function handleDelete() {
    if (!provider) return;
    try {
      await deleteProvider({ alias: provider.alias }).unwrap();
      toast.success('Provider deleted successfully.');
      onClose();
    } catch {
      toast.error('Failed to delete provider. Please try again.');
    }
  }

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this provider?'
      targetLabel='Provider to delete'
      targetName={provider?.name}
      targetSubtext={provider?.website_url ?? provider?.slug}
      targetIcon={Store}
      impactNote='The provider will be removed from the marketplace and landlords will no longer be able to see or contact them through Landkeeper.'
      cancelLabel='Keep Provider'
      confirmLabel='Delete Provider'
    />
  );
};

export default DeleteProviderDialog;
