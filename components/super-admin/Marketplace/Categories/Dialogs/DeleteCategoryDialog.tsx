'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteMarketplaceCategoryMutation } from '@/store/api/endpoints/super-admin/Marketplace/MarketplaceApi';
import { DeleteCategoryDialogProps } from '@/types/super-admin/Marketplace/MarketplaceTypes';
import { LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

const DeleteCategoryDialog: React.FC<DeleteCategoryDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  const [deleteCategory, { isLoading }] =
    useDeleteMarketplaceCategoryMutation();

  async function handleDelete() {
    if (!category) return;
    try {
      await deleteCategory({ alias: category.alias }).unwrap();
      toast.success('Category deleted successfully.');
      onClose();
    } catch {
      toast.error('Failed to delete category. Please try again.');
    }
  }

  const providerCount = category?.provider_count ?? 0;

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      title='Delete this category?'
      targetLabel='Category to delete'
      targetName={category?.name}
      targetSubtext={category?.slug}
      targetIcon={LayoutGrid}
      impactNote={
        providerCount > 0
          ? `${providerCount} ${providerCount === 1 ? 'provider is' : 'providers are'} linked to this category and will no longer appear under it.`
          : undefined
      }
      cancelLabel='Keep Category'
      confirmLabel='Delete Category'
    />
  );
};

export default DeleteCategoryDialog;
