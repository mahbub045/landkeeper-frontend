'use client';

import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteShareMutation } from '@/store/api/endpoints/client/Common/Compliance/CertificateSharesApi';
import { DeleteShareDialogProps } from '@/types/client/Common/Compliance/CertificateSharesTypes';
import { Share2, UserX } from 'lucide-react';
import { toast } from 'sonner';

const DeleteShareDialog: React.FC<DeleteShareDialogProps> = ({
  open,
  onClose,
  certificateAlias,
  tenantAliases,
  onDeleted,
}) => {
  const [deleteShare, { isLoading: isDeleteShareLoading }] =
    useDeleteShareMutation();

  const isMultiple = tenantAliases.length > 1;

  const handleDelete = async () => {
    try {
      await deleteShare({
        certificateAlias: certificateAlias,
        payload: { tenant: tenantAliases },
      }).unwrap();
      toast.success(
        isMultiple
          ? 'Shares removed successfully.'
          : 'Share removed successfully.',
      );
      onDeleted?.();
      onClose();
    } catch {
      toast.error('Failed to remove share.');
    }
  };

  return (
    <DeleteConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isDeleteShareLoading}
      confirmDisabled={tenantAliases.length === 0}
      icon={UserX}
      title={isMultiple ? 'Remove these shares?' : 'Remove this share?'}
      targetLabel='Certificate shared with'
      targetName={`${tenantAliases.length} ${isMultiple ? 'tenants' : 'tenant'}`}
      targetIcon={Share2}
      impactTitle='What happens next'
      impactNote={
        isMultiple
          ? 'These tenants will no longer have access to this certificate.'
          : 'This tenant will no longer have access to this certificate.'
      }
      cancelLabel={isMultiple ? 'Keep Shares' : 'Keep Share'}
      confirmLabel={`Remove${isMultiple ? ` (${tenantAliases.length})` : ''}`}
    />
  );
};

export default DeleteShareDialog;
