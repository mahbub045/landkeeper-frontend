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
import { useDeleteInvitedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { DeleteInvitedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/InvitedUsersTypes';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

const DeleteInvitedUserDialog: React.FC<DeleteInvitedUserDialogProps> = ({
  isOpen,
  onClose,
  inviteUserData,
}) => {
  const [deleteInvitedUser, { isLoading }] = useDeleteInvitedUserMutation();

  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleClose = () => {
    setGeneralError(null);
    onClose();
  };

  const handleDelete = async () => {
    if (!inviteUserData) return;

    setGeneralError(null);

    try {
      await deleteInvitedUser(inviteUserData.alias).unwrap();

      toast.success('Invitation deleted successfully');
      handleClose();
    } catch (error) {
      console.error('Delete Invitation Error:', error);

      let message = 'Failed to delete invitation. Please try again.';

      if ((error as FetchBaseQueryError)?.status) {
        const fetchError = error as FetchBaseQueryError;

        if (fetchError.data && typeof fetchError.data === 'object') {
          const data = fetchError.data as {
            detail?: string;
            message?: string;
            error?: string;
          };

          message = data.detail || data.message || data.error || message;
        } else if ('error' in fetchError) {
          message = fetchError.error;
        }
      } else {
        const serializedError = error as SerializedError;

        if (serializedError.message) {
          message = serializedError.message;
        }
      }

      setGeneralError(message);
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Delete Invitation</DialogTitle>

          <DialogDescription>
            {inviteUserData ? (
              <>
                Are you sure you want to delete the invitation sent to{' '}
                <span className='text-danger font-medium'>
                  {inviteUserData.email}
                </span>
                ? This action cannot be undone.
              </>
            ) : (
              'Are you sure you want to delete this invitation? This action cannot be undone.'
            )}
          </DialogDescription>
        </DialogHeader>

        {generalError && (
          <div className='bg-danger/10 text-danger flex items-center gap-2 rounded-md px-3 py-2 text-xs'>
            <AlertCircle className='size-4 shrink-0' />
            {generalError}
          </div>
        )}

        <DialogFooter className='gap-2 sm:gap-2'>
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
            variant='danger'
            onClick={handleDelete}
            disabled={isLoading || !inviteUserData}
          >
            {isLoading && <Loading className='text-white!' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteInvitedUserDialog;
