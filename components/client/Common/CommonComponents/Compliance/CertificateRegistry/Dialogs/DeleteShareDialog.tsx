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
import { toast } from 'sonner';

export interface DeleteShareDialogProps {
  open: boolean;
  onClose: () => void;
  certificateAlias: string;
  shareAlias: string;
}

const DeleteShareDialog: React.FC<DeleteShareDialogProps> = ({
  open,
  onClose,
  certificateAlias,
  shareAlias,
}) => {
  const [deleteShare, { isLoading: isDeleteShareLoading }] =
    useDeleteShareMutation();

  const handleDelete = async () => {
    try {
      await deleteShare({ certificateAlias, shareAlias }).unwrap();
      toast.success('Share removed successfully.');
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
            Remove Share
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this share? This tenant will no
            longer have access to this certificate. This action cannot be
            undone.
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
            disabled={isDeleteShareLoading}
          >
            {isDeleteShareLoading && (
              <Loading className='text-danger! size-4' />
            )}
            Remove Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteShareDialog;
