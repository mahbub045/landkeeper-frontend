import DeleteConfirmDialog from '@/components/common/DeleteConfirmDialog/DeleteConfirmDialog';
import { useDeleteInvitedUserMutation } from '@/store/api/endpoints/client/Common/Tools/TeamAccess/TeamAccessApi';
import { DeleteInvitedUserDialogProps } from '@/types/client/Common/Tools/TeamAccess/InvitedUsersTypes';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mail } from 'lucide-react';
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
    <DeleteConfirmDialog
      open={isOpen}
      onClose={handleClose}
      onConfirm={handleDelete}
      isLoading={isLoading}
      confirmDisabled={!inviteUserData}
      title='Delete this invitation?'
      targetLabel='Invitation sent to'
      targetName={inviteUserData?.email}
      targetIcon={Mail}
      impactTitle='What happens next'
      impactNote='The invitation will be permanently removed and the recipient will no longer be able to use it to join your team.'
      error={generalError}
      cancelLabel='Keep Invitation'
      confirmLabel='Delete Invitation'
    />
  );
};

export default DeleteInvitedUserDialog;
