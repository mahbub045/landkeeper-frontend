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
import { useDeleteShareMutation } from '@/store/api/endpoints/client/Common/Compliance/CertificateSharesApi';
import { DeleteShareDialogProps } from '@/types/client/Common/Compliance/CertificateSharesTypes';
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

  const handleDelete = async () => {
    try {
      await deleteShare({
        certificateAlias: certificateAlias,
        payload: { tenant: tenantAliases },
      }).unwrap();
      toast.success(
        tenantAliases.length > 1
          ? 'Shares removed successfully.'
          : 'Share removed successfully.',
      );
      onDeleted?.();
      onClose();
    } catch (error) {
      toast.error('Failed to remove share.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-100'>
        <DialogHeader>
          <DialogTitle className='text-foreground text-xl font-bold'>
            Remove {tenantAliases.length > 1 ? 'Shares' : 'Share'}
          </DialogTitle>
          <DialogDescription>
            {tenantAliases.length > 1
              ? `Are you sure you want to remove these ${tenantAliases.length} shares? These tenants will no longer have access to this certificate.`
              : 'Are you sure you want to remove this share? This tenant will no longer have access to this certificate.'}{' '}
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            disabled={isDeleteShareLoading}
          >
            Cancel
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={isDeleteShareLoading || tenantAliases.length === 0}
          >
            {isDeleteShareLoading ? (
              <>
                <Loading className='text-danger! size-4' /> Removeing...
              </>
            ) : (
              `Remove${tenantAliases.length > 1 ? ` (${tenantAliases.length})` : ''}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteShareDialog;
